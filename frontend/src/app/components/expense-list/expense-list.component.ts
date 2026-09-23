import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Expense } from '../../models/expense.model';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

interface MonthOption {
  index: number;
  label: string;
}

type SortField = 'date' | 'amount' | 'description';
type SortDir = 'asc' | 'desc';
type QuickFilter = 'all' | 'today' | 'thisWeek' | 'last30Days' | 'thisYear';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule, ConfirmModalComponent],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.css'
})
export class ExpenseListComponent {
  @Input({ required: true }) expenses: Expense[] = [];
  @Output() edit = new EventEmitter<Expense>();
  @Output() duplicate = new EventEmitter<Expense>();
  @Output() delete = new EventEmitter<number>();
  @Output() toggleFavorite = new EventEmitter<number>();
  @Output() toggleRecurring = new EventEmitter<number>();
  @Output() bulkDelete = new EventEmitter<number[]>();

  readonly categoryColors: Record<string, string> = {
    'Food': '#14b8a6',
    'Transport': '#3b82f6',
    'Shopping': '#8b5cf6',
    'Bills': '#f59e0b',
    'Health': '#ef4444',
    'Entertainment': '#ec4899',
    'Other': '#64748b'
  };

  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth();

  readonly months: MonthOption[] = [
    { index: 0, label: 'Jan' }, { index: 1, label: 'Feb' },
    { index: 2, label: 'Mar' }, { index: 3, label: 'Apr' },
    { index: 4, label: 'May' }, { index: 5, label: 'Jun' },
    { index: 6, label: 'Jul' }, { index: 7, label: 'Aug' },
    { index: 8, label: 'Sep' }, { index: 9, label: 'Oct' },
    { index: 10, label: 'Nov' }, { index: 11, label: 'Dec' }
  ];

  readonly categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'];

  // Filter state
  searchQuery = '';
  selectedCategories: string[] = [];
  dateFrom = '';
  dateTo = '';
  amountMin: number | null = null;
  amountMax: number | null = null;
  sortBy: SortField = 'date';
  sortDir: SortDir = 'desc';
  quickFilter: QuickFilter = 'all';
  favoritesOnly = false;
  recurringOnly = false;
  showFilters = false;

  // Pagination
  currentPage = 1;
  readonly pageSize = 10;

  // Bulk select
  selectedIds: Set<number> = new Set();
  selectAll = false;

  // Confirm modal
  showBulkDeleteConfirm = false;

  selectMonth(monthIndex: number): void {
    this.selectedMonth = monthIndex;
    this.quickFilter = 'all';
    this.dateFrom = '';
    this.dateTo = '';
    this.currentPage = 1;
  }

  applyQuickFilter(filter: QuickFilter): void {
    this.quickFilter = filter;
    this.dateFrom = '';
    this.dateTo = '';
    this.currentPage = 1;
    if (filter !== 'all') {
      const today = new Date();
      const toStr = (d: Date) => d.toISOString().split('T')[0];

      if (filter === 'today') {
        this.dateFrom = toStr(today);
        this.dateTo = toStr(today);
      } else if (filter === 'thisWeek') {
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(today);
        monday.setDate(diff);
        this.dateFrom = toStr(monday);
        this.dateTo = toStr(today);
      } else if (filter === 'last30Days') {
        const d = new Date(today);
        d.setDate(d.getDate() - 30);
        this.dateFrom = toStr(d);
        this.dateTo = toStr(today);
      } else if (filter === 'thisYear') {
        this.dateFrom = today.getFullYear() + '-01-01';
        this.dateTo = toStr(today);
      }
    }
  }

  toggleCategory(cat: string): void {
    const idx = this.selectedCategories.indexOf(cat);
    if (idx === -1) {
      this.selectedCategories.push(cat);
    } else {
      this.selectedCategories.splice(idx, 1);
    }
  }

  setSort(field: SortField): void {
    if (this.sortBy === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDir = field === 'amount' ? 'desc' : 'asc';
    }
  }

  clearAllFilters(): void {
    this.searchQuery = '';
    this.selectedCategories = [];
    this.dateFrom = '';
    this.dateTo = '';
    this.amountMin = null;
    this.amountMax = null;
    this.sortBy = 'date';
    this.sortDir = 'desc';
    this.quickFilter = 'all';
    this.favoritesOnly = false;
    this.recurringOnly = false;
    this.currentPage = 1;
  }

  get hasActiveFilters(): boolean {
    return !!(
      this.searchQuery ||
      this.selectedCategories.length > 0 ||
      this.dateFrom ||
      this.dateTo ||
      this.amountMin !== null ||
      this.amountMax !== null ||
      this.quickFilter !== 'all' ||
      this.favoritesOnly ||
      this.recurringOnly
    );
  }

