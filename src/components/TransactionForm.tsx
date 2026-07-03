import React, { useState } from 'react';
import { CATEGORIES } from '../categories';
import { Transaction, TransactionType, ExpenseType } from '../types';
import { Sparkles, Plus, AlertCircle, Calendar, RefreshCw, Check, X, Pencil } from 'lucide-react';
import CategoryIcon from './CategoryIcon';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');

  // Manual Form State
  const [type, setType] = useState<TransactionType>('expense');
  const [expenseType, setExpenseType] = useState<ExpenseType>('variable');
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(() => {
    // Default to current local time date format
    return new Date().toISOString().split('T')[0];
  });
  const [formError, setFormError] = useState<string>('');

  // AI Form State
  const [aiText, setAiText] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>('');
  const [parsedPreview, setParsedPreview] = useState<Omit<Transaction, 'id'> | null>(null);

  // Filter categories based on selected Type and ExpenseType (if expense)
  const filteredCategories = CATEGORIES.filter((c) => {
    if (c.type !== type) return false;
    if (type === 'expense' && c.expenseType !== expenseType) return false;
    return true;
  });

  // Handle category default when type/expenseType changes
  React.useEffect(() => {
    if (filteredCategories.length > 0) {
      setCategory(filteredCategories[0].name);
    } else {
      setCategory('');
    }
  }, [type, expenseType]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const parsedAmount = parseFloat(amount.replace(/\./g, '').replace(/,/g, '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError('Por favor ingresá un monto válido mayor a 0.');
      return;
    }

    if (!category) {
      setFormError('Por favor seleccioná una categoría.');
      return;
    }

    if (!description.trim()) {
      setFormError('Por favor ingresá una descripción o detalle.');
      return;
    }

    onAddTransaction({
      type,
      expenseType: type === 'expense' ? expenseType : undefined,
      category,
      amount: parsedAmount,
      description: description.trim(),
      date,
    });

    // Reset Form
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleAiInterpret = async () => {
    if (!aiText.trim()) {
      setAiError('Por favor ingresá una frase para interpretar.');
      return;
    }

    setIsAiLoading(true);
    setAiError('');
    setParsedPreview(null);

    try {
      const response = await fetch('/api/parse-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiText, date: new Date().toISOString().split('T')[0] }),
      });

      if (!response.ok) {
        throw new Error('No se pudo procesar la frase. Verificá la conexión con la IA.');
      }

      const data = await response.json();
      if (data.success && data.transaction) {
        setParsedPreview(data.transaction);
      } else {
        throw new Error(data.error || 'No se pudo extraer información del texto.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Error al conectar con la IA.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleConfirmAiTransaction = () => {
    if (parsedPreview) {
      onAddTransaction(parsedPreview);
      setParsedPreview(null);
      setAiText('');
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setAiText(prompt);
  };

  return (
    <div id="transaction-form-card" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800">
        <button
          id="btn-tab-manual"
          onClick={() => { setActiveTab('manual'); setFormError(''); }}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'manual'
              ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-slate-100 bg-slate-50/50 dark:bg-slate-800/30'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-50/20'
          }`}
        >
          <Plus className="w-4 h-4" />
          Carga Manual
        </button>
        <button
          id="btn-tab-ai"
          onClick={() => { setActiveTab('ai'); setAiError(''); }}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'ai'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/10 dark:bg-indigo-950/10'
              : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50/20'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-500" />
          Carga por IA
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'manual' ? (
          <form id="manual-entry-form" onSubmit={handleManualSubmit} className="space-y-4">
            {formError && (
              <div id="manual-form-error" className="flex items-start gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* Type Toggle (Income / Expense) */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
              <button
                type="button"
                id="btn-type-expense"
                onClick={() => setType('expense')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                  type === 'expense'
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                Egreso (Gasto)
              </button>
              <button
                type="button"
                id="btn-type-income"
                onClick={() => setType('income')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                  type === 'income'
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                Ingreso
              </button>
            </div>

            {/* Expense Type Toggle (Fixed / Variable) - Only visible if type is 'expense' */}
            {type === 'expense' && (
              <div className="flex gap-4 items-center p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/50">
                <span className="text-xs font-medium text-slate-500">Tipo de Gasto:</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="expenseType"
                      checked={expenseType === 'fixed'}
                      onChange={() => setExpenseType('fixed')}
                      className="text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <span>Gasto Fijo <span className="text-[10px] text-slate-400 font-normal">(colegio, alquiler, etc)</span></span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="expenseType"
                      checked={expenseType === 'variable'}
                      onChange={() => setExpenseType('variable')}
                      className="text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <span>Gasto Variable <span className="text-[10px] text-slate-400 font-normal">(super, salidas, etc)</span></span>
                  </label>
                </div>
              </div>
            )}

            {/* Amount & Date Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Monto ($)
                </label>
                <input
                  type="text"
                  id="input-amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ej: 45.000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 text-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Fecha
                </label>
                <input
                  type="date"
                  id="input-date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 text-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Categoría
              </label>
              <select
                id="select-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 text-slate-800 dark:text-white"
                required
              >
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Descripción / Detalle
              </label>
              <input
                type="text"
                id="input-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Compra mensual Coto, Cobro honorarios cliente X"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 text-slate-800 dark:text-white"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="btn-submit-manual"
              className="w-full mt-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Cargar Movimiento
            </button>
          </form>
        ) : (
          <div id="ai-entry-container" className="space-y-4">
            {aiError && (
              <div id="ai-form-error" className="flex items-start gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{aiError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Escribí tu movimiento en lenguaje natural</span>
                <span className="text-[10px] text-indigo-500 flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3" /> IA Activa
                </span>
              </label>
              <textarea
                id="textarea-ai"
                rows={3}
                value={aiText}
                onChange={(e) => setAiText(e.target.value)}
                placeholder='Ej: "gasté 45.000 en supermercado hoy" o "recibí una transferencia de sueldo de 1.200.000"'
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white resize-none"
              />
            </div>

            {/* Suggestions list */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Ejemplos listos para probar:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickPrompt("gasté 45.000 en supermercado")}
                  className="px-2.5 py-1 text-2xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer border border-slate-200/55 dark:border-slate-700/50"
                >
                  "gasté 45.000 en supermercado"
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt("cobré 1.200.000 de sueldo")}
                  className="px-2.5 py-1 text-2xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer border border-slate-200/55 dark:border-slate-700/50"
                >
                  "cobré 1.200.000 de sueldo"
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt("pagué 150.000 de alquiler")}
                  className="px-2.5 py-1 text-2xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer border border-slate-200/55 dark:border-slate-700/50"
                >
                  "pagué 150.000 de alquiler"
                </button>
              </div>
            </div>

            {/* AI parse trigger */}
            {!parsedPreview && (
              <button
                type="button"
                id="btn-interpret-ai"
                onClick={handleAiInterpret}
                disabled={isAiLoading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-75 disabled:cursor-wait"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Interpretando frase...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Interpretar con IA
                  </>
                )}
              </button>
            )}

            {/* AI Interpretation Preview (Confirm dialog) */}
            {parsedPreview && (
              <div id="ai-parsed-preview" className="mt-4 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/20 dark:bg-indigo-950/10 space-y-3">
                <div className="flex items-center justify-between border-b border-indigo-100/55 dark:border-indigo-900/20 pb-2">
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Movimiento Interpretado
                  </span>
                  <button
                    onClick={() => setParsedPreview(null)}
                    className="p-1 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/40 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
                  <div className="text-xs">
                    <span className="text-slate-400 block mb-0.5">Tipo</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase ${
                      parsedPreview.type === 'income'
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                        : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                    }`}>
                      {parsedPreview.type === 'income' ? 'Ingreso' : 'Egreso'}
                      {parsedPreview.type === 'expense' && ` (${parsedPreview.expenseType === 'fixed' ? 'Fijo' : 'Variable'})`}
                    </span>
                  </div>

                  <div className="text-xs">
                    <span className="text-slate-400 block mb-0.5">Categoría</span>
                    <span className="font-semibold">{parsedPreview.category}</span>
                  </div>

                  <div className="text-xs">
                    <span className="text-slate-400 block mb-0.5">Detalle</span>
                    <span className="font-semibold">{parsedPreview.description}</span>
                  </div>

                  <div className="text-xs">
                    <span className="text-slate-400 block mb-0.5">Monto</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      ${parsedPreview.amount.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setParsedPreview(null)}
                    className="flex-1 py-2 px-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Corregir
                  </button>
                  <button
                    type="button"
                    id="btn-confirm-ai-tx"
                    onClick={handleConfirmAiTransaction}
                    className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Confirmar y Cargar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default TransactionForm;
