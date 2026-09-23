import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PeriodSummary } from '../../models/expense.model';

@Component({
  selector: 'app-recent-days',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './recent-days.component.html',
  styleUrl: './recent-days.component.css'
})
export class RecentDaysComponent {
  @Input({ required: true }) recentDays: PeriodSummary[] = [];

  get maxDayTotal(): number {
    if (this.recentDays.length === 0) return 1;
    return Math.max(...this.recentDays.map(d => Number(d.total)), 1);
  }

  barWidth(day: PeriodSummary): number {
    return (Number(day.total) / this.maxDayTotal) * 100;
  }
}
