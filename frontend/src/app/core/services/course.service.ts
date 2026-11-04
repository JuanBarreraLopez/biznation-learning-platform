import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000/api/v1/courses';

  private getHeaders() {
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authService.getToken()}` }) };
  }

  getCourses(search: string = ''): Observable<any> {
    const url = search ? `${this.apiUrl}?search=${search}` : this.apiUrl;
    return this.http.get<any>(url, this.getHeaders()); // Asegúrate de enviar los headers si la ruta está protegida
  }
  createCourse(courseData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, courseData, this.getHeaders());
  }

  updateProgress(lessonId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/lessons/${lessonId}/progress`, {}, this.getHeaders());
  }
}
