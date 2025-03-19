import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from "./common/register/register.component";
import { LoginComponent } from "./common/login/login.component";
import { NavBarComponent } from "./common/nav-bar/nav-bar.component";
import { ForgotPasswordComponent } from "./common/forgot-password/forgot-password.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Eventicks-Angular';
}