  get filteredExpenses(): Expense[] {
    let result = [...this.expenses];

    // Month filter (when no quick filter active)
    if (this.quickFilter === 'all' && !this.dateFrom && !this.dateTo) {
      result = result.filter(expense => {
        const date = new Date(expense.expenseDate + 'T00:00:00');
        return date.getFullYear() === this.selectedYear && date.getMonth() === this.selectedMonth;
      });
    }

    // Quick filter / date range
    if (this.dateFrom) {
      result = result.filter(e => e.expenseDate >= this.dateFrom);
    }
    if (this.dateTo) {
      result = result.filter(e => e.expenseDate <= this.dateTo);
    }

    // Search
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(e => e.description.toLowerCase().includes(q));
    }

    // Category filter
    if (this.selectedCategories.length > 0) {
      result = result.filter(e => this.selectedCategories.includes(e.category));
    }

    // Amount range
    if (this.amountMin !== null) {
      result = result.filter(e => Number(e.amount) >= this.amountMin!);
    }
    if (this.amountMax !== null) {
      result = result.filter(e => Number(e.amount) <= this.amountMax!);
    }

    // Favorites only
    if (this.favoritesOnly) {
      result = result.filter(e => e.favorite);
    }

    // Recurring only
    if (this.recurringOnly) {
      result = result.filter(e => e.recurring);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (this.sortBy === 'date') {
        cmp = a.expenseDate.localeCompare(b.expenseDate);
      } else if (this.sortBy === 'amount') {
        cmp = Number(a.amount) - Number(b.amount);
      } else if (this.sortBy === 'description') {
        cmp = a.description.localeCompare(b.description);
      }
      return this.sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }

  get selectedMonthLabel(): string {
    return this.months[this.selectedMonth].label;
  }

  get total(): number {
    return this.filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }

  get average(): number {
    return this.filteredExpenses.length > 0 ? this.total / this.filteredExpenses.length : 0;
  }

  get highest(): number {
    if (this.filteredExpenses.length === 0) return 0;
    return Math.max(...this.filteredExpenses.map(e => Number(e.amount)));
  }

  get lowest(): number {
    if (this.filteredExpenses.length === 0) return 0;
    return Math.min(...this.filteredExpenses.map(e => Number(e.amount)));
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredExpenses.length / this.pageSize));
  }

  get paginatedExpenses(): Expense[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredExpenses.slice(start, start + this.pageSize);
  }

  get pageNumbers(): (number | '...')[] {
    const total = this.totalPages;
    const current = this.currentPage;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [1];
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  }

  goToPage(page: number | '...'): void {
    if (page === '...') return;
    this.currentPage = Math.max(1, Math.min(page, this.totalPages));
  }

  monthTotal(monthIndex: number): number {
    return this.expenses
      .filter(expense => {
        const date = new Date(expense.expenseDate + 'T00:00:00');
        return date.getFullYear() === this.selectedYear && date.getMonth() === monthIndex;
      })
      .reduce((sum, e) => sum + Number(e.amount), 0);
  }

  monthCount(monthIndex: number): number {
    return this.expenses.filter(expense => {
      const date = new Date(expense.expenseDate + 'T00:00:00');
      return date.getFullYear() === this.selectedYear && date.getMonth() === monthIndex;
    }).length;
  }

  // Bulk select
  toggleSelect(id: number): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.selectAll = this.selectedIds.size === this.filteredExpenses.length;
  }

  toggleSelectAll(): void {
    if (this.selectAll) {
      this.selectedIds.clear();
      this.selectAll = false;
    } else {
      this.filteredExpenses.forEach(e => {
        if (e.id) this.selectedIds.add(e.id);
      });
      this.selectAll = true;
    }
  }

  onBulkDelete(): void {
    const ids = Array.from(this.selectedIds);
    if (ids.length === 0) return;
    this.showBulkDeleteConfirm = true;
  }

  confirmBulkDelete(): void {
    const ids = Array.from(this.selectedIds);
    this.bulkDelete.emit(ids);
    this.selectedIds.clear();
    this.selectAll = false;
    this.showBulkDeleteConfirm = false;
  }

  // Keyboard shortcuts
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

    if (event.key === '/' && !isInput) {
      event.preventDefault();
      const searchEl = document.getElementById('expense-search');
      searchEl?.focus();
    }

    if (event.key === 'Escape' && isInput) {
      (target as HTMLInputElement).blur();
    }
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.searchQuery = '';
      (event.target as HTMLInputElement).blur();
    }
  }
}
