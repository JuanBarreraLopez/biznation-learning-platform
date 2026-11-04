import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/courses';

  getCourses(): Observable<any[]> {
    // El Interceptor que creamos le pegará el Token automáticamente a esta petición
    return this.http.get<any[]>(this.apiUrl);
  }
}
