import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ExpenseService } from './services/expense.service';
import { BillService } from './services/bill.service';
import { SplitService } from './services/split.service';
import { DashboardSummary, Expense, ExpenseRequest, InsightsSummary } from './models/expense.model';
import { Bill, BillRequest } from './models/bill.model';
import { SplitExpense, SplitExpenseRequest } from './models/split.model';
import { ForwardRequest, ForwardSummary } from './models/forward.model';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { RecentDaysComponent } from './components/recent-days/recent-days.component';
import { InsightsPanelComponent } from './components/insights-panel/insights-panel.component';
import { CategoryBreakdownComponent } from './components/category-breakdown/category-breakdown.component';
import { BillManagerComponent } from './components/bill-manager/bill-manager.component';
import { SplitExpensesComponent } from './components/split-expenses/split-expenses.component';
import { SpendingTrendComponent } from './components/spending-trend/spending-trend.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ExpenseFormComponent,
    DashboardComponent,
    ExpenseListComponent,
    RecentDaysComponent,
    InsightsPanelComponent,
    CategoryBreakdownComponent,
    BillManagerComponent,
    SplitExpensesComponent,
    SpendingTrendComponent,
    ConfirmModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isDark = false;
  expenses: Expense[] = [];
  summary: DashboardSummary | null = null;
  insights: InsightsSummary | null = null;
  editingExpense: Expense | null = null;
  loading = true;
  error = '';

  // Modal states
  showInsights = false;
  showBills = false;
  showSplits = false;
  showSendMoney = false;
  showShare = false;

  // Send Money
  sendMoneyForm = {
    phone: '',
    amount: null as number | null,
    paymentMethod: 'bKash',
    notes: ''
  };
  sendMoneyPaymentMethods = ['bKash', 'Nagad', 'Rocket', 'Card', 'Bank Transfer', 'Cash'];

  // Bills
  bills: Bill[] = [];

  // Splits
  splits: SplitExpense[] = [];

  // Confirm modal
  showDeleteConfirm = false;
  pendingDeleteId: number | null = null;

  // Forward/Share
  forwardDateFrom = '';
  forwardDateTo = '';
  forwardSummary: ForwardSummary | null = null;
  forwardLoading = false;

  constructor(
    private http: HttpClient,
    private expenseService: ExpenseService,
    private billService: BillService,
    private splitService: SplitService
  ) {}

  ngOnInit(): void {
    this.initTheme();
    this.loadData();
    this.loadBills();
    this.loadSplits();
    this.initForwardDates();
  }

  initTheme(): void {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.isDark = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  initForwardDates(): void {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    this.forwardDateFrom = firstDay.toISOString().split('T')[0];
    this.forwardDateTo = now.toISOString().split('T')[0];
  }

  loadData(): void {
    this.loading = true;
    this.error = '';

    this.expenseService.getAll().subscribe({
      next: expenses => {
        this.expenses = expenses;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load expenses. Make sure the backend is running on port 8080.';
        this.loading = false;
      }
    });

    this.expenseService.getSummary().subscribe({
      next: summary => (this.summary = summary),
      error: () => {}
    });

    if (this.showInsights) {
      this.loadInsights();
    }
  }

  loadInsights(): void {
    this.expenseService.getInsights().subscribe({
      next: insights => (this.insights = insights),
      error: () => {}
    });
  }

  loadBills(): void {
    this.billService.getAll().subscribe({
      next: bills => (this.bills = bills),
      error: () => {}
    });
  }

  loadSplits(): void {
    this.splitService.getAll().subscribe({
      next: splits => (this.splits = splits),
      error: () => {}
    });
  }

  // Modal toggles
  toggleInsights(): void {
    this.showInsights = !this.showInsights;
    if (this.showInsights && !this.insights) {
      this.loadInsights();
    }
  }

  toggleBills(): void {
    this.showBills = !this.showBills;
    if (this.showBills) this.loadBills();
  }

  toggleSplits(): void {
    this.showSplits = !this.showSplits;
    if (this.showSplits) this.loadSplits();
  }

  toggleSendMoney(): void {
    this.showSendMoney = !this.showSendMoney;
    if (this.showSendMoney) {
      this.sendMoneyForm = { phone: '', amount: null, paymentMethod: 'bKash', notes: '' };
    }
  }

  onSendMoneySubmit(): void {
    if (!this.sendMoneyForm.phone || !this.sendMoneyForm.amount) return;
    const phone = this.sendMoneyForm.phone.trim();
    const method = this.sendMoneyForm.paymentMethod;
    const notes = this.sendMoneyForm.notes.trim();

    this.http.post<any>('http://localhost:8080/api/payment/initiate', {
      phone,
      amount: this.sendMoneyForm.amount,
      paymentMethod: method,
      notes
    }).subscribe({
      next: (res) => {
        if (res.status === 'SUCCESS' && res.redirectUrl) {
          window.location.href = res.redirectUrl;
        } else {
          this.error = res.message || 'Payment initiation failed.';
        }
      },
      error: () => (this.error = 'Failed to connect to payment gateway.')
    });
  }

  toggleShare(): void {
    this.showShare = !this.showShare;
    if (this.showShare) {
      this.forwardSummary = null;
      this.loadForwardSummary();
    }
  }

  closeAllModals(): void {
    this.showInsights = false;
    this.showBills = false;
    this.showSplits = false;
    this.showSendMoney = false;
    this.showShare = false;
  }

  // Expense handlers
  onSave(request: ExpenseRequest): void {
    const action = this.editingExpense?.id
      ? this.expenseService.update(this.editingExpense.id, request)
      : this.expenseService.create(request);

    action.subscribe({
      next: () => {
        this.editingExpense = null;
        this.loadData();
      },
      error: () => (this.error = 'Failed to save expense.')
    });
  }

  onEdit(expense: Expense): void {
    this.editingExpense = expense;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDuplicate(expense: Expense): void {
    const duplicated: Expense = {
      ...expense,
      id: undefined,
      description: expense.description + ' (copy)',
      expenseDate: new Date().toISOString().split('T')[0]
    };
    this.editingExpense = duplicated;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onCancelEdit(): void {
    this.editingExpense = null;
  }

  onDelete(id: number): void {
    this.pendingDeleteId = id;
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    if (this.pendingDeleteId === null) return;
    this.expenseService.delete(this.pendingDeleteId).subscribe({
      next: () => {
        this.loadData();
        this.pendingDeleteId = null;
        this.showDeleteConfirm = false;
      },
      error: () => {
        this.error = 'Failed to delete expense.';
        this.pendingDeleteId = null;
        this.showDeleteConfirm = false;
      }
    });
  }

  onToggleFavorite(id: number): void {
    this.expenseService.toggleFavorite(id).subscribe({
      next: () => this.loadData(),
      error: () => (this.error = 'Failed to toggle favorite.')
    });
  }

  onToggleRecurring(id: number): void {
    this.expenseService.toggleRecurring(id).subscribe({
      next: () => this.loadData(),
      error: () => (this.error = 'Failed to toggle recurring.')
    });
  }

  onBulkDelete(ids: number[]): void {
    this.expenseService.bulkDelete(ids).subscribe({
      next: () => this.loadData(),
      error: () => (this.error = 'Failed to delete expenses.')
    });
  }

  onBudgetSave(monthlyLimit: number): void {
    this.expenseService.updateBudget(monthlyLimit).subscribe({
      next: () => this.loadInsights(),
      error: () => (this.error = 'Failed to update budget.')
    });
  }

  // Bill handlers
  onBillSave(request: BillRequest): void {
    this.billService.create(request).subscribe({
      next: () => this.loadBills(),
      error: () => (this.error = 'Failed to save bill.')
    });
  }

  onBillDelete(id: number): void {
    this.billService.delete(id).subscribe({
      next: () => this.loadBills(),
      error: () => (this.error = 'Failed to delete bill.')
    });
  }

  onBillToggleActive(id: number): void {
    this.billService.toggleActive(id).subscribe({
      next: () => this.loadBills(),
      error: () => (this.error = 'Failed to update bill.')
    });
  }

  // Split handlers
  onSplitSave(request: SplitExpenseRequest): void {
    this.splitService.create(request).subscribe({
      next: () => this.loadSplits(),
      error: () => (this.error = 'Failed to save split.')
    });
  }

  onSplitDelete(id: number): void {
    this.splitService.delete(id).subscribe({
      next: () => this.loadSplits(),
      error: () => (this.error = 'Failed to delete split.')
    });
  }

  onSplitSettle(id: number): void {
    this.splitService.settle(id).subscribe({
      next: () => this.loadSplits(),
      error: () => (this.error = 'Failed to settle split.')
    });
  }

  // Forward/Share
  loadForwardSummary(): void {
    this.forwardLoading = true;
    const request: ForwardRequest = {
      dateFrom: this.forwardDateFrom,
      dateTo: this.forwardDateTo
    };
    this.expenseService.forwardExpenses(request).subscribe({
      next: summary => {
        this.forwardSummary = summary;
        this.forwardLoading = false;
      },
      error: () => {
        this.forwardLoading = false;
        this.error = 'Failed to generate summary.';
      }
    });
  }

  copyForwardText(): void {
    if (this.forwardSummary?.formattedText) {
      navigator.clipboard.writeText(this.forwardSummary.formattedText).then(() => {
        alert('Copied to clipboard!');
      });
    }
  }

  shareViaWhatsApp(): void {
    if (this.forwardSummary?.formattedText) {
      const text = encodeURIComponent(this.forwardSummary.formattedText);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  }
}
