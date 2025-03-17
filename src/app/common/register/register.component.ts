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
  isVisible = true;
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

  // Convenience getter for easy access to form fields
  get f() { 
    return this.registerForm.controls; 
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    // Process form data here
    console.log('Form submitted:', this.registerForm.value);
    
    // You would typically call a service method here to handle the registration
    // this.authService.register(this.registerForm.value).subscribe(...)
    
    // For demo purposes, show success and close
    alert('Registration successful!');
    this.closeModal();
  }

  closeModal(): void {
    this.isVisible = false;
    setTimeout(() => {
      this.close.emit();
    }, 300); // Match the CSS transition duration
  }

  goToLogin(event: Event): void {
    event.preventDefault();
    this.closeModal();
    setTimeout(() => {
      this.login.emit();
    }, 300);
  }

  signInWithGoogle(): void {
    // Implement Google Sign In logic here
    console.log('Sign in with Google clicked');
    // this.authService.signInWithGoogle().then(...)
  }

  // Custom validator to check if password and confirm password match
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // Return if another validator has already found an error
        return null;
      }

      // Set error if controls don't match
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }

  // Password strength checker
  checkPasswordStrength(): void {
    const password = this.f['password'].value;
    let strength = 0;
    
    if (!password) {
      this.strengthText = 'Create a strong password';
      this.strengthColor = '#5f6368';
      this.passwordStrength = 0;
      return;
    }
    
    // Length check
    if (password.length >= 8) strength++;
    // Uppercase check
    if (/[A-Z]/.test(password)) strength++;
    // Numbers check
    if (/[0-9]/.test(password)) strength++;
    // Special characters check
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