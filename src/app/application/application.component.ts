import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../services/application.service';

@Component({
  selector: 'app-application',
  standalone: true,
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
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private applicationService: ApplicationService
  ) {}

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

    this.isLoading = true;
    this.errorMessage = '';

    const applicationData = {
      firstNameFr: this.firstNameFr,
      lastNameFr: this.lastNameFr,
      dateOfBirth: this.dateOfBirth,
      placeOfBirth: this.placeOfBirth,
      gender: this.gender,
      nationality: this.nationality,
      cin: this.cin,
      cinIssueDate: this.cinIssueDate,
      email: this.email,
      phone: this.phone,
      emergencyContact: this.emergencyContact,
      address: this.address,
      governorate: this.governorate,
      postalCode: this.postalCode,
      bacYear: this.bacYear,
      bacSession: this.bacSession,
      bacSection: this.bacSection,
      bacGrade: this.bacGrade,
      highSchool: this.highSchool,
      department: this.department,
      notes: this.notes
    };

    this.applicationService.submitApplication(applicationData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Your application has been submitted successfully! The admin will review it shortly.';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error || 'Something went wrong. Please try again.';
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

}