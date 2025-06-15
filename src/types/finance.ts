
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

export interface CategoryData {
  category: string;
  amount: number;
  color: string;
}
