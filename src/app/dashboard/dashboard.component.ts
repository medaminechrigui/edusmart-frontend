import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../services/application.service';
import { AuthService } from '../services/auth.service';
import { TeacherService } from '../services/teacher.service';
import { CollegeClassService } from '../services/college-class.service';
import { InternshipService } from '../services/internship.service';

interface Application {
  id: string;
  firstNameFr: string;
  lastNameFr: string;
  department: string;
  dateOfBirth: string;
  status: string;
}

interface Class {
  id: string;
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
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  subjects: string;
}

interface Internship {
  id: string;
  studentId: string;
  studentName: string;
  company: string;
  duration: string;
  startDate: string;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  showAddTeacherModal: boolean = false;
  activeSection: string = 'applications';

  applications: Application[] = [];

  classes: Class[] = [
  ];

  teachers: Teacher[] = [

  ];

  internships: Internship[] = [
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


showEditTeacherModal: boolean = false;
selectedTeacher: any = null;

editTeacher = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
  subjects: ''
};  


showAddClassModal: boolean = false;
newClass = {
  name: '',
  department: '',
  level: '',
  studentCount: 0,
  subjects: ''
};

  newTeacher = {
    fullName: '',
    email: '',
    department: '',
    subjects: ''
  };

  constructor(
    private router: Router,
    private applicationService: ApplicationService,
    private authService: AuthService,
    private teacherService: TeacherService,
    private collegeClassService: CollegeClassService,
    private internshipService: InternshipService
  ) {}

  ngOnInit() {
  this.loadApplications();
  this.loadTeachers();
  this.loadClasses();
  this.loadInternships();
}

  loadInternships() {
  this.internshipService.getAllInternships().subscribe({
    next: (data) => {
      this.internships = data;
    },
    error: (err) => console.error('Error loading internships:', err)
  });
}

  loadClasses() {
  this.collegeClassService.getAllClasses().subscribe({
    next: (data) => {
      this.classes = data;
    },
    error: (err) => console.error('Error loading classes:', err)
  });
}

  loadTeachers() {
  this.teacherService.getAllTeachers().subscribe({
    next: (data) => {
      this.teachers = data;
    },
    error: (err) => console.error('Error loading teachers:', err)
  });
}

  loadApplications() {
    this.applicationService.getAllApplications().subscribe({
      next: (data) => {
        this.applications = data;
      },
      error: (err) => {
        console.error('Error loading applications:', err);
      }
    });
  }

  // Applications
  approveApplication(id: string) {
    this.applicationService.approveApplication(id).subscribe({
      next: () => this.loadApplications(),
      error: (err) => console.error(err)
    });
  }

  rejectApplication(id: string) {
    this.applicationService.rejectApplication(id).subscribe({
      next: () => this.loadApplications(),
      error: (err) => console.error(err)
    });
  }

  getPendingApplications(): number {
    return this.applications.filter(a => a.status === 'PENDING').length;
  }

  getApprovedApplications(): number {
    return this.applications.filter(a => a.status === 'APPROVED').length;
  }

  getRejectedApplications(): number {
    return this.applications.filter(a => a.status === 'REJECTED').length;
  }

  // Teachers
  openAddTeacherModal() {
    this.showAddTeacherModal = true;
  }

  closeAddTeacherModal() {
    this.showAddTeacherModal = false;
    this.newTeacher = { fullName: '', email: '', department: '', subjects: '' };
  }

 addTeacher() {
  if (!this.newTeacher.fullName || !this.newTeacher.email || !this.newTeacher.department || !this.newTeacher.subjects) {
    return;
  }

  const nameParts = this.newTeacher.fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  const teacher = {
    firstName: firstName,
    lastName: lastName,
    email: this.newTeacher.email,
    password: 'teacher123',
    department: this.newTeacher.department,
    subjects: this.newTeacher.subjects,
    role: 'TEACHER'
  };

  console.log('Sending teacher:', teacher);

  this.teacherService.addTeacher(teacher).subscribe({
    next: () => {
      this.loadTeachers();
      this.closeAddTeacherModal();
    },
    error: (err) => {
      console.log('Full error:', err);
      console.log('Error message:', err.error);
    }
  });
}

