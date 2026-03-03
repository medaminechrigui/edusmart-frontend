import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CollegeClassService {

  private apiUrl = 'http://localhost:8080/api/classes';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getAllClasses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addClass(collegeClass: any): Observable<any> {
    return this.http.post(this.apiUrl, collegeClass, { headers: this.getHeaders() });
  }

  updateClass(id: string, collegeClass: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, collegeClass, { headers: this.getHeaders() });
  }

  deleteClass(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}