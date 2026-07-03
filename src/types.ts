export type TransactionType = 'income' | 'expense';
export type ExpenseType = 'fixed' | 'variable';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  date: string; // YYYY-MM-DD
  expenseType?: ExpenseType; // Only applicable if type is 'expense'
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  expenseType?: ExpenseType;
  icon: string; // Lucide icon name
  color: string; // Tailwind color class (e.g., 'text-emerald-500 bg-emerald-50')
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  totalFixed: number;
  totalVariable: number;
  balance: number;
  categoryPercentages: { category: string; percentage: number; amount: number; type: TransactionType; expenseType?: ExpenseType }[];
  projectionEndMonth: number;
  alerts: string[];
}
