import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-application',
  imports: [FormsModule, CommonModule],
  templateUrl: './application.component.html',
  styleUrl: './application.component.css'
})
export class ApplicationComponent {

  // Personal Info
  firstNameFr: string = '';
  lastNameFr: string = '';
  dateOfBirth: string = '';
  placeOfBirth: string = '';
  gender: string = '';
  nationality: string = '';
  cin: string = '';
  cinIssueDate: string = '';

  // Contact Info
  email: string = '';
  phone: string = '';
  emergencyContact: string = '';
  address: string = '';
  governorate: string = '';
  postalCode: string = '';

  // Baccalaureate Info
  bacYear: number | null = null;
  bacSession: string = '';
  bacSection: string = '';
  bacGrade: number | null = null;
  highSchool: string = '';

  // Academic Preferences
  department: string = '';
  notes: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (
      !this.firstNameFr || !this.lastNameFr || !this.dateOfBirth ||
      !this.placeOfBirth || !this.gender || !this.cin ||
      !this.email || !this.phone || !this.address ||
      !this.governorate || !this.bacYear || !this.bacSection ||
      !this.bacGrade || !this.highSchool || !this.department
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      this.successMessage = '';
      return;
    }

    if (!this.email.includes('@')) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (this.cin.length !== 8) {
      this.errorMessage = 'CIN number must be 8 digits.';
      return;
    }

    // For now just show success — later we'll send this to Spring Boot
    this.errorMessage = '';
    this.successMessage = '✅ Your application has been submitted successfully! The admin will review it shortly.';
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
