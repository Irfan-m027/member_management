import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { AdminResponse, LoginRequest, LoginResponse } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentAdminSubject = new BehaviorSubject<any>(null);
  private http = inject(HttpClient);

  constructor() {
    this.checkInitialAuth();
   }

   private checkInitialAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
      this.loadAdminProfile().subscribe();
    }
   }

   login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
    .pipe(
      tap(response => {
        if (response.success && response.token) {
          localStorage.setItem('token', response.token);
          this.isAuthenticatedSubject.next(true);
          this.loadAdminProfile().subscribe();
        }
      }),
      catchError(error => {
        return throwError(() => error?.error?.message || 'login failed');
      })
    );
 }

 loadAdminProfile(): Observable<AdminResponse> {
  return this.http.get<AdminResponse>(`${this.API_URL}/auth/admin`)
  .pipe(
    tap(response => {
      if (response.success) {
        this.currentAdminSubject.next(response.data);
      }
    })
  );
 }

 logOut(): void {
  localStorage.removeItem('token');
  this.isAuthenticatedSubject.next(false);
  this.currentAdminSubject.next(null);
 }

 isAuthenticated(): Observable<boolean> {
  return this.isAuthenticatedSubject.asObservable();
 }

 getCurrentAdmin(): Observable<any> {
  return this.currentAdminSubject.asObservable();
 }

 getToken(): string | null {
  return localStorage.getItem('token');
 }
}
