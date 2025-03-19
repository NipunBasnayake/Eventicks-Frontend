import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();
  @Output() forgotPassword = new EventEmitter<string>();
  
  loginForm!: FormGroup;
  isVisible = false;
  submitted = false;
  isGoogleLoading = false;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }
  
  get f() {
    return this.loginForm.controls;
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.loginForm.invalid) {
      return;
    }
    
    const { email, password, rememberMe } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.authService.storeUserData(response.data || response, rememberMe);
        
        alert('Login successful!');
        
        this.closeModal();
      },
      error: (err) => {
        console.error('Login error:', err);
        alert('Login failed. Please try again.');
      }
    });
  }
  
  openModal(): void {
    this.isVisible = true;
    if (this.loginForm) {
      this.loginForm.reset({
        email: '',
        password: '',
        rememberMe: false
      });
      this.submitted = false;
    }
  }
  
  closeModal(): void {
    this.isVisible = false;
    setTimeout(() => {
      this.close.emit();
    }, 300);
  }
  
  closeOverlayOnOutsideClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).className.includes('popup-overlay')) {
      this.closeModal();
    }
  }
  
  goToRegister(event: Event): void {
    event.preventDefault();
    this.isVisible = false;
    this.register.emit();
  }
  
  goToForgotPassword(event: Event): void {
    event.preventDefault();
    this.isVisible = false;
    const email = this.f['email'].value || '';
    this.forgotPassword.emit(email);
  }
  
  // Google Sign-in method commented out as requested
  signInWithGoogle(): void {
    /*
    this.isGoogleLoading = true;
    this.authService.signInWithGoogle()
      .then(googleUser => {
        this.authService.processGoogleLogin(googleUser).subscribe({
          next: (response) => {
            // Store Google login in localStorage by default (or you can customize)
            this.authService.storeUserData(response.data || response, true);
            alert('Google login successful!');
            this.closeModal();
          },
          error: (err) => {
            console.error('Google login error:', err);
            alert('Google login failed. Please try again.');
          }
        });
      })
      .catch(error => {
        console.error('Google sign-in error:', error);
        alert('Google login failed. Please try again.');
      })
      .finally(() => {
        this.isGoogleLoading = false;
      });
    */
  }
}