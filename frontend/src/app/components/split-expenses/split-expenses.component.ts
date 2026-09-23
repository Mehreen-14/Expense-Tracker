import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { SplitExpense, SplitExpenseRequest } from '../../models/split.model';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-split-expenses',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './split-expenses.component.html',
  styleUrl: './split-expenses.component.css'
})
export class SplitExpensesComponent {
  @Input() splits: SplitExpense[] = [];
  @Output() save = new EventEmitter<SplitExpenseRequest>();
  @Output() delete = new EventEmitter<number>();
  @Output() settle = new EventEmitter<number>();

  form: FormGroup;
  showForm = false;

  // Confirm modal
  showDeleteConfirm = false;
  showSettleConfirm = false;
  pendingDeleteId: number | null = null;
  pendingSettleId: number | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(100)]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      paidBy: ['', Validators.required],
      splitDate: [this.todayString(), Validators.required],
      participants: this.fb.array([])
    });
  }

  get participants(): FormArray {
    return this.form.get('participants') as FormArray;
  }

  get unsettledSplits(): SplitExpense[] {
    return this.splits.filter(s => !s.settled);
  }

  get settledSplits(): SplitExpense[] {
    return this.splits.filter(s => s.settled);
  }

  get totalUnsettled(): number {
    return this.unsettledSplits.reduce((sum, s) => sum + Number(s.amount), 0);
  }

  addParticipant(): void {
    this.participants.push(this.fb.group({
      name: ['', Validators.required],
      amountOwed: [null, [Validators.required, Validators.min(0)]]
    }));
  }

  removeParticipant(index: number): void {
    this.participants.removeAt(index);
  }

  startAdd(): void {
    this.showForm = true;
    this.form.reset({
      description: '',
      amount: null,
      paidBy: '',
      splitDate: this.todayString(),
      participants: []
    });
    this.participants.clear();
    this.addParticipant();
    this.addParticipant();
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.value as SplitExpenseRequest);
    this.showForm = false;
  }

  cancelForm(): void {
    this.showForm = false;
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

  onSettle(id: number): void {
    this.pendingSettleId = id;
    this.showSettleConfirm = true;
  }

  confirmSettle(): void {
    if (this.pendingSettleId !== null) {
      this.settle.emit(this.pendingSettleId);
      this.pendingSettleId = null;
    }
    this.showSettleConfirm = false;
  }

  private todayString(): string {
    return new Date().toISOString().split('T')[0];
  }
}
