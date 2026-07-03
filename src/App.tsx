import React, { useState, useEffect } from 'react';
import { Transaction } from './types';
import { INITIAL_TRANSACTIONS } from './mockData';
import TransactionForm from './components/TransactionForm';
import FinancialSummary from './components/FinancialSummary';
import ChartsPanel from './components/ChartsPanel';
import TransactionList from './components/TransactionList';
import AiChatbot from './components/AiChatbot';
import { 
  Sparkles, 
  RotateCcw, 
  Download, 
  Upload, 
  Sun, 
  Moon, 
  FileSpreadsheet, 
  TrendingUp, 
  BrainCircuit, 
  ArrowUpRight, 
  Wallet,
  Info,
  Trash2
} from 'lucide-react';

export default function App() {
  // 1. Core State: Load from localStorage or start empty by default
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('family_finance_txs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored transactions:', e);
      }
    }
    return [];
  });

  // 2. Dark/Light Theme Sync State
  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('family_finance_txs', JSON.stringify(transactions));
  }, [transactions]);

  // 3. Transactions Actions
  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transactionWithId: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setTransactions((prev) => [transactionWithId, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('¿Estás seguro de que querés eliminar este movimiento?')) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleResetToMockData = () => {
    if (confirm('Se restablecerán los datos a la simulación inicial (Junio y Julio 2026). ¿Continuar?')) {
      setTransactions(INITIAL_TRANSACTIONS);
    }
  };

  const handleClearAllTransactions = () => {
    if (confirm('¿Estás seguro de que querés borrar TODOS los movimientos de la lista? Esta acción vaciará el gestor.')) {
      setTransactions([]);
    }
  };

  // 4. Import / Export backups
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Copia_Seguridad_Gastos_IA_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (files && files.length > 0) {
      fileReader.readAsText(files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            // Simple validation that at least some core fields exist
            const isValid = parsed.every(item => item.id && item.type && item.category && item.amount);
            if (isValid) {
              setTransactions(parsed);
              alert('¡Copia de seguridad importada con éxito!');
            } else {
              alert('El archivo no tiene el formato correcto de movimientos.');
            }
          } else {
            alert('Formato de datos inválido.');
          }
        } catch (error) {
          alert('No se pudo leer el archivo de copia de seguridad.');
        }
      };
    }
  };

  // 5. Categorize transactions by month (June 2026 vs July 2026)
  // Our system date is set to 2026-07-03, so current month is July (2026-07) and previous is June (2026-06).
  const currentMonthTxs = transactions.filter((t) => t.date.startsWith('2026-07'));
  const previousMonthTxs = transactions.filter((t) => t.date.startsWith('2026-06'));

  // Calculate totals for a short auto-generated insight bar
  const totalJulyExpense = currentMonthTxs
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalJulyIncome = currentMonthTxs
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const julyBalance = totalJulyIncome - totalJulyExpense;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      
      {/* 1. Header Navigation Bar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-sm flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-indigo-400 dark:text-indigo-600" />
            </div>
            <div>
              <h1 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                Gestor de Gastos Inteligente
                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.2 rounded-full border border-indigo-100/50 dark:border-indigo-900/10">
                  <Sparkles className="w-2 h-2" /> IA
                </span>
              </h1>
              <span className="text-[10px] text-slate-400 font-medium">Finanzas Familiares de Doble Entrada</span>
            </div>
          </div>

          {/* Quick utility controls */}
          <div className="flex items-center gap-2">
            
            {/* Backup actions */}
            <div className="hidden sm:flex items-center gap-1.5 border-r border-slate-100 dark:border-slate-800 pr-3 mr-1">
              <button
                onClick={handleExportData}
                className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="Exportar copia de seguridad (JSON)"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold">Respaldar</span>
              </button>
              
              <label 
                className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="Importar copia de seguridad (JSON)"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold">Restaurar</span>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImportData} 
                  className="hidden" 
                />
              </label>
            </div>

            {/* Reset Sim */}
            <button
              onClick={handleResetToMockData}
              className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              title="Cargar datos de simulación inicial"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Clear All */}
            <button
              onClick={handleClearAllTransactions}
              className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
              title="Borrar todos los movimientos (Iniciar en blanco)"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
              title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main content stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top Header Banner for Quick Status */}
        <div id="quick-insight-banner" className="bg-indigo-600 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <h3 className="text-base font-bold font-display flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
              Resumen Automático del Mes (Julio 2026)
            </h3>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Llevas {julyBalance >= 0 ? 'un saldo neto a favor de' : 'un déficit temporal de'} <span className="font-bold">${Math.abs(julyBalance).toLocaleString('es-AR')}</span>. 
              {julyBalance >= 0 
                ? ' ¡Excelente trabajo! Tu tasa de ahorro es saludable. El asistente de IA está listo para sugerirte oportunidades de inversión o recortes en tus consumos variables.' 
                : ' Te sugerimos revisar las categorías móviles de supermercado y salidas para equilibrar el saldo disponible de este mes.'}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-indigo-500/20 px-3 py-2 rounded-xl border border-indigo-500/30 shrink-0 self-start sm:self-center">
            <Info className="w-3.5 h-3.5 text-indigo-200" />
            <span className="text-[10px] font-bold text-indigo-100">Hoy es Viernes 3 de Julio, 2026</span>
          </div>
        </div>

        {/* 3. Monthly Financial Summary (Cards: Income, Expenses, Balance, Alerts) */}
        <FinancialSummary 
          currentTransactions={currentMonthTxs} 
          previousTransactions={previousMonthTxs} 
        />

        {/* 4. Bento Grid Widgets (Input Form, Charts, List & Chatbot side-by-side) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT WIDGETS COLUMN (8 cols of 12) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Input Form Box (Tabs for manual & IA parsing) */}
            <TransactionForm onAddTransaction={handleAddTransaction} />

            {/* Recharts Analytics Panel (Pie Chart & Side-by-side Bar chart) */}
            <ChartsPanel 
              currentTransactions={currentMonthTxs} 
              previousTransactions={previousMonthTxs} 
            />

            {/* List with recent movements (filtering, searching, deleting) */}
            <TransactionList 
              transactions={transactions} 
              onDeleteTransaction={handleDeleteTransaction} 
            />

          </div>

          {/* RIGHT WIDGETS COLUMN (4 cols of 12) - Sticky Assistant Panel */}
          <div className="lg:col-span-4 lg:sticky lg:top-22">
            
            {/* Interactive Conversational AI Side Panel */}
            <AiChatbot transactions={transactions} />

          </div>

        </div>

      </main>

      {/* Footer copyright */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <BrainCircuit className="w-4 h-4 text-slate-300 dark:text-slate-700" />
          <span>Gestor de Gastos Inteligente © 2026</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportData} className="hover:text-slate-600 dark:hover:text-slate-300">Respaldar Datos</button>
          <span>•</span>
          <button onClick={handleResetToMockData} className="hover:text-slate-600 dark:hover:text-slate-300">Restaurar Simulación</button>
        </div>
      </footer>

    </div>
  );
}
