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
    
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log(response.data.token);
        localStorage.setItem('token', response.data.token);
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
    this.isVisible = false; // Hide the modal visually first
    // Emit the register event - don't close the component yet
    // Let the parent handle the transition
    this.register.emit();
  }
  
  goToForgotPassword(event: Event): void {
    event.preventDefault();
    this.isVisible = false;
    // Pass the email value if it exists
    const email = this.f['email'].value || '';
    this.forgotPassword.emit(email);
  }
  
  signInWithGoogle(): void {
    // this.isGoogleLoading = true;
    // this.authService.signInWithGoogle()
    //   .then(user => {
    //     console.log('Google user:', user);
    //     // Process the Google login with your backend
    //     this.authService.processGoogleLogin(user).subscribe(
    //       response => {
    //         console.log('Login successful:', response);
    //         this.isGoogleLoading = false;
    //         this.closeModal();
    //       },
    //       error => {
    //         console.error('Login error:', error);
    //         this.isGoogleLoading = false;
    //         // Handle error (show message, etc.)
    //       }
    //     );
    //   })
    //   .catch(error => {
    //     console.error('Google sign-in error:', error);
    //     this.isGoogleLoading = false;
    //     // Handle error (show message, etc.)
    //   });
  }
}