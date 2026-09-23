export interface Bill {
  id?: number;
  name: string;
  amount: number;
  dueDay: number;
  category: string;
  reminderDaysBefore: number;
  active: boolean;
  createdAt?: string;
}

export interface BillRequest {
  name: string;
  amount: number;
  dueDay: number;
  category: string;
  reminderDaysBefore: number;
}
