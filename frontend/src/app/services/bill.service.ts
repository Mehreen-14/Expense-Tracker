import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bill, BillRequest } from '../models/bill.model';

@Injectable({ providedIn: 'root' })
export class BillService {
  private readonly apiUrl = 'http://localhost:8080/api/bills';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Bill[]> {
    return this.http.get<Bill[]>(this.apiUrl);
  }

  create(bill: BillRequest): Observable<Bill> {
    return this.http.post<Bill>(this.apiUrl, bill);
  }

  update(id: number, bill: BillRequest): Observable<Bill> {
    return this.http.put<Bill>(`${this.apiUrl}/${id}`, bill);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleActive(id: number): Observable<Bill> {
    return this.http.patch<Bill>(`${this.apiUrl}/${id}/toggle-active`, {});
  }
}
