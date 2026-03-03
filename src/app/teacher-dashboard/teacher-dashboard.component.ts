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
  class: string;
  subject: string;
  title: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
}

interface ChatMessage {
  sender: string;
  text: string;
  time: string;
}

interface Submission {
  student: string;
  submitted: boolean;
  grade: number | null;
}

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css'
})
export class TeacherDashboardComponent {

  activeSection: string = 'timetable';

  // Timetable
  timetable: TimetableSlot[] = [
    { time: '08:00 - 10:00', monday: 'DSI1 — Algorithms', tuesday: '—', wednesday: 'DSI2 — Algorithms', thursday: '—', friday: 'DSI3 — Algorithms' },
    { time: '10:00 - 12:00', monday: '—', tuesday: 'DSI2 — Data Structures', wednesday: '—', thursday: 'DSI1 — Data Structures', friday: '—' },
    { time: '14:00 - 16:00', monday: 'DSI3 — Data Structures', tuesday: '—', wednesday: '—', thursday: 'DSI2 — Algorithms', friday: '—' },
    { time: '16:00 - 18:00', monday: '—', tuesday: 'DSI1 — Algorithms', wednesday: 'DSI3 — Data Structures', thursday: '—', friday: 'DSI2 — Data Structures' },
  ];

  // Assignments
  assignments: Assignment[] = [
    { id: 1, class: 'DSI1', subject: 'Algorithms', title: 'Exercise 1 — Sorting Algorithms', dueDate: '2024-10-15', submissions: 18, totalStudents: 30 },
    { id: 2, class: 'DSI2', subject: 'Data Structures', title: 'Lab 2 — Linked Lists', dueDate: '2024-10-18', submissions: 25, totalStudents: 28 },
    { id: 3, class: 'DSI3', subject: 'Algorithms', title: 'Project — Graph Traversal', dueDate: '2024-10-25', submissions: 10, totalStudents: 25 },
  ];

  showAssignmentModal: boolean = false;
  showGradeModal: boolean = false;
  selectedAssignment: Assignment | null = null;

  newAssignment = {
    class: '',
    subject: '',
    title: '',
    dueDate: ''
  };

  gradeList: Submission[] = [];

  // Chat
  students: string[] = ['Ahmed Ben Ali', 'Sarra Mansour', 'Yassine Trabelsi'];
  selectedStudent: string = '';
  newMessage: string = '';

  chats: { [key: string]: ChatMessage[] } = {
    'Ahmed Ben Ali': [
      { sender: 'Ahmed Ben Ali', text: 'Hello Dr. Bouaziz, I had a question about recursion.', time: '09:20' },
      { sender: 'me', text: 'Of course! What is your question?', time: '09:25' },
    ],
    'Sarra Mansour': [],
    'Yassine Trabelsi': [],
  };

  constructor(private router: Router, private authService: AuthService) {}

  setSection(section: string) {
    this.activeSection = section;
  }

  getSectionTitle(): string {
    switch (this.activeSection) {
      case 'timetable': return 'My Timetable';
      case 'classroom': return 'Virtual Classroom';
      case 'chat': return 'Chat with Students';
      case 'profile': return 'My Profile';
      default: return 'Dashboard';
    }
  }

  // Assignments
  getPendingSubmissions(): number {
    return this.assignments.reduce((total, a) => total + (a.totalStudents - a.submissions), 0);
  }

  openAssignmentModal() {
    this.showAssignmentModal = true;
  }

  closeAssignmentModal() {
    this.showAssignmentModal = false;
    this.newAssignment = { class: '', subject: '', title: '', dueDate: '' };
  }

  postAssignment() {
    if (!this.newAssignment.class || !this.newAssignment.subject || !this.newAssignment.title || !this.newAssignment.dueDate) {
      return;
    }
    this.assignments = [...this.assignments, {
      id: this.assignments.length + 1,
      class: this.newAssignment.class,
      subject: this.newAssignment.subject,
      title: this.newAssignment.title,
      dueDate: this.newAssignment.dueDate,
      submissions: 0,
      totalStudents: 30
    }];
    this.closeAssignmentModal();
  }

  openGradeModal(assignment: Assignment) {
    this.selectedAssignment = assignment;
    this.gradeList = [
      { student: 'Ahmed Ben Ali', submitted: true, grade: null },
      { student: 'Sarra Mansour', submitted: true, grade: null },
      { student: 'Yassine Trabelsi', submitted: false, grade: null },
      { student: 'Meriem Khalil', submitted: true, grade: null },
    ];
    this.showGradeModal = true;
  }

  closeGradeModal() {
    this.showGradeModal = false;
    this.selectedAssignment = null;
    this.gradeList = [];
  }

  saveGrades() {
    console.log('Grades saved:', this.gradeList);
    this.closeGradeModal();
  }

  // Chat
  getChatMessages(): ChatMessage[] {
    if (!this.selectedStudent) return [];
    return this.chats[this.selectedStudent] || [];
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedStudent) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (!this.chats[this.selectedStudent]) {
      this.chats[this.selectedStudent] = [];
    }
    this.chats[this.selectedStudent] = [...this.chats[this.selectedStudent], {
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
