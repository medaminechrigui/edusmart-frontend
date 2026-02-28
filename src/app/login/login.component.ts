import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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


  constructor(private router: Router) { }

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (!this.email.includes('@')) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }


    if (this.email === 'admin@edusmart.com' && this.password === 'admin123') {
      this.router.navigate(['/dashboard']);}
    else if (this.email === 'student@edusmart.com' && this.password === 'student123') {
    this.router.navigate(['/student-dashboard']);
    return;
  }else if (this.email === 'teacher@edusmart.com' && this.password === 'teacher123') {
  this.router.navigate(['/teacher-dashboard']);
  return;
}
   else {
      this.errorMessage = 'Invalid email or password.';
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
