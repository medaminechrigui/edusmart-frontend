import { Routes } from '@angular/router';
import { HeroComponent } from './hero/hero.component';
import { LoginComponent } from './login/login.component';
import { ApplicationComponent } from './application/application.component';

export const routes: Routes = [
  { path: '', component: HeroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'application', component: ApplicationComponent },
];