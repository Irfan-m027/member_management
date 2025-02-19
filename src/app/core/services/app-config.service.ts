import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../models/app-config';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private apiUrl = 'http://localhost:5000/api/app-config';

  constructor(private http: HttpClient) { }

  saveAppConfig(formData: FormData): Observable<{ success: boolean; data: AppConfig}> {
    return this.http.post<{success: boolean; data: AppConfig}>(this.apiUrl, formData)
  }

  getAppConfig(): Observable<{ success: boolean, data: AppConfig }> {
    return this.http.get<{ success: boolean; data: AppConfig }>(this.apiUrl);
  }
}
