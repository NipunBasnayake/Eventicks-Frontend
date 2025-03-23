import { Component, ViewChild, AfterViewInit, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RegisterComponent, LoginComponent, ForgotPasswordComponent, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements AfterViewInit, OnInit, OnDestroy {
  showRegister = false;
  showLogin = false;
  showForgotPassword = false;
  isLoggedIn = false;
  userName = 'User';
  userEmail = '';
  isScrolled = false;
  isMemorySession = false;
  private authSubscription: Subscription | null = null;

  @ViewChild(RegisterComponent) registerComponent!: RegisterComponent;
  @ViewChild(LoginComponent) loginComponent!: LoginComponent;
  @ViewChild(ForgotPasswordComponent) forgotPasswordComponent!: ForgotPasswordComponent;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.userName = user.name || user.username || user.email || 'User';
        this.userEmail = user.email || '';
        this.isMemorySession = this.authService.isInMemoryOnly();
      } else {
        this.userName = 'User';
        this.userEmail = '';
        this.isMemorySession = false;
      }
    });
    
    this.checkAuthStatus();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.initMobileMenu();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (this.isScrolled) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  checkMemorySession(event: BeforeUnloadEvent) {
    if (this.isLoggedIn && this.isMemorySession) {
      const message = 'Your login session is not saved and will be lost when you close the window.';
      event.returnValue = message;
      return message;
    }
    return null;
  }

  checkAuthStatus(): void {
    const user = this.authService.getCurrentUser();
    
    if (user) {
      this.isLoggedIn = !!user.token;
      this.userName = user.name || user.username || user.email || 'User';
      this.userEmail = user.email || '';
      this.isMemorySession = this.authService.isInMemoryOnly();
    } else {
      this.isLoggedIn = false;
      this.userName = 'User';
      this.userEmail = '';
      this.isMemorySession = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userName = 'User';
    this.userEmail = '';
    this.isMemorySession = false;
    this.closeMenu();
  }

  openRegister(): void {
    this.showRegister = true;
    this.closeMenu();
    setTimeout(() => {
      if (this.registerComponent) {
        this.registerComponent.openModal();
      }
    });
  }

  closeRegister(): void {
    this.showRegister = false;
    this.checkAuthStatus();
  }

  openLogin(): void {
    this.showLogin = true;
    this.closeMenu();
    setTimeout(() => {
      if (this.loginComponent) {
        this.loginComponent.openModal();
      }
    });
  }

  closeLogin(): void {
    this.showLogin = false;
    this.checkAuthStatus();
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
  getSessionType(): string {
    if (!this.isLoggedIn) return '';
    return this.isMemorySession ? 
      'Session (will expire when browser closes)' : 
      'Persistent login';
  }

  private closeMenu(): void {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  }

  private initMobileMenu(): void {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.classList.toggle('menu-open');
      });
    }

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const hamburgerBtn = document.getElementById('hamburger');
      const menu = document.getElementById('navLinks');

      if (
        menu &&
        hamburgerBtn &&
        menu.classList.contains('active') &&
        !menu.contains(target) &&
        !hamburgerBtn.contains(target)
      ) {
        this.closeMenu();
      }
    });

    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const parent = (toggle as HTMLElement).closest('.dropdown-container');

          const allDropdowns = document.querySelectorAll('.dropdown-container.active');
          allDropdowns.forEach(dropdown => {
            if (dropdown !== parent) {
              dropdown.classList.remove('active');
            }
          });

          parent?.classList.toggle('active');
        }
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.closeMenu();

        const activeDropdowns = document.querySelectorAll('.dropdown-container.active');
        activeDropdowns.forEach(dropdown => {
          dropdown.classList.remove('active');
        });
      }
    });
  }
}