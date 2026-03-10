import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (!this.email.includes('@')) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.authService.saveToken(response.token);

        // Decode role from token and redirect
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        const role = payload.role;
        this.authService.saveRole(role);

        if (role === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else if (role === 'TEACHER') {
          this.router.navigate(['/teacher-dashboard']);
        } else if (role === 'STUDENT') {
          this.router.navigate(['/student-dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error || 'Invalid email or password.';
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}