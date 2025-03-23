import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Output() login = new EventEmitter<void>();
  @Input() email: string = '';
  
  emailForm!: FormGroup;
  otpForm!: FormGroup;
  passwordForm!: FormGroup;
  
  currentStage: number = 1;
  isVisible: boolean = false;
  emailSubmitted: boolean = false;
  otpSubmitted: boolean = false;
  passwordSubmitted: boolean = false;
  
  isOtpSending: boolean = false;
  countdown: number = 0;
  countdownSubscription?: Subscription;
  
  passwordStrength: number = 0;
  strengthText: string = 'Create a strong password';
  strengthColor: string = '#5f6368';

  userEmail: string = '';
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initForms();
  }
  
  ngOnDestroy(): void {
    this.stopCountdown();
  }

  initForms(): void {
    this.emailForm = this.fb.group({
      email: [this.email, [Validators.required, Validators.email]]
    });
    
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
    
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.mustMatch('password', 'confirmPassword')
    });
  }
  
  get e() { return this.emailForm.controls; }
  get o() { return this.otpForm.controls; }
  get p() { return this.passwordForm.controls; }

  openModal(): void {
    this.isVisible = true;
    if (this.email) {
      this.emailForm.patchValue({ email: this.email });
    }
  }

  closeModal(): void {
    this.isVisible = false;
    this.stopCountdown();
    setTimeout(() => {
      this.close.emit();
    }, 300);
  }

  closeOverlayOnOutsideClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).className.includes('popup-overlay')) {
      this.closeModal();
    }
  }

  backToLogin(): void {
    this.isVisible = false;
    this.stopCountdown();
    setTimeout(() => {
      this.login.emit();
    }, 300);
  }
  
  backToEmail(): void {
    this.currentStage = 1;
    this.stopCountdown();
    this.otpSubmitted = false;
  }
  
  backToOTP(): void {
    this.currentStage = 2;
    this.passwordSubmitted = false;
    this.startCountdown();
  }

  sendOTP(): void {
    this.emailSubmitted = true;
    
    if (this.emailForm.invalid) {
      return;
    }
    
    const email = this.emailForm.value.email;
    this.userEmail = email;
    this.isOtpSending = true;
    
    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        console.log('OTP sent to', email);
        this.isOtpSending = false;
        this.currentStage = 2;
        this.emailSubmitted = false;
        this.startCountdown();
      },
      error: (error) => {
        console.error('Error sending OTP:', error);
        this.isOtpSending = false;
      }
    });
  }
  
  verifyOTP(): void {
    this.otpSubmitted = true;
    
    if (this.otpForm.invalid) {
      return;
    }
    
    const otp = this.otpForm.value.otp;
    
    this.authService.verifyOtp(this.userEmail, otp).subscribe({
      next: (response) => {
        console.log('OTP verified:', otp);
        this.currentStage = 3;
        this.otpSubmitted = false;
        this.stopCountdown();
      },
      error: (error) => {
        console.error('Error verifying OTP:', error);
      }
    });
  }
  
  resetPassword(): void {
    this.passwordSubmitted = true;
    
    if (this.passwordForm.invalid) {
      return;
    }
    
    const newPassword = this.passwordForm.value.password;
    
    this.authService.resetPassword(this.userEmail, newPassword).subscribe({
      next: (response) => {
        console.log('Password reset successful');
        alert('Password has been reset successfully!');
        this.backToLogin();
      },
      error: (error) => {
        console.error('Error resetting password:', error);
      }
    });
  }
  
  resendOTP(event: Event): void {
    event.preventDefault();
    this.isOtpSending = true;
    
    this.authService.forgotPassword(this.userEmail).subscribe({
      next: (response) => {
        console.log('OTP resent to', this.userEmail);
        this.isOtpSending = false;
        this.startCountdown();
      },
      error: (error) => {
        console.error('Error resending OTP:', error);
        this.isOtpSending = false;
      }
    });
  }
  
  startCountdown(): void {
    this.stopCountdown();
    this.countdown = 60;
    
    this.countdownSubscription = interval(1000)
      .pipe(take(61))
      .subscribe(() => {
        this.countdown--;
        if (this.countdown === 0) {
          this.stopCountdown();
        }
      });
  }
  
  stopCountdown(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
  
  checkPasswordStrength(): void {
    const password = this.p['password'].value;
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
}