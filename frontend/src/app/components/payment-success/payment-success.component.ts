import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="payment-result">
      <div class="result-card success">
        <div class="result-icon"><i class="ri-checkbox-circle-fill"></i></div>
        <h1>Payment Successful</h1>
        <p class="tran-id" *ngIf="tranId">Transaction ID: {{ tranId }}</p>
        <p class="message">{{ message }}</p>
        <button class="btn btn-primary" (click)="goHome()">
          <i class="ri-home-line"></i> Back to Home
        </button>
      </div>
    </div>
  `,
  styles: [`
    .payment-result { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f8fafc; }
    .result-card { background: #fff; border-radius: 18px; padding: 3rem 2.5rem; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.08); max-width: 420px; width: 100%; }
    .result-icon { font-size: 4rem; margin-bottom: 1rem; }
    .result-icon.success { color: #10b981; }
    h1 { margin: 0 0 0.5rem; font-size: 1.5rem; color: #0f172a; }
    .tran-id { font-size: 0.85rem; color: #64748b; background: #f1f5f9; padding: 0.4rem 0.8rem; border-radius: 8px; display: inline-block; margin-bottom: 1rem; font-family: monospace; }
    .message { color: #475569; margin-bottom: 1.5rem; }
    .btn { border: none; border-radius: 10px; padding: 0.7rem 1.5rem; font: inherit; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; }
    .btn-primary { background: linear-gradient(135deg, #0d9488, #14b8a6); color: #fff; }
  `]
})
export class PaymentSuccessComponent implements OnInit {
  tranId = '';
  message = 'Your payment has been processed successfully.';

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.tranId = this.route.snapshot.queryParamMap.get('tran_id') || '';
    if (this.tranId) {
      this.http.post(`http://localhost:8080/api/payment/verify/${this.tranId}`, {}).subscribe({
        next: (res: any) => {
          if (res.status === 'COMPLETED') {
            this.message = `৳${res.amount} sent successfully. Expense logged.`;
          } else {
            this.message = 'Payment verification completed.';
          }
        },
        error: () => { this.message = 'Payment received. Verification pending.'; }
      });
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
