import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Bill, BillRequest } from '../../models/bill.model';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-bill-manager',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './bill-manager.component.html',
  styleUrl: './bill-manager.component.css'
})
export class BillManagerComponent implements OnChanges {
  @Input() bills: Bill[] = [];
  @Input() closeRequested = false;
  @Output() save = new EventEmitter<BillRequest>();
  @Output() delete = new EventEmitter<number>();
  @Output() toggleActive = new EventEmitter<number>();
  @Output() closed = new EventEmitter<void>();

  form: FormGroup;
  editingBill: Bill | null = null;
  showForm = false;

  // Confirm modal
  showDeleteConfirm = false;
  pendingDeleteId: number | null = null;

  readonly categories = ['Rent', 'Utilities', 'Internet', 'Phone', 'Subscription', 'Insurance', 'Other'];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      amount: [null, [Validators.required, Validators.min(0)]],
      dueDay: [1, [Validators.required, Validators.min(1), Validators.max(31)]],
      category: ['Other', Validators.required],
      reminderDaysBefore: [3, [Validators.required, Validators.min(0), Validators.max(30)]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['closeRequested'] && this.closeRequested) {
      this.cancelForm();
    }
  }

  get today(): number {
    return new Date().getDate();
  }

  get currentMonth(): number {
    return new Date().getMonth();
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  daysUntilDue(dueDay: number): number {
    const now = new Date();
    const due = new Date(this.currentYear, this.currentMonth, dueDay);
    if (due < now) {
      const nextMonth = new Date(this.currentYear, this.currentMonth + 1, dueDay);
      const diff = Math.ceil((nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diff;
    }
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  dueStatus(dueDay: number): string {
    const days = this.daysUntilDue(dueDay);
    if (days <= 0) return 'overdue';
    if (days <= 3) return 'soon';
    return 'ok';
  }

  dueLabel(dueDay: number): string {
    const days = this.daysUntilDue(dueDay);
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  }

  get upcomingBills(): Bill[] {
    return this.bills
      .filter(b => b.active)
      .sort((a, b) => this.daysUntilDue(a.dueDay) - this.daysUntilDue(b.dueDay));
  }

  get totalMonthly(): number {
    return this.bills.filter(b => b.active).reduce((sum, b) => sum + Number(b.amount), 0);
  }

  startAdd(): void {
    this.editingBill = null;
    this.form.reset({ name: '', amount: null, dueDay: 1, category: 'Other', reminderDaysBefore: 3 });
    this.showForm = true;
  }

  startEdit(bill: Bill): void {
    this.editingBill = bill;
    this.form.patchValue({
      name: bill.name,
      amount: bill.amount,
      dueDay: bill.dueDay,
      category: bill.category,
      reminderDaysBefore: bill.reminderDaysBefore
    });
    this.showForm = true;
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.value as BillRequest);
    this.cancelForm();
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingBill = null;
  }

  onDelete(id: number): void {
    this.pendingDeleteId = id;
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    if (this.pendingDeleteId !== null) {
      this.delete.emit(this.pendingDeleteId);
      this.pendingDeleteId = null;
    }
    this.showDeleteConfirm = false;
  }
}
