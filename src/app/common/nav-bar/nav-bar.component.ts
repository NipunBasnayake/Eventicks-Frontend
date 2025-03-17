import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RegisterComponent, LoginComponent, ForgotPasswordComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements AfterViewInit {
  showRegister = false;
  showLogin = false;
  showForgotPassword = false;
  
  userEmail = '';
  
  @ViewChild(RegisterComponent) registerComponent!: RegisterComponent;
  @ViewChild(LoginComponent) loginComponent!: LoginComponent;
  @ViewChild(ForgotPasswordComponent) forgotPasswordComponent!: ForgotPasswordComponent;
  
  ngAfterViewInit(): void {
    this.initMobileMenu();
  }
  
  openRegister(): void {
    this.showRegister = true;
    setTimeout(() => {
      if (this.registerComponent) {
        this.registerComponent.openModal();
      }
    });
  }
  
  closeRegister(): void {
    this.showRegister = false;
  }
  
  openLogin(): void {
    this.showLogin = true;
    setTimeout(() => {
      if (this.loginComponent) {
        this.loginComponent.openModal();
      }
    });
  }
  
  closeLogin(): void {
    this.showLogin = false;
  }
  
  handleGoToForgotPassword(email: string): void {
    this.userEmail = email;
    this.showLogin = false;
    
    setTimeout(() => {
      this.showForgotPassword = true;
      
      setTimeout(() => {
        if (this.forgotPasswordComponent) {
          this.forgotPasswordComponent.email = this.userEmail;
          this.forgotPasswordComponent.openModal();
        }
      });
    }, 300);
  }
  
  closeForgotPassword(): void {
    this.showForgotPassword = false;
  }
  
  handleGoToLogin(): void {
    if (this.showRegister) {
      this.showRegister = false;
    } else if (this.showForgotPassword) {
      this.showForgotPassword = false;
    }
    
    setTimeout(() => {
      this.showLogin = true;
      
      setTimeout(() => {
        if (this.loginComponent) {
          this.loginComponent.openModal();
        }
      });
    }, 300);
  }
  
  handleBackToLogin(): void {
    this.handleGoToLogin();
  }
  
  handleGoToRegister(): void {
    this.showLogin = false;
    
    setTimeout(() => {
      this.showRegister = true;
      
      setTimeout(() => {
        if (this.registerComponent) {
          this.registerComponent.openModal();
        }
      });
    }, 300);
  }
  
  private initMobileMenu(): void {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
      });
    }
    
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = (toggle as HTMLElement).closest('.dropdown-container');
        parent?.classList.toggle('active');
      });
    });
  }
}