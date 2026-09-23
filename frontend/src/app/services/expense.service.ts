import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Budget,
  DashboardSummary,
  Expense,
  ExpenseRequest,
  InsightsSummary
} from '../models/expense.model';
import { ForwardRequest, ForwardSummary } from '../models/forward.model';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private readonly apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/expenses`);
  }

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/expenses/summary`);
  }

  getInsights(): Observable<InsightsSummary> {
    return this.http.get<InsightsSummary>(`${this.apiUrl}/insights`);
  }

  getBudget(): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiUrl}/budget`);
  }

  updateBudget(monthlyLimit: number): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl}/budget`, { monthlyLimit });
  }

  create(expense: ExpenseRequest): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiUrl}/expenses`, expense);
  }

  update(id: number, expense: ExpenseRequest): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/expenses/${id}`, expense);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/expenses/${id}`);
  }

  bulkDelete(ids: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/expenses/bulk-delete`, ids);
  }

  toggleFavorite(id: number): Observable<Expense> {
    return this.http.patch<Expense>(`${this.apiUrl}/expenses/${id}/toggle-favorite`, {});
  }

  toggleRecurring(id: number): Observable<Expense> {
    return this.http.patch<Expense>(`${this.apiUrl}/expenses/${id}/toggle-recurring`, {});
  }

  forwardExpenses(request: ForwardRequest): Observable<ForwardSummary> {
    return this.http.post<ForwardSummary>(`${this.apiUrl}/forward`, request);
  }
}
