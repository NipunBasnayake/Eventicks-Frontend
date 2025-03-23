import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit, OnDestroy {
  @Input() email: string = '';
  @Output() verificationComplete = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<void>();

  verificationForm!: FormGroup;
  resendCooldown: number = 0;
  private cooldownInterval: any;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.verificationForm = this.fb.group({
      verificationCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  ngOnDestroy(): void {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
  }

  verifyEmail(): void {
    if (this.verificationForm.valid) {
      const code = this.verificationForm.get('verificationCode')?.value;
      
      // TODO: Send verification request to backend
      console.log('Verifying email with code:', code);
      
      // For demo, we'll simulate a successful verification
      setTimeout(() => {
        this.verificationComplete.emit(true);
      }, 1000);
    }
  }

  resendVerificationCode(): void {
    if (this.resendCooldown === 0) {
      // TODO: Send request to resend verification code
      console.log('Resending verification code to:', this.email);
      
      // Start cooldown
      this.resendCooldown = 60;
      this.cooldownInterval = setInterval(() => {
        this.resendCooldown--;
        if (this.resendCooldown === 0) {
          clearInterval(this.cooldownInterval);
        }
      }, 1000);
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  closeOverlayOnOutsideClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('popup-overlay')) {
      this.closeModal.emit();
    }
  }
}