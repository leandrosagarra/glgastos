import React from 'react';
import { Transaction } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { CATEGORIES } from '../categories';
import { Info, PieChart as PieIcon, BarChart3 as BarIcon, TrendingUp } from 'lucide-react';

interface ChartsPanelProps {
  currentTransactions: Transaction[];
  previousTransactions: Transaction[];
}

export const ChartsPanel: React.FC<ChartsPanelProps> = ({
  currentTransactions,
  previousTransactions,
}) => {
  // --- 1. PREPARE PIE CHART DATA (EXPENSES BY CATEGORY) ---
  const currentExpenses = currentTransactions.filter((t) => t.type === 'expense');
  const totalExpenseAmount = currentExpenses.reduce((sum, t) => sum + t.amount, 0);

  // Group current expenses by category
  const categoryGroupMap: { [cat: string]: number } = {};
  currentExpenses.forEach((t) => {
    categoryGroupMap[t.category] = (categoryGroupMap[t.category] || 0) + t.amount;
  });

  // Map to recharts format and attach color
  const pieData = Object.entries(categoryGroupMap).map(([category, amount]) => {
    // Find matching category color or fallback
    const catDef = CATEGORIES.find(c => c.name === category);
    // Extract base colors
    let color = '#64748b'; // Slate gray default
    if (catDef) {
      if (catDef.color.includes('emerald')) color = '#10b981';
      else if (catDef.color.includes('teal')) color = '#14b8a6';
      else if (catDef.color.includes('cyan')) color = '#06b6d4';
      else if (catDef.color.includes('sky')) color = '#0ea5e9';
      else if (catDef.color.includes('indigo')) color = '#6366f1';
      else if (catDef.color.includes('purple')) color = '#a855f7';
      else if (catDef.color.includes('blue')) color = '#3b82f6';
      else if (catDef.color.includes('slate')) color = '#64748b';
      else if (catDef.color.includes('amber')) color = '#f59e0b';
      else if (catDef.color.includes('violet')) color = '#8b5cf6';
      else if (catDef.color.includes('fuchsia')) color = '#d946ef';
      else if (catDef.color.includes('pink')) color = '#ec4899';
      else if (catDef.color.includes('red')) color = '#ef4444';
      else if (catDef.color.includes('orange')) color = '#f97316';
      else if (catDef.color.includes('rose')) color = '#f43f5e';
      else if (catDef.color.includes('lime')) color = '#84cc16';
      else if (catDef.color.includes('yellow')) color = '#eab308';
    }
    return {
      name: category,
      value: amount,
      color,
      percentage: totalExpenseAmount > 0 ? (amount / totalExpenseAmount) * 100 : 0
    };
  }).sort((a, b) => b.value - a.value); // Sort highest first

  // --- 2. PREPARE BAR CHART DATA (MONTH COMPARISON) ---
  const currentIncomeTotal = currentTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const prevIncomeTotal = previousTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const prevExpenseTotal = previousTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const barData = [
    {
      name: 'Junio (Mes Ant.)',
      Ingresos: prevIncomeTotal,
      Egresos: prevExpenseTotal,
    },
    {
      name: 'Julio (Mes Act.)',
      Ingresos: currentIncomeTotal,
      Egresos: totalExpenseAmount,
    }
  ];

  // Custom tooltips to make them look ultra premium
  const CustomTooltipPie = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-xl text-xs">
          <p className="font-bold mb-1">{data.name}</p>
          <div className="flex flex-col gap-0.5">
            <span>Monto: <span className="font-semibold text-indigo-300">${data.value.toLocaleString('es-AR')}</span></span>
            <span>Porcentaje: <span className="font-semibold text-emerald-400">{data.percentage.toFixed(1)}%</span></span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipBar = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-300 border-b border-slate-800 pb-1">{payload[0].payload.name}</p>
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between gap-4">
              <span className="text-slate-400">{item.name}:</span>
              <span className={`font-semibold ${item.name === 'Ingresos' ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${item.value.toLocaleString('es-AR')}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="charts-panel-container" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Donut Expense Distribution */}
      <div id="card-chart-pie" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <PieIcon className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold font-display text-slate-800 dark:text-white">Distribución de Gastos</h4>
            </div>
            <span className="text-2xs text-slate-400 font-medium">Este mes</span>
          </div>

          {pieData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 mb-3">
                <PieIcon className="w-6 h-6 stroke-[1.5]" />
              </div>
              <p className="text-xs text-slate-500 max-w-[200px]">No hay gastos registrados este mes para graficar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Pie container */}
              <div className="md:col-span-7 h-[200px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomTooltipPie />} />
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends container */}
              <div className="md:col-span-5 space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {pieData.slice(0, 5).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-2xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="text-slate-600 dark:text-slate-300 truncate font-medium">{entry.name}</span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white text-right shrink-0">
                      {entry.percentage.toFixed(0)}%
                    </span>
                  </div>
                ))}
                {pieData.length > 5 && (
                  <div className="text-[10px] text-slate-400 italic text-center pt-1 border-t border-slate-50 dark:border-slate-800/50">
                    + {pieData.length - 5} categorías más
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Monthly Historical Comparison */}
      <div id="card-chart-bar" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <BarIcon className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold font-display text-slate-800 dark:text-white">Comparación de Meses</h4>
            </div>
            <div className="flex items-center gap-1 text-2xs text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>Balance</span>
            </div>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 9, fill: '#94a3b8' }}
                  tickFormatter={(val) => `$${(val / 1000).toLocaleString('es-AR')}k`}
                />
                <Tooltip content={<CustomTooltipBar />} />
                <Legend 
                  iconSize={8}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 10, paddingTop: 10 }}
                />
                <Bar dataKey="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} barSize={28} />
                <Bar dataKey="Egresos" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};
export default ChartsPanel;
