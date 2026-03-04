import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { InternshipService } from '../services/internship.service';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';

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
  id: string;
  studentId: string;
  studentName: string;
  company: string;
  duration: string;
  startDate: string;
  status: string;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {

  activeSection: string = 'timetable';
  loggedInName: string = '';
  currentUserId: string = '';
  currentUserName: string = '';

  profile = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    class: '',
    department: ''
  };

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
  internshipRequests: InternshipRequest[] = [];
  showInternshipModal: boolean = false;
  newInternship = {
    company: '',
    duration: '',
    startDate: ''
  };

  // Chat
  teachers: any[] = [];
  selectedTeacher: string = '';
  newMessage: string = '';
  currentMessages: any[] = [];

  constructor(
    private router: Router,
    private internshipService: InternshipService,
    private authService: AuthService,
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadInternships();
    this.loadTeachers();
  }

  loadCurrentUser() {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.loggedInName = payload.firstName + ' ' + payload.lastName;
      this.currentUserId = payload.sub;
      this.currentUserName = payload.firstName + ' ' + payload.lastName;
      this.profile = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.sub,
        role: payload.role,
        class: payload.class || 'Not assigned yet',
        department: payload.department || 'Not assigned yet'
      };
      this.chatService.connect(this.currentUserId);
      this.chatService.getMessages().subscribe((message) => {
        const key = message.senderId === this.currentUserId ? message.receiverId : message.senderId;
        if (this.selectedTeacher === key || message.senderId === this.currentUserId) {
          this.currentMessages = [...this.currentMessages, message];
        }
      });
    }
  }

  loadTeachers() {
    this.userService.getTeachers().subscribe({
      next: (data) => {
        this.teachers = data;
      },
      error: (err) => console.error('Error loading teachers:', err)
    });
  }

  loadInternships() {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const studentEmail = payload.sub;
      this.internshipService.getInternshipsByStudent(studentEmail).subscribe({
        next: (data) => {
          this.internshipRequests = data;
        },
        error: (err) => console.error('Error loading internships:', err)
      });
    }
  }

  setSection(section: string) {
    this.activeSection = section;
    if (section === 'chat' && this.selectedTeacher) {
      this.loadConversation();
    }
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
    const token = this.authService.getToken();
    const payload = JSON.parse(atob(token!.split('.')[1]));
    const internship = {
      studentId: payload.sub,
      studentName: payload.firstName + ' ' + payload.lastName,
      company: this.newInternship.company,
      duration: this.newInternship.duration,
      startDate: this.newInternship.startDate
    };
    this.internshipService.submitInternship(internship).subscribe({
      next: () => {
        this.loadInternships();
        this.closeInternshipModal();
      },
      error: (err) => console.error('Error submitting internship:', err)
    });
  }

  getApprovedInternships(): number {
    return this.internshipRequests.filter(r => r.status === 'APPROVED').length;
  }

  // Chat
  getChatMessages(): any[] {
    return this.currentMessages;
  }

  onTeacherSelected() {
    this.loadConversation();
  }

  loadConversation() {
    if (!this.selectedTeacher) return;
    this.chatService.getConversation(this.currentUserId, this.selectedTeacher).subscribe({
      next: (messages) => {
        this.currentMessages = messages;
      },
      error: (err) => console.error('Error loading conversation:', err)
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedTeacher) return;
    const message = {
      senderId: this.currentUserId,
      senderName: this.currentUserName,
      receiverId: this.selectedTeacher,
      receiverName: this.selectedTeacher,
      content: this.newMessage.trim()
    };
    this.chatService.sendMessage(message);
    this.newMessage = '';
  }

  logout() {
    this.authService.logout();
  }
}