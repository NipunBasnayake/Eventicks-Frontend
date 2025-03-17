import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private fb: FormBuilder) { }

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

    console.log('Login form submitted:', this.loginForm.value);
    
    alert('Login successful!');
    this.closeModal();
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
    this.isVisible = false;
    this.register.emit();
  }
  
  goToForgotPassword(event: Event): void {
    event.preventDefault();
    this.isVisible = false;
    const email = this.f['email'].value || '';
    this.forgotPassword.emit(email);
  }

  signInWithGoogle(): void {
    console.log('Sign in with Google clicked');
    // this.authService.signInWithGoogle().then(...)
  }
}