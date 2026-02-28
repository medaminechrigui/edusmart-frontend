import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Application {
  id: number;
  fullName: string;
  department: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Class {
  id: number;
  name: string;
  department: string;
  level: string;
  studentCount: number;
  subjects: string[];
}

interface TimetableSlot {
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
}

interface Teacher {
  id: number;
  fullName: string;
  email: string;
  department: string;
  subjects: string;
}

interface Internship {
  id: number;
  student: string;
  company: string;
  duration: string;
  status: 'pending' | 'approved' | 'rejected';
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  showAddTeacherModal: boolean = false;

  

  activeSection: string = 'applications';

  applications: Application[] = [
    { id: 1, fullName: 'Ahmed Ben Ali', department: 'Computer Science', date: '2024-09-01', status: 'pending' },
    { id: 2, fullName: 'Sarra Mansour', department: 'Mathematics', date: '2024-09-02', status: 'approved' },
    { id: 3, fullName: 'Yassine Trabelsi', department: 'Electrical Engineering', date: '2024-09-03', status: 'rejected' },
  ];

  classes: Class[] = [
    { id: 1, name: 'DSI1', department: 'Computer Science', level: '1st Year', studentCount: 30, subjects: ['Algorithms', 'Mathematics', 'English'] },
    { id: 2, name: 'DSI2', department: 'Computer Science', level: '2nd Year', studentCount: 28, subjects: ['Data Structures', 'Databases', 'Web Development'] },
    { id: 3, name: 'DSI3', department: 'Computer Science', level: '3rd Year', studentCount: 25, subjects: ['Software Engineering', 'Networks', 'AI'] },
    { id: 4, name: 'GL1', department: 'Civil Engineering', level: '1st Year', studentCount: 22, subjects: ['Mechanics', 'Mathematics', 'Physics'] },
  ];

  teachers: Teacher[] = [
    { id: 1, fullName: 'Dr. Karim Bouaziz', email: 'k.bouaziz@edusmart.com', department: 'Computer Science', subjects: 'Algorithms, Data Structures' },
    { id: 2, fullName: 'Dr. Leila Hamdi', email: 'l.hamdi@edusmart.com', department: 'Mathematics', subjects: 'Analysis, Algebra' },
  ];

  internships: Internship[] = [
    { id: 1, student: 'Ahmed Ben Ali', company: 'Vermeg', duration: '2 months', status: 'pending' },
    { id: 2, student: 'Sarra Mansour', company: 'Telnet', duration: '3 months', status: 'approved' },
  ];

  selectedClass: string = 'DSI1';

  timetables: { [key: string]: TimetableSlot[] } = {
    'DSI1': [
      { time: '08:00 - 10:00', monday: 'Algorithms', tuesday: 'Mathematics', wednesday: '—', thursday: 'English', friday: 'Algorithms' },
      { time: '10:00 - 12:00', monday: 'Mathematics', tuesday: '—', wednesday: 'Algorithms', thursday: 'Mathematics', friday: '—' },
      { time: '14:00 - 16:00', monday: '—', tuesday: 'English', wednesday: 'Mathematics', thursday: '—', friday: 'English' },
      { time: '16:00 - 18:00', monday: 'English', tuesday: 'Algorithms', wednesday: '—', thursday: 'Algorithms', friday: 'Mathematics' },
    ],
    'DSI2': [
      { time: '08:00 - 10:00', monday: 'Databases', tuesday: '—', wednesday: 'Web Development', thursday: 'Data Structures', friday: '—' },
      { time: '10:00 - 12:00', monday: '—', tuesday: 'Data Structures', wednesday: 'Databases', thursday: '—', friday: 'Web Development' },
      { time: '14:00 - 16:00', monday: 'Web Development', tuesday: 'Databases', wednesday: '—', thursday: 'Web Development', friday: 'Data Structures' },
      { time: '16:00 - 18:00', monday: 'Data Structures', tuesday: '—', wednesday: 'Data Structures', thursday: 'Databases', friday: '—' },
    ],
    'DSI3': [
      { time: '08:00 - 10:00', monday: 'AI', tuesday: 'Networks', wednesday: '—', thursday: 'Software Engineering', friday: 'AI' },
      { time: '10:00 - 12:00', monday: 'Software Engineering', tuesday: '—', wednesday: 'AI', thursday: 'Networks', friday: '—' },
      { time: '14:00 - 16:00', monday: '—', tuesday: 'AI', wednesday: 'Software Engineering', thursday: '—', friday: 'Networks' },
      { time: '16:00 - 18:00', monday: 'Networks', tuesday: 'Software Engineering', wednesday: '—', thursday: 'AI', friday: 'Software Engineering' },
    ],
    'GL1': [
      { time: '08:00 - 10:00', monday: 'Mechanics', tuesday: 'Physics', wednesday: '—', thursday: 'Mathematics', friday: 'Mechanics' },
      { time: '10:00 - 12:00', monday: 'Mathematics', tuesday: '—', wednesday: 'Mechanics', thursday: 'Physics', friday: '—' },
      { time: '14:00 - 16:00', monday: '—', tuesday: 'Mathematics', wednesday: 'Physics', thursday: '—', friday: 'Mathematics' },
      { time: '16:00 - 18:00', monday: 'Physics', tuesday: 'Mechanics', wednesday: '—', thursday: 'Mechanics', friday: 'Physics' },
    ],
  };



  constructor(private router: Router) { }

  newTeacher = {
    fullName: '',
    email: '',
    department: '',
    subjects: ''
  };

  openAddTeacherModal() {
    this.showAddTeacherModal = true;
  }

  closeAddTeacherModal() {
    this.showAddTeacherModal = false;
    this.newTeacher = { fullName: '', email: '', department: '', subjects: '' };
  }

  addTeacher() {
  console.log('newTeacher:', this.newTeacher);
  if (!this.newTeacher.fullName || !this.newTeacher.email || !this.newTeacher.department || !this.newTeacher.subjects) {
    console.log('Validation failed');
    return;
  }
  this.teachers = [...this.teachers, {
    id: this.teachers.length + 1,
    fullName: this.newTeacher.fullName,
    email: this.newTeacher.email,
    department: this.newTeacher.department,
    subjects: this.newTeacher.subjects
  }];
  this.closeAddTeacherModal();
}

  setSection(section: string) {
    this.activeSection = section;
  }

  getSectionTitle(): string {
    switch (this.activeSection) {
      case 'applications': return 'Student Applications';
      case 'teachers': return 'Teacher Management';
      case 'classes': return 'Classes Management';
      case 'timetable': return 'Timetable Generator';
      case 'internships': return 'Internship Management';
      default: return 'Dashboard';
    }
  }

  // Applications
  approveApplication(id: number) {
    const app = this.applications.find(a => a.id === id);
    if (app) app.status = 'approved';
  }

  rejectApplication(id: number) {
    const app = this.applications.find(a => a.id === id);
    if (app) app.status = 'rejected';
  }

  getPendingApplications(): number {
    return this.applications.filter(a => a.status === 'pending').length;
  }

  getApprovedApplications(): number {
    return this.applications.filter(a => a.status === 'approved').length;
  }

  getRejectedApplications(): number {
    return this.applications.filter(a => a.status === 'rejected').length;
  }

  // Internships
  approveInternship(id: number) {
    const internship = this.internships.find(i => i.id === id);
    if (internship) internship.status = 'approved';
  }

  rejectInternship(id: number) {
    const internship = this.internships.find(i => i.id === id);
    if (internship) internship.status = 'rejected';
  }

  getTotalStudents(): number {
    return this.classes.reduce((total, c) => total + c.studentCount, 0);
  }

  getPendingInternships(): number {
    return this.internships.filter(i => i.status === 'pending').length;
  }

  getApprovedInternships(): number {
    return this.internships.filter(i => i.status === 'approved').length;
  }

  selectClass(className: string) {
    this.selectedClass = className;
  }

  getCurrentTimetable(): TimetableSlot[] {
    return this.timetables[this.selectedClass] || [];
  }

  getTotalTeachers(): number {
  return this.teachers.length;
}

getTotalDepartments(): number {
  return [...new Set(this.teachers.map(t => t.department))].length;
}

  logout() {
    this.router.navigate(['/']);
  }

}