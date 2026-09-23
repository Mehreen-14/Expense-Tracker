export interface Expense {
  id?: number;
  description: string;
  amount: number;
  category: string;
  expenseDate: string;
  favorite: boolean;
  recurring: boolean;
  paymentMethod: string;
  notes: string;
  createdAt?: string;
}

export interface ExpenseRequest {
  description: string;
  amount: number;
  category: string;
  expenseDate: string;
  favorite: boolean;
  recurring: boolean;
  paymentMethod: string;
  notes: string;
}

export interface PeriodSummary {
  label: string;
  humanizedLabel: string;
  startDate: string;
  endDate: string;
  total: number;
  count: number;
  currentPeriod: boolean;
  periodEnded: boolean;
}

export interface DashboardSummary {
  today: PeriodSummary;
  yesterday: PeriodSummary;
  thisWeek: PeriodSummary;
  lastWeek: PeriodSummary;
  thisMonth: PeriodSummary;
  lastMonth: PeriodSummary;
  thisYear: PeriodSummary;
  lastYear: PeriodSummary;
  recentDays: PeriodSummary[];
}

export interface CategorySummary {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

export interface InsightsSummary {
  monthlyBudget: number;
  budgetUsed: number;
  budgetRemaining: number;
  budgetUsedPercent: number;
  budgetExceeded: boolean;
  averageDailyThisMonth: number;
  monthOverMonthChange: number;
  topCategory: string | null;
  topCategoryAmount: number;
  largestExpenseThisMonth: number;
  largestExpenseDescription: string | null;
  categoryBreakdown: CategorySummary[];
  tips: string[];
}

export interface Budget {
  id?: number;
  monthlyLimit: number;
}
