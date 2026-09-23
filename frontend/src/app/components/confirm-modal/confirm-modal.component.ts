import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (show) {
      <div class="modal-overlay" (click)="onCancel()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-icon" [class.danger]="type === 'danger'" [class.warning]="type === 'warning'">
            <i [class]="type === 'danger' ? 'ri-error-warning-line' : 'ri-question-line'"></i>
          </div>
          <h3 class="modal-title">{{ title }}</h3>
          <p class="modal-message">{{ message }}</p>
          <div class="modal-actions">
            <button class="modal-btn cancel" type="button" (click)="onCancel()">Cancel</button>
            <button class="modal-btn confirm" [class.danger]="type === 'danger'" [class.warning]="type === 'warning'" type="button" (click)="onConfirm()">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .modal-box {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: modalIn 0.2s ease;
    }

    @keyframes modalIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .modal-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      font-size: 1.5rem;
    }

    .modal-icon.warning {
      background: #fef3c7;
      color: #d97706;
    }

    .modal-icon.danger {
      background: #fee2e2;
      color: #dc2626;
    }

    .modal-title {
      margin: 0 0 0.5rem;
      font-size: 1.15rem;
      color: var(--text-primary);
    }

    .modal-message {
      margin: 0 0 1.5rem;
      color: var(--text-muted);
      font-size: 0.925rem;
      line-height: 1.5;
    }

    .modal-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
    }

    .modal-btn {
      border: none;
      border-radius: 10px;
      padding: 0.65rem 1.5rem;
      font: inherit;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .modal-btn.cancel {
      background: var(--bg-surface);
      color: var(--text-secondary);
      border: 1px solid var(--border);
    }

    .modal-btn.cancel:hover {
      background: var(--border);
    }

    .modal-btn.confirm {
      background: var(--accent);
      color: #fff;
    }

    .modal-btn.confirm:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .modal-btn.confirm.danger {
      background: #dc2626;
    }

    .modal-btn.confirm.warning {
      background: #d97706;
    }
  `]
})
export class ConfirmModalComponent {
  @Input() show = false;
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Input() confirmText = 'Confirm';
  @Input() type: 'warning' | 'danger' = 'warning';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
