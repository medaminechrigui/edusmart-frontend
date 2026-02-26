import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application',
  imports: [],
  templateUrl: './application.component.html',
  styleUrl: './application.component.css'
})
export class ApplicationComponent {

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }
}
