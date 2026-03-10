import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InternshipService {

  private apiUrl = 'http://localhost:8080/api/internships';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getAllInternships(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getInternshipsByStudent(studentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/student/${studentId}`, { headers: this.getHeaders() });
  }

  submitInternship(internship: any): Observable<any> {
    return this.http.post(this.apiUrl, internship, { headers: this.getHeaders() });
  }

  approveInternship(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {}, { headers: this.getHeaders() });
  }

  rejectInternship(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reject`, {}, { headers: this.getHeaders() });
  }

  deleteInternship(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders(), responseType: 'text' });
}
}