import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SplitExpense, SplitExpenseRequest } from '../models/split.model';

@Injectable({ providedIn: 'root' })
export class SplitService {
  private readonly apiUrl = 'http://localhost:8080/api/splits';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SplitExpense[]> {
    return this.http.get<SplitExpense[]>(this.apiUrl);
  }

  getUnsettled(): Observable<SplitExpense[]> {
    return this.http.get<SplitExpense[]>(`${this.apiUrl}/unsettled`);
  }

  create(split: SplitExpenseRequest): Observable<SplitExpense> {
    return this.http.post<SplitExpense>(this.apiUrl, split);
  }

  update(id: number, split: SplitExpenseRequest): Observable<SplitExpense> {
    return this.http.put<SplitExpense>(`${this.apiUrl}/${id}`, split);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  settle(id: number): Observable<SplitExpense> {
    return this.http.patch<SplitExpense>(`${this.apiUrl}/${id}/settle`, {});
  }
}
