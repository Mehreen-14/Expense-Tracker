import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Route } from '@angular/router';
import { AppComponent } from './app/app.component';
import { PaymentSuccessComponent } from './app/components/payment-success/payment-success.component';
import { PaymentFailComponent } from './app/components/payment-fail/payment-fail.component';
import { PaymentCancelComponent } from './app/components/payment-cancel/payment-cancel.component';

const routes: Route[] = [
  { path: 'payment/success', component: PaymentSuccessComponent },
  { path: 'payment/fail', component: PaymentFailComponent },
  { path: 'payment/cancel', component: PaymentCancelComponent },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
