import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DashboardSummary, PeriodSummary } from '../../models/expense.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @Input({ required: true }) summary!: DashboardSummary;

  get mainCards(): PeriodSummary[] {
    return [
      this.summary.today,
      this.summary.thisWeek,
      this.summary.thisMonth,
      this.summary.thisYear
    ];
  }

  get previousCards(): PeriodSummary[] {
    return [
      this.summary.yesterday,
      this.summary.lastWeek,
      this.summary.lastMonth,
      this.summary.lastYear
    ];
  }
}
