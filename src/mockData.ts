import { Transaction } from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // --- JUNIO 2026 (Mes Anterior) ---
  {
    id: 'tx-june-1',
    type: 'income',
    category: 'Sueldo',
    amount: 1500000,
    description: 'Sueldo de Junio Empresa S.A.',
    date: '2026-06-01'
  },
  {
    id: 'tx-june-2',
    type: 'expense',
    expenseType: 'fixed',
    category: 'Alquiler',
    amount: 350000,
    description: 'Alquiler departamento',
    date: '2026-06-01'
  },
  {
    id: 'tx-june-3',
    type: 'expense',
    expenseType: 'fixed',
    category: 'Expensas',
    amount: 60000,
    description: 'Expensas Ordinarias Junio',
    date: '2026-06-02'
  },
  {
    id: 'tx-june-4',
    type: 'expense',
    expenseType: 'variable',
    category: 'Supermercado',
    amount: 110000,
    description: 'Compra mensual Coto',
    date: '2026-06-03'
  },
  {
    id: 'tx-june-5',
    type: 'expense',
    expenseType: 'variable',
    category: 'Salidas',
    amount: 40000,
    description: 'Cena familiar fin de semana',
    date: '2026-06-04'
  },
  {
    id: 'tx-june-6',
    type: 'expense',
    expenseType: 'variable',
    category: 'Combustible',
    amount: 25000,
    description: 'Carga nafta YPF',
    date: '2026-06-05'
  },
  {
    id: 'tx-june-7',
    type: 'income',
    category: 'Trabajos extras',
    amount: 150000,
    description: 'Desarrollo web freelance',
    date: '2026-06-10'
  },
  {
    id: 'tx-june-8',
    type: 'expense',
    expenseType: 'fixed',
    category: 'Servicios',
    amount: 20000,
    description: 'Luz y Gas',
    date: '2026-06-15'
  },
  {
    id: 'tx-june-9',
    type: 'expense',
    expenseType: 'variable',
    category: 'Delivery',
    amount: 15000,
    description: 'Sushi noche de viernes',
    date: '2026-06-18'
  },

  // --- JULIO 2026 (Mes Actual - Basado en la fecha del sistema: 2026-07-03) ---
  {
    id: 'tx-july-1',
    type: 'income',
    category: 'Sueldo',
    amount: 1500000,
    description: 'Sueldo de Julio Empresa S.A.',
    date: '2026-07-01'
  },
  {
    id: 'tx-july-2',
    type: 'expense',
    expenseType: 'fixed',
    category: 'Alquiler',
    amount: 350000,
    description: 'Alquiler departamento Julio',
    date: '2026-07-01'
  },
  {
    id: 'tx-july-3',
    type: 'expense',
    expenseType: 'fixed',
    category: 'Expensas',
    amount: 65000,
    description: 'Expensas Ordinarias Julio',
    date: '2026-07-02'
  },
  {
    id: 'tx-july-4',
    type: 'expense',
    expenseType: 'variable',
    category: 'Supermercado',
    amount: 85000,
    description: 'Compra Carrefour',
    date: '2026-07-02'
  },
  {
    id: 'tx-july-5',
    type: 'expense',
    expenseType: 'variable',
    category: 'Combustible',
    amount: 30000,
    description: 'Carga nafta Axion',
    date: '2026-07-02'
  },
  {
    id: 'tx-july-6',
    type: 'income',
    category: 'Trabajos extras',
    amount: 120000,
    description: 'Mantenimiento web freelance',
    date: '2026-07-03'
  },
  {
    id: 'tx-july-7',
    type: 'expense',
    expenseType: 'fixed',
    category: 'Servicios',
    amount: 22000,
    description: 'Luz y Gas',
    date: '2026-07-03'
  },
  {
    id: 'tx-july-8',
    type: 'expense',
    expenseType: 'variable',
    category: 'Salidas',
    amount: 25000,
    description: 'Cine y cena',
    date: '2026-07-03'
  }
];
