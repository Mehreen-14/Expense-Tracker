import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Expense } from '../../models/expense.model';

interface MonthData {
  label: string;
  shortLabel: string;
  total: number;
  count: number;
}

@Component({
  selector: 'app-spending-trend',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './spending-trend.component.html',
  styleUrl: './spending-trend.component.css'
})
export class SpendingTrendComponent implements OnChanges {
  @Input({ required: true }) expenses: Expense[] = [];

  months: MonthData[] = [];
  maxTotal = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenses']) {
      this.computeMonths();
    }
  }

  private computeMonths(): void {
    const now = new Date();
    this.months = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      const shortLabel = d.toLocaleString('default', { month: 'short' });

      const total = this.expenses
        .filter(e => {
          const ed = new Date(e.expenseDate + 'T00:00:00');
          return ed.getFullYear() === year && ed.getMonth() === month;
        })
        .reduce((sum, e) => sum + Number(e.amount), 0);

      const count = this.expenses.filter(e => {
        const ed = new Date(e.expenseDate + 'T00:00:00');
        return ed.getFullYear() === year && ed.getMonth() === month;
      }).length;

      this.months.push({ label, shortLabel, total, count });
    }

    this.maxTotal = Math.max(...this.months.map(m => m.total), 1);
  }

  barHeight(month: MonthData): number {
    return (month.total / this.maxTotal) * 100;
  }
}
