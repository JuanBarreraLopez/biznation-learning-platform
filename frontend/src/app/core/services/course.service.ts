import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/courses';

  getCourses(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Nuevo método para que el estudiante actualice su avance
  updateProgress(lessonId: string): Observable<any> {
    return this.http.patch(`http://localhost:3000/api/v1/courses/lessons/${lessonId}/progress`, {});
  }
}
