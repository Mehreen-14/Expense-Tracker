import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CategorySummary } from '../../models/expense.model';

@Component({
  selector: 'app-category-breakdown',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './category-breakdown.component.html',
  styleUrl: './category-breakdown.component.css'
})
export class CategoryBreakdownComponent {
  @Input({ required: true }) categories: CategorySummary[] = [];

  private readonly colors: Record<string, string> = {
    Food: '#14b8a6',
    Transport: '#3b82f6',
    Shopping: '#8b5cf6',
    Bills: '#f59e0b',
    Health: '#ef4444',
    Entertainment: '#ec4899',
    Other: '#64748b'
  };

  barColor(category: string): string {
    return this.colors[category] ?? '#64748b';
  }
}
