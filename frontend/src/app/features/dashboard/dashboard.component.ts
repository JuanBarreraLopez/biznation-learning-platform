import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private courseService = inject(CourseService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  courses: any[] = [];
  user: any = null;
  isLoading: boolean = false;
  uiMessage: { text: string, type: 'success' | 'error' } | null = null;

  studentForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // 1. Nuevo formulario para cursos
  courseForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required]
  });

  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (response) => this.courses = response.data || [],
      error: (err) => this.showMessage('Error cargando los cursos.', 'error')
    });
  }

  // 2. Método para crear curso y recargar la lista
  createNewCourse() {
    if (this.courseForm.invalid) return;
    this.isLoading = true;

    this.courseService.createCourse(this.courseForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showMessage('Curso creado exitosamente.', 'success');
        this.courseForm.reset();
        this.loadCourses(); // Recargamos la lista para ver el nuevo curso
      },
      error: (err) => {
        this.isLoading = false;
        this.showMessage('Error al crear el curso.', 'error');
      }
    });
  }

  createStudent() {
    if (this.studentForm.invalid) return;
    this.isLoading = true;
    const userData = { ...this.studentForm.value, role: 'student' };

    fetch('http://localhost:3000/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getToken()}`
      },
      body: JSON.stringify(userData)
    })
    .then(res => res.json())
    .then(data => {
      this.isLoading = false;
      if (data.error) throw new Error(data.error);
      this.showMessage('Estudiante creado exitosamente.', 'success');
      this.studentForm.reset();
    })
    .catch(err => {
      this.isLoading = false;
      this.showMessage('Error al crear el estudiante. Quizás el correo ya existe.', 'error');
    });
  }

  markLessonAsCompleted(lessonId: string) {
    this.isLoading = true;
    this.courseService.updateProgress(lessonId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showMessage(`¡Progreso actualizado! Llevas el ${res.progressPercentage}% del curso.`, 'success');
      },
      error: (err) => {
        this.isLoading = false;
        this.showMessage('Error al actualizar progreso.', 'error');
      }
    });
  }

  showMessage(text: string, type: 'success' | 'error') {
    this.uiMessage = { text, type };
    setTimeout(() => this.uiMessage = null, 5000);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
