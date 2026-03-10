import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private apiUrl = 'http://localhost:8080/api/applications';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  submitApplication(application: any): Observable<any> {
    return this.http.post(this.apiUrl, application);
  }

  getAllApplications(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  approveApplication(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {}, { headers: this.getHeaders() });
  }

  rejectApplication(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reject`, {}, { headers: this.getHeaders() });
  }

  deleteApplication(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders(), responseType: 'text' });
  }
}