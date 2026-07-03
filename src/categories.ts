import { Category } from './types';

export const CATEGORIES: Category[] = [
  // --- INGRESOS ---
  {
    id: 'sueldo',
    name: 'Sueldo',
    type: 'income',
    icon: 'Briefcase',
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30'
  },
  {
    id: 'trabajos_extras',
    name: 'Trabajos extras',
    type: 'income',
    icon: 'Laptop',
    color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/20 dark:text-teal-400 border-teal-100 dark:border-teal-900/30'
  },
  {
    id: 'honorarios',
    name: 'Honorarios',
    type: 'income',
    icon: 'Award',
    color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/20 dark:text-cyan-400 border-cyan-100 dark:border-cyan-900/30'
  },
  {
    id: 'transferencias_recibidas',
    name: 'Transferencias recibidas',
    type: 'income',
    icon: 'ArrowDownLeft',
    color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/20 dark:text-sky-400 border-sky-100 dark:border-sky-900/30'
  },
  {
    id: 'reintegros',
    name: 'Reintegros',
    type: 'income',
    icon: 'RefreshCw',
    color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30'
  },
  {
    id: 'otros_ingresos_eventuales',
    name: 'Otros ingresos eventuales',
    type: 'income',
    icon: 'Sparkles',
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/20 dark:text-purple-400 border-purple-100 dark:border-purple-900/30'
  },

  // --- EGRESOS - GASTOS FIJOS ---
  {
    id: 'colegio',
    name: 'Colegio',
    type: 'expense',
    expenseType: 'fixed',
    icon: 'GraduationCap',
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400 border-blue-100 dark:border-blue-900/30'
  },
  {
    id: 'alquiler',
    name: 'Alquiler',
    type: 'expense',
    expenseType: 'fixed',
    icon: 'Home',
    color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30'
  },
  {
    id: 'expensas',
    name: 'Expensas',
    type: 'expense',
    expenseType: 'fixed',
    icon: 'Building2',
    color: 'text-slate-600 bg-slate-50 dark:bg-slate-900/40 dark:text-slate-400 border-slate-100 dark:border-slate-800'
  },
  {
    id: 'servicios',
    name: 'Servicios',
    type: 'expense',
    expenseType: 'fixed',
    icon: 'Zap',
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30'
  },
  {
    id: 'internet',
    name: 'Internet',
    type: 'expense',
    expenseType: 'fixed',
    icon: 'Wifi',
    color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/20 dark:text-violet-400 border-violet-100 dark:border-violet-900/30'
  },
  {
    id: 'celular',
    name: 'Celular',
    type: 'expense',
    expenseType: 'fixed',
    icon: 'Smartphone',
    color: 'text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-950/20 dark:text-fuchsia-400 border-fuchsia-100 dark:border-fuchsia-900/30'
  },
  {
    id: 'seguros',
    name: 'Seguros',
    type: 'expense',
    expenseType: 'fixed',
    icon: 'Shield',
    color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/20 dark:text-cyan-400 border-cyan-100 dark:border-cyan-900/30'
  },
  {
    id: 'cuotas',
    name: 'Cuotas',
    type: 'expense',
    expenseType: 'fixed',
    icon: 'CreditCard',
    color: 'text-pink-600 bg-pink-50 dark:bg-pink-950/20 dark:text-pink-400 border-pink-100 dark:border-pink-900/30'
  },
  {
    id: 'prestamos',
    name: 'Préstamos',
    type: 'expense',
    expenseType: 'fixed',
    icon: 'Scale',
    color: 'text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 border-red-100 dark:border-red-900/30'
  },
  {
    id: 'impuestos',
    name: 'Impuestos',
    type: 'expense',
    expenseType: 'fixed',
    icon: 'Landmark',
    color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/20 dark:text-orange-400 border-orange-100 dark:border-orange-900/30'
  },
  {
    id: 'obra_social',
    name: 'Obra social',
    type: 'expense',
    expenseType: 'fixed',
    icon: 'HeartPulse',
    color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100 dark:border-rose-900/30'
  },
  {
    id: 'mantenimiento_auto',
    name: 'Mantenimiento del auto',
    type: 'expense',
    expenseType: 'fixed',
    icon: 'Car',
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400 border-blue-100 dark:border-blue-900/30'
  },
  {
    id: 'otros_pagos_fijos',
    name: 'Otros pagos previsibles',
    type: 'expense',
    expenseType: 'fixed',
    icon: 'Calendar',
    color: 'text-slate-600 bg-slate-50 dark:bg-slate-900/40 dark:text-slate-400 border-slate-100 dark:border-slate-800'
  },

  // --- EGRESOS - GASTOS VARIABLES ---
  {
    id: 'supermercado',
    name: 'Supermercado',
    type: 'expense',
    expenseType: 'variable',
    icon: 'ShoppingCart',
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30'
  },
  {
    id: 'almacen',
    name: 'Almacén',
    type: 'expense',
    expenseType: 'variable',
    icon: 'Store',
    color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/20 dark:text-teal-400 border-teal-100 dark:border-teal-900/30'
  },
  {
    id: 'carniceria',
    name: 'Carnicería',
    type: 'expense',
    expenseType: 'variable',
    icon: 'Flame',
    color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/20 dark:text-orange-400 border-orange-100 dark:border-orange-900/30'
  },
  {
    id: 'verduleria',
    name: 'Verdulería',
    type: 'expense',
    expenseType: 'variable',
    icon: 'Apple',
    color: 'text-lime-600 bg-lime-50 dark:bg-lime-950/20 dark:text-lime-400 border-lime-100 dark:border-lime-900/30'
  },
  {
    id: 'combustible',
    name: 'Combustible',
    type: 'expense',
    expenseType: 'variable',
    icon: 'Gauge',
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30'
  },
  {
    id: 'transporte',
    name: 'Transporte',
    type: 'expense',
    expenseType: 'variable',
    icon: 'Bus',
    color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/20 dark:text-sky-400 border-sky-100 dark:border-sky-900/30'
  },
  {
    id: 'salidas',
    name: 'Salidas',
    type: 'expense',
    expenseType: 'variable',
    icon: 'GlassWater',
    color: 'text-pink-600 bg-pink-50 dark:bg-pink-950/20 dark:text-pink-400 border-pink-100 dark:border-pink-900/30'
  },
  {
    id: 'delivery',
    name: 'Delivery',
    type: 'expense',
    expenseType: 'variable',
    icon: 'Bike',
    color: 'text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 border-red-100 dark:border-red-900/30'
  },
  {
    id: 'ropa',
    name: 'Ropa',
    type: 'expense',
    expenseType: 'variable',
    icon: 'Shirt',
    color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30'
  },
  {
    id: 'farmacia',
    name: 'Farmacia',
    type: 'expense',
    expenseType: 'variable',
    icon: 'Pills',
    color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100 dark:border-rose-900/30'
  },
  {
    id: 'regalos',
    name: 'Regalos',
    type: 'expense',
    expenseType: 'variable',
    icon: 'Gift',
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/20 dark:text-purple-400 border-purple-100 dark:border-purple-900/30'
  },
  {
    id: 'arreglos_hogar',
    name: 'Arreglos del hogar',
    type: 'expense',
    expenseType: 'variable',
    icon: 'Hammer',
    color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900/30'
  },
  {
    id: 'otros_consumos_variables',
    name: 'Otros consumos móviles',
    type: 'expense',
    expenseType: 'variable',
    icon: 'ShoppingBag',
    color: 'text-slate-600 bg-slate-50 dark:bg-slate-900/40 dark:text-slate-400 border-slate-100 dark:border-slate-800'
  }
];

export function getCategoryByName(name: string): Category | undefined {
  return CATEGORIES.find(c => c.name.toLowerCase() === name.toLowerCase());
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(c => c.id === id);
}
