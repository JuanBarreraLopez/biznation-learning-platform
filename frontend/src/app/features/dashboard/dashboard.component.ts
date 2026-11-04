import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private courseService = inject(CourseService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  courses: any[] = [];
  usersList: any[] = []; // Para la pestaña del admin
  user: any = null;
  isLoading: boolean = false;
  uiMessage: { text: string, type: 'success' | 'error' } | null = null;
  searchTerm: string = '';

  // CONTROL DE PESTAÑAS
  activeTab: 'courses' | 'users' | 'explore' = 'courses';

  studentForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  courseForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required]
  });

  ngOnInit() {
    this.user = this.authService.getUser();
    this.activeTab = this.user?.role === 'admin' ? 'courses' : 'courses'; // courses para el admin, mis cursos para estudiante
    this.loadCourses();
    if (this.user?.role === 'admin') this.loadUsers();
  }

  setTab(tabName: 'courses' | 'users' | 'explore') {
    this.activeTab = tabName;
  }

  loadCourses() {
    this.courseService.getCourses(this.searchTerm).subscribe({
      next: (response) => this.courses = response.data || [],
      error: (err) => this.showMessage('Error cargando cursos.', 'error')
    });
  }

  // Método para el botón buscar
  onSearch() {
    this.loadCourses();
  }

  loadUsers() {
    fetch('http://localhost:3000/api/v1/users', {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    }).then(res => res.json()).then(res => this.usersList = res.data || []);
  }

  createNewCourse() {
    if (this.courseForm.invalid) return;
    this.isLoading = true;
    this.courseService.createCourse(this.courseForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.showMessage('Curso creado exitosamente.', 'success');
        this.courseForm.reset();
        this.loadCourses();
      },
      error: () => { this.isLoading = false; this.showMessage('Error al crear curso.', 'error'); }
    });
  }

  createStudent() {
    if (this.studentForm.invalid) return;
    this.isLoading = true;
    const userData = { ...this.studentForm.value, role: 'student' };

    fetch('http://localhost:3000/api/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.authService.getToken()}` },
      body: JSON.stringify(userData)
    }).then(res => res.json()).then(data => {
      this.isLoading = false;
      if (data.error) throw new Error();
      this.showMessage('Estudiante registrado exitosamente.', 'success');
      this.studentForm.reset();
      this.loadUsers(); // Recargar lista
    }).catch(err => {
      this.isLoading = false;
      this.showMessage('Error al registrar estudiante (correo duplicado).', 'error');
    });
  }

  // NUEVO: Método para que un estudiante se inscriba
  enrollInCourse(courseId: string) {
    this.isLoading = true;
    fetch(`http://localhost:3000/api/v1/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    }).then(res => res.json()).then(data => {
      this.isLoading = false;
      if (data.error) {
        this.showMessage(data.error, 'error');
      } else {
        this.showMessage('¡Inscripción exitosa!', 'success');
      }
    });
  }

  markLessonAsCompleted(lessonId: string) {
    this.isLoading = true;
    this.courseService.updateProgress(lessonId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showMessage(`¡Progreso actualizado! Llevas el ${res.progressPercentage}% del curso.`, 'success');
      },
      error: () => {
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
