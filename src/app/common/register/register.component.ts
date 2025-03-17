import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() login = new EventEmitter<void>();
  
  registerForm!: FormGroup;
  isVisible = false;
  submitted = false;
  passwordStrength = 0;
  strengthText = 'Create a strong password';
  strengthColor = '#5f6368';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      termsAgree: [false, Validators.requiredTrue]
    }, {
      validators: this.mustMatch('password', 'confirmPassword')
    });
  }

  get f() { 
    return this.registerForm.controls; 
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    console.log('Form submitted:', this.registerForm.value);
    
    alert('Registration successful!');
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

  goToLogin(event: Event): void {
    event.preventDefault();
    this.isVisible = false;
    this.login.emit();
  }

  signInWithGoogle(): void {
    console.log('Sign in with Google clicked');
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }

  checkPasswordStrength(): void {
    const password = this.f['password'].value;
    let strength = 0;
    
    if (!password) {
      this.strengthText = 'Create a strong password';
      this.strengthColor = '#5f6368';
      this.passwordStrength = 0;
      return;
    }
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    this.passwordStrength = strength;
    
    if (strength <= 2) {
      this.strengthText = 'Weak';
      this.strengthColor = '#ea4335';
    } else if (strength === 3) {
      this.strengthText = 'Medium';
      this.strengthColor = '#fbbc05';
    } else {
      this.strengthText = 'Strong';
      this.strengthColor = '#34a853';
    }
  }
  
  strengthClass(index: number): string {
    if (index >= this.passwordStrength) return '';
    if (this.passwordStrength <= 2) return 'weak';
    if (this.passwordStrength === 3) return 'medium';
    return 'strong';
  }
}