  getTotalTeachers(): number {
    return this.teachers.length;
  }

  getTotalDepartments(): number {
    return [...new Set(this.teachers.map(t => t.department))].length;
  }

  // Classes
  getTotalStudents(): number {
    return this.classes.reduce((total, c) => total + c.studentCount, 0);
  }

  // Timetable
  selectClass(className: string) {
    this.selectedClass = className;
  }

  getCurrentTimetable(): TimetableSlot[] {
    return this.timetables[this.selectedClass] || [];
  }

  // Internships
  approveInternship(id: string) {
  this.internshipService.approveInternship(id).subscribe({
    next: () => this.loadInternships(),
    error: (err) => console.error(err)
  });
}

rejectInternship(id: string) {
  this.internshipService.rejectInternship(id).subscribe({
    next: () => this.loadInternships(),
    error: (err) => console.error(err)
  });
}

getPendingInternships(): number {
  return this.internships.filter(i => i.status === 'PENDING').length;
}

getApprovedInternships(): number {
  return this.internships.filter(i => i.status === 'APPROVED').length;
}

  // Sidebar
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

  openAddClassModal() {
  this.showAddClassModal = true;
}

closeAddClassModal() {
  this.showAddClassModal = false;
  this.newClass = { name: '', department: '', level: '', studentCount: 0, subjects: '' };
}

addClass() {
  if (!this.newClass.name || !this.newClass.department || !this.newClass.level) {
    return;
  }
  const classData = {
    name: this.newClass.name,
    department: this.newClass.department,
    level: this.newClass.level,
    studentCount: this.newClass.studentCount,
    subjects: this.newClass.subjects.split(',').map((s: string) => s.trim())
  };
  this.collegeClassService.addClass(classData).subscribe({
    next: () => {
      this.loadClasses();
      this.closeAddClassModal();
    },
    error: (err) => console.error('Error adding class:', err)
  });
}

openEditTeacherModal(teacher: any) {
  this.selectedTeacher = teacher;
  this.editTeacher = {
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    email: teacher.email,
    department: teacher.department,
    subjects: teacher.subjects
  };
  this.showEditTeacherModal = true;
}

closeEditTeacherModal() {
  this.showEditTeacherModal = false;
  this.selectedTeacher = null;
}

updateTeacher() {
  if (!this.editTeacher.firstName || !this.editTeacher.email || !this.editTeacher.department) {
    return;
  }
  this.teacherService.updateTeacher(this.selectedTeacher.id, this.editTeacher).subscribe({
    next: () => {
      this.loadTeachers();
      this.closeEditTeacherModal();
    },
    error: (err) => console.error('Error updating teacher:', err)
  });
}

deleteApplication(id: string) {
  if (confirm('Are you sure you want to delete this application?')) {
    this.applicationService.deleteApplication(id).subscribe({
      next: () => this.loadApplications(),
      error: (err) => console.error(err)
    });
  }
}

deleteTeacher(id: string) {
  if (confirm('Are you sure you want to delete this teacher?')) {
    this.teacherService.deleteTeacher(id).subscribe({
      next: () => this.loadTeachers(),
      error: (err) => console.error(err)
    });
  }
}

deleteClass(id: string) {
  if (confirm('Are you sure you want to delete this class?')) {
    this.collegeClassService.deleteClass(id).subscribe({
      next: () => this.loadClasses(),
      error: (err) => console.error(err)
    });
  }
}

deleteInternship(id: string) {
  if (confirm('Are you sure you want to delete this internship?')) {
    this.internshipService.deleteInternship(id).subscribe({
      next: () => this.loadInternships(),
      error: (err) => console.error(err)
    });
  }
}
  logout() {
  this.authService.logout();
}

}