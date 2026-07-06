import React from 'react';
import { Transaction } from '../types';
import { TrendingUp, TrendingDown, DollarSign, Calendar, AlertTriangle, ArrowUpRight, Percent, ArrowDownRight } from 'lucide-react';

interface FinancialSummaryProps {
  currentTransactions: Transaction[];
  previousTransactions: Transaction[];
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  currentTransactions,
  previousTransactions,
}) => {
  // 1. Basic sums for current month (July 2026)
  const totalIncome = currentTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = currentTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFixed = currentTransactions
    .filter((t) => t.type === 'expense' && t.expenseType === 'fixed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalVariable = currentTransactions
    .filter((t) => t.type === 'expense' && t.expenseType === 'variable')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // 2. Previous month sums (June 2026)
  const prevIncome = previousTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const prevExpense = previousTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // 3. Projections
  // Calculate dynamic day of the month and days in current month
  const today = new Date();
  const currentDay = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
  // Projected expenses: fixed expenses are flat, variables are projected based on elapsed days.
  const projectedVariable = currentDay > 0 ? (totalVariable / currentDay) * daysInMonth : 0;
  const projectedTotalExpense = totalFixed + projectedVariable;

  // 4. Alerts calculation
  // Compare current spending per category with the previous month's baseline.
  // Trigger alert if current spending is greater than June's spending for that category.
  const alerts: string[] = [];
  const categoriesInJuly = Array.from(new Set(currentTransactions.filter(t => t.type === 'expense').map(t => t.category)));

  categoriesInJuly.forEach((category) => {
    const currentCatTotal = currentTransactions
      .filter((t) => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);

    const prevCatTotal = previousTransactions
      .filter((t) => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);

    if (prevCatTotal > 0 && currentCatTotal > prevCatTotal) {
      alerts.push(
        `¡Alerta de Gasto! En ${category} ya gastaste $${currentCatTotal.toLocaleString('es-AR')}, superando el total del mes anterior ($${prevCatTotal.toLocaleString('es-AR')}).`
      );
    } else if (prevCatTotal > 0 && currentCatTotal > prevCatTotal * 0.8 && currentDay < 15) {
      // Warning if spent 80% in the first half of the month
      alerts.push(
        `Advertencia: En ${category} ya gastaste el 80% ($${currentCatTotal.toLocaleString('es-AR')}) de lo habitual en tan solo ${currentDay} días.`
      );
    }
  });

  // Calculate percentage increases/decreases for comparison cards
  const incomeDiffPercentage = prevIncome > 0 ? ((totalIncome - prevIncome) / prevIncome) * 100 : 0;
  const expenseDiffPercentage = prevExpense > 0 ? ((totalExpense - prevExpense) / prevExpense) * 100 : 0;

  return (
    <div id="financial-summary-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Card 1: Ingresos Totales */}
      <div id="card-total-income" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/40 dark:bg-emerald-950/5 rounded-bl-full pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total de Ingresos</span>
          </div>
          <h3 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            ${totalIncome.toLocaleString('es-AR')}
          </h3>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Mes anterior: ${prevIncome.toLocaleString('es-AR')}</span>
          {incomeDiffPercentage !== 0 && (
            <span className={`inline-flex items-center gap-0.5 font-semibold px-2 py-0.5 rounded-full ${
              incomeDiffPercentage > 0 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
            }`}>
              {incomeDiffPercentage > 0 ? '+' : ''}{incomeDiffPercentage.toFixed(0)}%
              {incomeDiffPercentage > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            </span>
          )}
        </div>
      </div>

      {/* Card 2: Egresos Totales */}
      <div id="card-total-expense" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50/40 dark:bg-rose-950/5 rounded-bl-full pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total de Egresos</span>
          </div>
          <h3 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            ${totalExpense.toLocaleString('es-AR')}
          </h3>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 space-y-2">
          <div className="flex justify-between text-2xs text-slate-500">
            <span>Fijos: ${totalFixed.toLocaleString('es-AR')}</span>
            <span>Variables: ${totalVariable.toLocaleString('es-AR')}</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-dashed border-slate-100 dark:border-slate-800">
            <span className="text-slate-400">Mes anterior: ${prevExpense.toLocaleString('es-AR')}</span>
            {expenseDiffPercentage !== 0 && (
              <span className={`inline-flex items-center gap-0.5 font-semibold px-2 py-0.5 rounded-full ${
                expenseDiffPercentage < 0 
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
              }`}>
                {expenseDiffPercentage > 0 ? '+' : ''}{expenseDiffPercentage.toFixed(0)}%
                {expenseDiffPercentage > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card 3: Saldo Disponible */}
      <div id="card-total-balance" className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden text-white border border-slate-800 dark:border-slate-900">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-400">Saldo Disponible</span>
          </div>
          <h3 className="text-3xl font-bold font-display text-white">
            ${balance.toLocaleString('es-AR')}
          </h3>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-1 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Tasa de Ahorro:</span>
            <span className={`font-semibold ${balance > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(0) : '0'}%
            </span>
          </div>
          {/* Projection display */}
          <div className="flex justify-between items-center text-slate-400">
            <span>Proyección Gasto Fin de Mes:</span>
            <span className="font-semibold text-indigo-300">
              ${projectedTotalExpense.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* Alerts Row - Wide if alerts exist */}
      {alerts.length > 0 && (
        <div id="summary-alerts-container" className="col-span-1 md:col-span-3 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-2xl flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Alertas de Consumo Activas ({alerts.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-amber-700 dark:text-amber-400">
            {alerts.map((alert, idx) => (
              <div key={idx} className="flex gap-1.5 items-start bg-white/70 dark:bg-slate-900/40 p-2.5 rounded-xl border border-amber-100/30 dark:border-amber-900/10">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{alert}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default FinancialSummary;
