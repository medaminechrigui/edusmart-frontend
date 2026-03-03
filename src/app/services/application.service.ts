import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private apiUrl = 'http://localhost:8080/api/applications';

  constructor(private http: HttpClient) {}

  submitApplication(application: any): Observable<any> {
    return this.http.post(this.apiUrl, application);
  }

  getAllApplications(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  approveApplication(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectApplication(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reject`, {});
  }

  deleteApplication(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}