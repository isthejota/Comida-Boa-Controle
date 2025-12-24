
export enum PaymentMethod {
  PIX = 'PIX',
  CASH = 'DINHEIRO'
}

export interface Sale {
  id: string;
  amount: number;
  paymentMethod: PaymentMethod;
  observation?: string;
  timestamp: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  timestamp: number;
}

export interface AppData {
  initialCapital: number;
  sales: Sale[];
  expenses: Expense[];
}

export interface DashboardStats {
  initialCapital: number;
  totalSalesToday: number;
  totalSalesWeekend: number;
  totalPix: number;
  totalCash: number;
  totalExpenses: number;
  profit: number;
  salesCount: number;
}
