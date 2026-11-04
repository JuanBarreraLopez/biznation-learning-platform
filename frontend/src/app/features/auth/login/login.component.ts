import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isLoading: boolean = false;
  uiMessage: { text: string, type: 'error' } | null = null;

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.uiMessage = null;

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (res) => {
          this.isLoading = false;
          // Redirigir al dashboard sin mostrar alert
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.uiMessage = {
            text: 'Credenciales inválidas. Verifica tu correo y contraseña.',
            type: 'error'
          };
          console.error(err);
        }
      });
    }
  }
}
