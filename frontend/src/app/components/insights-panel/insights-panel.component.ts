import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsightsSummary } from '../../models/expense.model';

@Component({
  selector: 'app-insights-panel',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './insights-panel.component.html',
  styleUrl: './insights-panel.component.css'
})
export class InsightsPanelComponent implements OnChanges {
  @Input({ required: true }) insights!: InsightsSummary;
  @Output() budgetSave = new EventEmitter<number>();

  readonly Math = Math;
  budgetInput = 0;
  editingBudget = false;

  ngOnChanges(): void {
    this.budgetInput = this.insights?.monthlyBudget ?? 0;
  }

  startEditBudget(): void {
    this.budgetInput = this.insights.monthlyBudget;
    this.editingBudget = true;
  }

  saveBudget(): void {
    this.budgetSave.emit(this.budgetInput);
    this.editingBudget = false;
  }

  get budgetBarClass(): string {
    if (this.insights.budgetExceeded) return 'danger';
    if (this.insights.budgetUsedPercent >= 80) return 'warning';
    return 'safe';
  }

  get monthChangeLabel(): string {
    const change = this.insights.monthOverMonthChange;
    if (change > 0) return `+${change}% vs last month`;
    if (change < 0) return `${change}% vs last month`;
    return 'Same as last month';
  }

  get monthChangeClass(): string {
    if (this.insights.monthOverMonthChange > 0) return 'up';
    if (this.insights.monthOverMonthChange < 0) return 'down';
    return 'neutral';
  }
}
