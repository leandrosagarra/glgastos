import React, { useState } from 'react';
import { Transaction } from '../types';
import { CATEGORIES } from '../categories';
import { Search, Filter, Trash2, Calendar, ShoppingBag, ArrowDownLeft, ArrowUpRight, ChevronRight } from 'lucide-react';
import CategoryIcon from './CategoryIcon';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDeleteTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'fixed' | 'variable'>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    // 1. Search Query filter (matches description or category)
    const matchesSearch =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Type Filter
    if (filterType === 'all') return true;
    if (filterType === 'income') return t.type === 'income';
    if (filterType === 'expense') return t.type === 'expense';
    if (filterType === 'fixed') return t.type === 'expense' && t.expenseType === 'fixed';
    if (filterType === 'variable') return t.type === 'expense' && t.expenseType === 'variable';

    return true;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === 'date-asc') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortBy === 'amount-desc') {
      return b.amount - a.amount;
    }
    if (sortBy === 'amount-asc') {
      return a.amount - b.amount;
    }
    return 0;
  });

  // Helper to fetch matching Category style metadata
  const getCategoryStyles = (categoryName: string) => {
    const cat = CATEGORIES.find((c) => c.name.toLowerCase() === categoryName.toLowerCase());
    return cat || {
      icon: 'ShoppingBag',
      color: 'text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-400 border-slate-100 dark:border-slate-800'
    };
  };

  return (
    <div id="transaction-list-container" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Header with search and filters */}
      <div className="p-6 border-b border-slate-50 dark:border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold font-display text-slate-800 dark:text-white">Movimientos Recientes</h4>
          <span className="text-2xs text-slate-400 font-medium">Mostrando {sortedTransactions.length} de {transactions.length}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="search-transactions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por detalle o categoría..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/60 text-xs rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 text-slate-800 dark:text-white transition-all"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="md:col-span-4 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              id="filter-type-select"
              value={filterType}
              onChange={(e: any) => setFilterType(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800/40 text-2xs rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 text-slate-700 dark:text-slate-300 transition-all"
            >
              <option value="all">Todos los movimientos</option>
              <option value="income">Solo Ingresos</option>
              <option value="expense">Solo Egresos</option>
              <option value="fixed">Solo Gastos Fijos</option>
              <option value="variable">Solo Gastos Variables</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3">
            <select
              id="sort-type-select"
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800/40 text-2xs rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 text-slate-700 dark:text-slate-300 transition-all"
            >
              <option value="date-desc">Fecha: Más reciente primero</option>
              <option value="date-asc">Fecha: Más antiguo primero</option>
              <option value="amount-desc">Monto: Mayor primero</option>
              <option value="amount-asc">Monto: Menor primero</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-slate-50 dark:divide-slate-800/60 max-h-[400px] overflow-y-auto">
        {sortedTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 mb-3">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            </div>
            <p className="text-xs text-slate-500">No se encontraron movimientos.</p>
          </div>
        ) : (
          sortedTransactions.map((t) => {
            const catStyle = getCategoryStyles(t.category);
            return (
              <div
                key={t.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Category Rounded Icon */}
                  <div className={`p-2.5 rounded-xl border shrink-0 ${catStyle.color}`}>
                    <CategoryIcon name={catStyle.icon} size={18} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {t.description}
                      </span>
                      {t.type === 'expense' && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                          t.expenseType === 'fixed'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/10'
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/10'
                        }`}>
                          {t.expenseType === 'fixed' ? 'Fijo' : 'Variable'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-3xs text-slate-400 mt-1">
                      <span className="font-semibold">{t.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Calendar className="w-2.5 h-2.5" />
                        {t.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Price/Amount */}
                  <div className="text-right">
                    <span className={`text-xs font-bold block ${
                      t.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-900 dark:text-white'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString('es-AR')}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => onDeleteTransaction(t.id)}
                    className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 rounded-lg text-slate-400 transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Eliminar movimiento"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default TransactionList;
