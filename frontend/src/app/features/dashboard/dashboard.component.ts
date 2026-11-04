import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private courseService = inject(CourseService);
  private authService = inject(AuthService);
  private router = inject(Router);

  courses: any[] = [];
  user: any = null;

  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (response) => {
        // Adaptamos la lectura porque el backend ahora devuelve { data: [...], pagination: {...} }
        this.courses = response.data || [];
      },
      error: (err) => console.error('Error cargando cursos', err)
    });
  }

  // Simulación rápida para la prueba técnica (hardcodeamos un UUID válido si tuviéramos uno)
  // En la vida real, el ID vendría de la lección seleccionada.
  markLessonAsCompleted(lessonId: string) {
    this.courseService.updateProgress(lessonId).subscribe({
      next: (res) => alert(`¡Progreso actualizado! Llevas el ${res.progressPercentage}% del curso.`),
      error: (err) => alert('Error al actualizar progreso. Verifica que estés matriculado.')
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
