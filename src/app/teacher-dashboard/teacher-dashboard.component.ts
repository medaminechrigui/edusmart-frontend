import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { AssignmentService } from '../services/assignment.service';

interface TimetableSlot {
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
}

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css'
})
export class TeacherDashboardComponent implements OnInit {

  activeSection: string = 'timetable';
  loggedInName: string = '';
  currentUserId: string = '';
  currentUserName: string = '';
  teacherId: string = '';

  profile = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    subjects: ''
  };

  // Timetable
  timetable: TimetableSlot[] = [
    { time: '08:00 - 10:00', monday: 'DSI1 — Algorithms', tuesday: '—', wednesday: 'DSI2 — Algorithms', thursday: '—', friday: 'DSI3 — Algorithms' },
    { time: '10:00 - 12:00', monday: '—', tuesday: 'DSI2 — Data Structures', wednesday: '—', thursday: 'DSI1 — Data Structures', friday: '—' },
    { time: '14:00 - 16:00', monday: 'DSI3 — Data Structures', tuesday: '—', wednesday: '—', thursday: 'DSI2 — Algorithms', friday: '—' },
    { time: '16:00 - 18:00', monday: '—', tuesday: 'DSI1 — Algorithms', wednesday: 'DSI3 — Data Structures', thursday: '—', friday: 'DSI2 — Data Structures' },
  ];

  // Virtual Classroom
  assignments: any[] = [];
  showAddAssignmentModal: boolean = false;
  showSubmissionsModal: boolean = false;
  selectedAssignment: any = null;
  gradeInputs: { [studentId: string]: number } = {};

  newAssignment = {
    title: '',
    subject: '',
    className: '',
    dueDate: '',
    description: '',
    fileName: '',
    fileData: '',
    fileType: ''
  };

  // Chat
  students: any[] = [];
  selectedStudent: string = '';
  newMessage: string = '';
  currentMessages: any[] = [];

  constructor(
    private router: Router,
    private chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
    private assignmentService: AssignmentService
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadStudents();
  }

  loadCurrentUser() {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.loggedInName = payload.firstName + ' ' + payload.lastName;
      this.currentUserId = payload.sub;
      this.currentUserName = payload.firstName + ' ' + payload.lastName;
      this.teacherId = payload.sub;
      this.profile = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.sub,
        role: payload.role,
        department: payload.department || 'Not assigned yet',
        subjects: payload.subjects || 'Not assigned yet'
      };
      this.chatService.connect(this.currentUserId);
      this.chatService.getMessages().subscribe((message) => {
        const key = message.senderId === this.currentUserId ? message.receiverId : message.senderId;
        if (this.selectedStudent === key || message.senderId === this.currentUserId) {
          this.currentMessages = [...this.currentMessages, message];
        }
      });
      this.loadAssignments();
    }
  }

  loadStudents() {
    this.userService.getStudents().subscribe({
      next: (data) => { this.students = data; },
      error: (err) => console.error('Error loading students:', err)
    });
  }

  setSection(section: string) {
    this.activeSection = section;
    if (section === 'chat' && this.selectedStudent) {
      this.loadConversation();
    }
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

  // ─── VIRTUAL CLASSROOM ───

  loadAssignments() {
    this.assignmentService.getAssignmentsByTeacher(this.teacherId).subscribe({
      next: (data) => { this.assignments = data; },
      error: (err) => console.error('Error loading assignments:', err)
    });
  }

  openAddAssignmentModal() {
    this.newAssignment = { title: '', subject: '', className: '', dueDate: '', description: '', fileName: '', fileData: '', fileType: '' };
    this.showAddAssignmentModal = true;
  }

  closeAddAssignmentModal() {
    this.showAddAssignmentModal = false;
  }

  onAssignmentFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      this.newAssignment.fileData = base64;
      this.newAssignment.fileName = file.name;
      this.newAssignment.fileType = file.name.endsWith('.pdf') ? 'pdf' : 'docx';
    };
    reader.readAsDataURL(file);
  }

  postAssignment() {
    if (!this.newAssignment.title || !this.newAssignment.className) return;
    const payload = {
      ...this.newAssignment,
      teacherId: this.teacherId,
      teacherName: this.loggedInName
    };
    this.assignmentService.createAssignment(payload).subscribe({
      next: () => {
        this.loadAssignments();
        this.closeAddAssignmentModal();
      },
      error: (err) => console.error('Error posting assignment:', err)
    });
  }

  deleteAssignment(id: string) {
    if (!confirm('Delete this assignment?')) return;
    this.assignmentService.deleteAssignment(id).subscribe({
      next: () => { this.loadAssignments(); },
      error: (err) => console.error('Error deleting assignment:', err)
    });
  }

  viewSubmissions(assignment: any) {
    this.selectedAssignment = assignment;
    this.gradeInputs = {};
    this.showSubmissionsModal = true;
  }

  closeSubmissionsModal() {
    this.showSubmissionsModal = false;
    this.selectedAssignment = null;
    this.gradeInputs = {};
  }

  downloadFile(fileData: string, fileName: string, fileType: string) {
    const byteArray = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));
    const blob = new Blob([byteArray], {
      type: fileType === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  gradeSubmission(assignmentId: string, studentId: string) {
    const grade = this.gradeInputs[studentId];
    if (grade === undefined || grade === null) return;
    this.assignmentService.gradeSubmission(assignmentId, studentId, grade).subscribe({
      next: () => {
        this.loadAssignments();
        this.closeSubmissionsModal();
      },
      error: (err) => console.error('Error grading submission:', err)
    });
  }

  getSubmissionStatus(assignment: any): string {
    return assignment.submissions?.length + ' / ' + '?' + ' submitted';
  }

  // ─── CHAT ───

  getChatMessages(): any[] {
    return this.currentMessages;
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedStudent) return;
    const message = {
      senderId: this.currentUserId,
      senderName: this.currentUserName,
      receiverId: this.selectedStudent,
      receiverName: this.selectedStudent,
      content: this.newMessage.trim()
    };
    this.chatService.sendMessage(message);
    this.newMessage = '';
  }

  onStudentSelected() {
    this.loadConversation();
  }

  loadConversation() {
    if (!this.selectedStudent) return;
    this.chatService.getConversation(this.currentUserId, this.selectedStudent).subscribe({
      next: (messages) => { this.currentMessages = messages; },
      error: (err) => console.error('Error loading conversation:', err)
    });
  }

  logout() {
    this.authService.logout();
  }
  getTotalSubmissions(): number {
  return this.assignments.reduce((t, a) => t + (a.submissions?.length || 0), 0);
}
}
