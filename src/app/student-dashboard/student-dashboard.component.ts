import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
interface TimetableSlot {
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
}

interface Assignment {
  id: number;
  subject: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted';
}

interface InternshipRequest {
  id: number;
  company: string;
  duration: string;
  startDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ChatMessage {
  sender: string;
  text: string;
  time: string;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent {

  activeSection: string = 'timetable';

  // Timetable
  timetable: TimetableSlot[] = [
    { time: '08:00 - 10:00', monday: 'Algorithms', tuesday: 'Mathematics', wednesday: '—', thursday: 'English', friday: 'Algorithms' },
    { time: '10:00 - 12:00', monday: 'Mathematics', tuesday: '—', wednesday: 'Algorithms', thursday: 'Mathematics', friday: '—' },
    { time: '14:00 - 16:00', monday: '—', tuesday: 'English', wednesday: 'Mathematics', thursday: '—', friday: 'English' },
    { time: '16:00 - 18:00', monday: 'English', tuesday: 'Algorithms', wednesday: '—', thursday: 'Algorithms', friday: 'Mathematics' },
  ];

  // Assignments
  assignments: Assignment[] = [
    { id: 1, subject: 'Algorithms', title: 'Exercise 1 — Sorting Algorithms', dueDate: '2024-10-15', status: 'pending' },
    { id: 2, subject: 'Mathematics', title: 'Problem Set 3', dueDate: '2024-10-18', status: 'submitted' },
    { id: 3, subject: 'English', title: 'Essay — Technology in Education', dueDate: '2024-10-20', status: 'pending' },
  ];

  // Internships
  internshipRequests: InternshipRequest[] = [
    { id: 1, company: 'Vermeg', duration: '2 months', startDate: '2024-11-01', status: 'pending' },
  ];

  showInternshipModal: boolean = false;

  newInternship = {
    company: '',
    duration: '',
    startDate: ''
  };

  // Chat
  teachers: string[] = ['Dr. Karim Bouaziz', 'Dr. Leila Hamdi'];
  selectedTeacher: string = '';
  newMessage: string = '';

  chats: { [key: string]: ChatMessage[] } = {
    'Dr. Karim Bouaziz': [
      { sender: 'Dr. Karim Bouaziz', text: 'Hello! Do you have any questions about the last lecture?', time: '09:15' },
      { sender: 'me', text: 'Yes! I had a question about recursion.', time: '09:20' },
    ],
    'Dr. Leila Hamdi': [],
  };

  constructor(private router: Router, private authService: AuthService) {}

  setSection(section: string) {
    this.activeSection = section;
  }

  getSectionTitle(): string {
    switch (this.activeSection) {
      case 'timetable': return 'My Timetable';
      case 'classroom': return 'Virtual Classroom';
      case 'internship': return 'Internship Request';
      case 'chat': return 'Text My Teacher';
      case 'profile': return 'My Profile';
      default: return 'Dashboard';
    }
  }

  // Assignments
  submitAssignment(id: number) {
    const assignment = this.assignments.find(a => a.id === id);
    if (assignment) assignment.status = 'submitted';
  }

  getPendingAssignments(): number {
    return this.assignments.filter(a => a.status === 'pending').length;
  }

  getSubmittedAssignments(): number {
    return this.assignments.filter(a => a.status === 'submitted').length;
  }

  // Internships
  openInternshipModal() {
    this.showInternshipModal = true;
  }

  closeInternshipModal() {
    this.showInternshipModal = false;
    this.newInternship = { company: '', duration: '', startDate: '' };
  }

  submitInternshipRequest() {
    if (!this.newInternship.company || !this.newInternship.duration || !this.newInternship.startDate) {
      return;
    }
    this.internshipRequests = [...this.internshipRequests, {
      id: this.internshipRequests.length + 1,
      company: this.newInternship.company,
      duration: this.newInternship.duration,
      startDate: this.newInternship.startDate,
      status: 'pending'
    }];
    this.closeInternshipModal();
  }

  getApprovedInternships(): number {
    return this.internshipRequests.filter(r => r.status === 'approved').length;
  }

  // Chat
  getChatMessages(): ChatMessage[] {
    if (!this.selectedTeacher) return [];
    return this.chats[this.selectedTeacher] || [];
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedTeacher) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (!this.chats[this.selectedTeacher]) {
      this.chats[this.selectedTeacher] = [];
    }
    this.chats[this.selectedTeacher] = [...this.chats[this.selectedTeacher], {
      sender: 'me',
      text: this.newMessage.trim(),
      time: time
    }];
    this.newMessage = '';
  }

  logout() {
  this.authService.logout();
}

}
