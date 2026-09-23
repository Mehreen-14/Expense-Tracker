export interface SplitParticipant {
  id?: number;
  name: string;
  amountOwed: number;
  paid: boolean;
}

export interface SplitExpense {
  id?: number;
  description: string;
  amount: number;
  paidBy: string;
  splitDate: string;
  settled: boolean;
  participants: SplitParticipant[];
  createdAt?: string;
}

export interface SplitExpenseRequest {
  description: string;
  amount: number;
  paidBy: string;
  splitDate: string;
  participants: SplitParticipantRequest[];
}

export interface SplitParticipantRequest {
  name: string;
  amountOwed: number;
}
