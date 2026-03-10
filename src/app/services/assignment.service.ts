import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  private apiUrl = 'http://localhost:8080/api/assignments';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Teacher: post new assignment
  createAssignment(assignment: any): Observable<any> {
    return this.http.post(this.apiUrl, assignment, { headers: this.getHeaders() });
  }

  // Teacher: get own assignments
  getAssignmentsByTeacher(teacherId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teacher/${teacherId}`, { headers: this.getHeaders() });
  }

  // Student: get assignments for their class
  getAssignmentsByClass(className: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/class/${className}`, { headers: this.getHeaders() });
  }

  // Student: submit assignment
  submitAssignment(assignmentId: string, submission: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${assignmentId}/submit`, submission, { headers: this.getHeaders() });
  }

  // Teacher: grade a submission
  gradeSubmission(assignmentId: string, studentId: string, grade: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${assignmentId}/grade/${studentId}`, { grade }, { headers: this.getHeaders() });
  }

  // Teacher: delete assignment
  deleteAssignment(assignmentId: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${assignmentId}`, { headers: this.getHeaders(), responseType: 'text' });
  }
}
