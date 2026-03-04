import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:8080/api/chat';
  private stompClient: Client | null = null;
  private messageSubject = new Subject<any>();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  connect(userId: string) {
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws/websocket',
      onConnect: () => {
        console.log('✅ WebSocket connected');
        this.stompClient?.subscribe(
          `/user/${userId}/queue/messages`,
          (message: IMessage) => {
            const body = JSON.parse(message.body);
            this.messageSubject.next(body);
          }
        );
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      }
    });
    this.stompClient.activate();
  }

  disconnect() {
    this.stompClient?.deactivate();
  }

  sendMessage(message: any) {
    this.stompClient?.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message)
    });
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  getConversation(userId1: string, userId2: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId1}/${userId2}`, {
      headers: this.getHeaders()
    });
  }
}