import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client to prevent crashing on boot if key is missing
let aiClient: any = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will be unavailable.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Allowed categories mapped for Gemini
const VALID_CATEGORIES = {
  income: [
    "Sueldo",
    "Trabajos extras",
    "Honorarios",
    "Transferencias recibidas",
    "Reintegros",
    "Otros ingresos eventuales"
  ],
  expense_fixed: [
    "Colegio",
    "Alquiler",
    "Expensas",
    "Servicios",
    "Internet",
    "Celular",
    "Seguros",
    "Cuotas",
    "Préstamos",
    "Impuestos",
    "Obra social",
    "Mantenimiento del auto",
    "Otros pagos previsibles"
  ],
  expense_variable: [
    "Supermercado",
    "Almacén",
    "Carnicería",
    "Verdulería",
    "Combustible",
    "Transporte",
    "Salidas",
    "Delivery",
    "Ropa",
    "Farmacia",
    "Regalos",
    "Arreglos del hogar",
    "Otros consumos móviles"
  ]
};

// API Endpoint 1: Parse natural language input into structured transaction
app.post("/api/parse-transaction", async (req, res) => {
  try {
    const { text, date } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API service is offline (missing API Key)" });
    }

    const systemInstruction = `Eres un parsedor inteligente de finanzas personales. Tu tarea es analizar una frase en lenguaje natural que describe un movimiento de dinero (un ingreso o un egreso) y transformarla en una estructura JSON exacta.

Categorías válidas de INGRESOS:
${VALID_CATEGORIES.income.map(c => `- ${c}`).join("\n")}

Categorías válidas de EGRESOS FIJOS (expenseType: "fixed"):
${VALID_CATEGORIES.expense_fixed.map(c => `- ${c}`).join("\n")}

Categorías válidas de EGRESOS VARIABLES o MÓVILES (expenseType: "variable"):
${VALID_CATEGORIES.expense_variable.map(c => `- ${c}`).join("\n")}

Instrucciones de mapeo:
1. Determina si es un ingreso ("income") o un egreso ("expense").
2. Elige la categoría de la lista que MEJOR se adapte al concepto de la frase. Si no se adapta a ninguna específica, usa "Otros ingresos eventuales" para ingresos, "Otros pagos previsibles" para gastos fijos, o "Otros consumos móviles" para gastos variables.
3. Extrae la cantidad numérica exacta. Ej: "45.000" o "45mil" es 45000. Si dice "un millón" es 1000000.
4. Genera una descripción corta (máximo 4 palabras) sobre el movimiento. Ej: "Compra en Carrefour", "Cobro de aguinaldo".
5. Si es "expense", determina si es "fixed" (colegio, alquiler, expensas, servicios, seguros, etc.) o "variable" (super, almacén, salidas, delivery, ropa, etc.) según las listas de arriba.

No inventes categorías que no estén en la lista. Respóndeme estrictamente con el JSON solicitado.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Frase del usuario: "${text}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: {
              type: Type.STRING,
              description: "Debe ser 'income' o 'expense'",
              enum: ["income", "expense"]
            },
            category: {
              type: Type.STRING,
              description: "La categoría exacta elegida de las listas de categorías válidas"
            },
            amount: {
              type: Type.NUMBER,
              description: "El monto numérico extraído del texto"
            },
            description: {
              type: Type.STRING,
              description: "Descripción breve del movimiento (ej: 'Sueldo mensual', 'Arreglo canilla', 'Hamburguesa')"
            },
            expenseType: {
              type: Type.STRING,
              description: "Obligatorio si type es 'expense'. Debe ser 'fixed' o 'variable'.",
              enum: ["fixed", "variable"]
            }
          },
          required: ["type", "category", "amount", "description"]
        }
      }
    });

    const parsedData = JSON.parse(response.text.trim());
    
    // Fallback standard validation on backend
    if (!parsedData.date) {
      parsedData.date = date || new Date().toISOString().split('T')[0];
    }
    
    res.json({ success: true, transaction: parsedData });
  } catch (error: any) {
    console.error("Error in parse-transaction endpoint:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// API Endpoint 2: Chat Assistant to analyze the financial spreadsheet
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, transactions } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array" });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API service is offline (missing API Key)" });
    }

    // Format current transactions spreadsheet for the model's awareness
    const txSummary = transactions && Array.isArray(transactions) && transactions.length > 0
      ? transactions.map((t: any) => {
          const typeStr = t.type === 'income' ? 'Ingreso' : 'Egreso';
          const subTypeStr = t.type === 'expense' ? ` (${t.expenseType === 'fixed' ? 'Fijo' : 'Variable'})` : '';
          return `- Fecha: ${t.date} | Tipo: ${typeStr}${subTypeStr} | Categoría: ${t.category} | Monto: $${t.amount.toLocaleString('es-AR')} | Detalle: ${t.description}`;
        }).join("\n")
      : "No hay movimientos registrados para este mes todavía.";

    // Calculate basic totals for the AI's convenience
    let totalIncome = 0;
    let totalExpense = 0;
    let totalFixed = 0;
    let totalVariable = 0;

    if (transactions && Array.isArray(transactions)) {
      transactions.forEach((t: any) => {
        if (t.type === 'income') {
          totalIncome += t.amount;
        } else {
          totalExpense += t.amount;
          if (t.expenseType === 'fixed') {
            totalFixed += t.amount;
          } else {
            totalVariable += t.amount;
          }
        }
      });
    }

    const balance = totalIncome - totalExpense;
    const statsSummary = `RESUMEN FINANCIERO ACTUAL:
- Total de Ingresos: $${totalIncome.toLocaleString('es-AR')}
- Total de Egresos: $${totalExpense.toLocaleString('es-AR')}
  * Gastos Fijos: $${totalFixed.toLocaleString('es-AR')}
  * Gastos Variables: $${totalVariable.toLocaleString('es-AR')}
- Saldo Disponible: $${balance.toLocaleString('es-AR')} (Ingresos - Egresos)
`;

    const systemInstruction = `Eres un asesor financiero familiar e inteligente altamente capacitado. Tu objetivo es ayudar a los usuarios a comprender, analizar y optimizar su economía doméstica basándote estrictamente en sus movimientos financieros reales.

Aquí tienes el estado de sus finanzas actuales y su lista de movimientos:

${statsSummary}

MOVIMIENTOS CARGADOS:
${txSummary}

Instrucciones para responder:
1. Responde de forma clara, empática, alentadora y práctica. No uses términos de contabilidad complejos. Habla directamente a un miembro de la familia.
2. Si el usuario te hace preguntas como:
   - “¿En qué estoy gastando más este mes?” -> Analiza las categorías de egresos y reporta la de mayor monto, junto con su porcentaje sobre el total de egresos.
   - “¿Cuánto me queda disponible?” -> Indica el Saldo Disponible con su cálculo (Ingresos menos Egresos).
   - “¿Qué gastos fijos tengo este mes?” -> Enumera los movimientos de tipo Egreso Fijo (fixed) con sus respectivos montos y categorías.
   - “¿Cuánto gasté en supermercado?” -> Suma los montos de la categoría "Supermercado" e indícalo claramente.
   - “¿Qué puedo recortar?” -> Analiza los gastos variables (variable), que son los que cambian mes a mes (ej: salidas, delivery, ropa, etc.) y sugiere recortes realistas con buen criterio.
   - “¿Cómo viene este mes comparado con el anterior?” -> El usuario te puede dar información del mes anterior o, si no la hay, ofrécele consejos generales para comparar sus gastos móviles y fijos.
3. Si el usuario te hace preguntas fuera de lo financiero, reoriéntalo amablemente al control de sus finanzas.
4. Responde en Español de Argentina/Latinoamérica de forma natural y cálida (ej: podés usar el 'voseo' de manera sutil si se siente natural o simplemente un español neutral-amigable).
5. Usa formato Markdown con negritas, listas y tablas para que la lectura sea rápida y amigable.`;

    // Map conversation messages to the format expected by Gemini
    // Filter system messages, and keep only user and assistant roles
    const contents = messages
      .filter((m: any) => m.role === 'user' || m.role === 'assistant')
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ success: true, answer: response.text });
  } catch (error: any) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
