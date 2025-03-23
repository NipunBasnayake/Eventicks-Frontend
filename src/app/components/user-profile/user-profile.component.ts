import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userFullName: string = 'John Doe';
  userRole: string = 'USER';
  isEmailVerified: boolean = false;
  activeTab: string = 'personal';
  
  personalInfo = {
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    phone: '',
    location: '',
    bio: ''
  };

  @ViewChild('fileInput') fileInput!: ElementRef;
  isEditingPicture: boolean = false;
  newProfilePicture: File | null = null;

  tickets: any[] = [];
  ticketsFilter: string = 'all';
  
  bids: any[] = [];
  bidsFilter: string = 'all';
  newBidAmount: number = 0;

  showEmailVerificationModal: boolean = false;
  showUpdateBidModal: boolean = false;
  selectedBid: any = null;

  verificationCode: string = '';

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordStrength: string = 'Weak';

  formErrors = {
    fullName: false,
    email: false,
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
    verificationCode: false,
    newBidAmount: false
  };

  twoFactorEnabled: boolean = false;

  loginActivity: any[] = [
    {
      date: 'Mar 22, 2025, 9:45 AM',
      device: 'Chrome on Windows',
      ip: '192.168.1.1',
      location: 'Colombo, Sri Lanka'
    },
    {
      date: 'Mar 20, 2025, 3:22 PM',
      device: 'Safari on macOS',
      ip: '192.168.1.5',
      location: 'Colombo, Sri Lanka'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {

  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  savePersonalInfo(): void {
    this.formErrors.fullName = !this.personalInfo.fullName;
    this.formErrors.email = !this.validateEmail(this.personalInfo.email);
    
    if (this.formErrors.fullName || this.formErrors.email) {
      return;
    }
    
    this.userFullName = this.personalInfo.fullName;
    alert('Personal information saved successfully!');
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  startEditingPicture(): void {
    this.isEditingPicture = true;
  }

  cancelEditPicture(): void {
    this.isEditingPicture = false;
    this.newProfilePicture = null;
  }

  openFileSelector(): void {
    this.fileInput.nativeElement.click();
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.newProfilePicture = input.files[0];
    }
  }

  saveProfilePicture(): void {
    if (this.newProfilePicture) {
      this.isEditingPicture = false;
      this.newProfilePicture = null;
    }
  }

  requestOrganizerRole(): void {
    alert('Organizer role request submitted. We will review your request shortly.');
  }

  sendVerificationEmail(): void {
    this.showEmailVerificationModal = true;
  }

  verifyEmail(code: string): void {
    this.formErrors.verificationCode = !code || code.length !== 6;
    
    if (this.formErrors.verificationCode) {
      return;
    }
    
    this.isEmailVerified = true;
    this.showEmailVerificationModal = false;
    alert('Email verified successfully!');
  }

  resendVerificationCode(): void {
    alert('A new verification code has been sent to your email.');
  }

  updatePassword(currentPassword: string, newPassword: string, confirmPassword: string): void {
    this.formErrors.currentPassword = !currentPassword;
    this.formErrors.newPassword = !newPassword || newPassword.length < 8;
    this.formErrors.confirmPassword = newPassword !== confirmPassword;
    
    if (this.formErrors.currentPassword || this.formErrors.newPassword || this.formErrors.confirmPassword) {
      return;
    }

    alert('Password updated successfully!');

    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  checkPasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = 'Weak';
      return;
    }
    
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score < 3) this.passwordStrength = 'Weak';
    else if (score < 5) this.passwordStrength = 'Medium';
    else this.passwordStrength = 'Strong';
    
    this.updateStrengthBars(score);
  }

  updateStrengthBars(score: number): void {
  }

  toggleTwoFactor(): void {
    this.twoFactorEnabled = !this.twoFactorEnabled;
    alert(`Two-factor authentication ${this.twoFactorEnabled ? 'enabled' : 'disabled'}.`);
  }

  filterTickets(filter: string): void {
    this.ticketsFilter = filter;
  }

  browseEvents(): void {
    this.router.navigate(['/events']);
  }

  filterBids(filter: string): void {
    this.bidsFilter = filter;
  }

  browseAuctions(): void {
    this.router.navigate(['/auctions']);
  }

  openUpdateBidModal(bid: any): void {
    this.selectedBid = bid;
    this.newBidAmount = bid.highestBid + 100;
    this.showUpdateBidModal = true;
  }

  updateBid(newAmount: number): void {
    this.formErrors.newBidAmount = !newAmount || (this.selectedBid && newAmount <= this.selectedBid.highestBid);
    
    if (this.formErrors.newBidAmount) {
      return;
    }
    
    if (this.selectedBid) {
      this.selectedBid.amount = newAmount;
      this.showUpdateBidModal = false;
      alert('Bid updated successfully!');
    }
  }

  closeEmailVerificationModal(): void {
    this.showEmailVerificationModal = false;
    this.verificationCode = '';
  }

  closeUpdateBidModal(): void {
    this.showUpdateBidModal = false;
    this.selectedBid = null;
    this.newBidAmount = 0;
  }
}