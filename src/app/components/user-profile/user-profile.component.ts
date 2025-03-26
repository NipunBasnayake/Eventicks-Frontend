import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    userId: number;
    name: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    lastLoginAt: string;
    registeredAt: string;
    token: string | null;
  };
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userFullName: string = '';
  userRole: string = 'USER';
  userEmail: string = '';
  userId: number = 0;
  isEmailVerified: boolean = false;
  registeredDate: string = '';
  lastLoginDate: string = '';
  activeTab: string = 'tickets';
  
  personalInfo = {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  };

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

  constructor(
    private router: Router, 
    private authService: AuthService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.userEmail = this.authService.getUserEmail() || '';
    
    if (this.userEmail) {
      this.loadUserData();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadUserData(): void {
    this.authService.getUserProfile(this.userEmail).subscribe({
      next: (response: UserProfileResponse) => {
        if (response.success && response.data) {
          const userData = response.data;
          
          this.userId = userData.userId;
          this.userFullName = userData.name;
          this.userRole = userData.role;
          this.userEmail = userData.email;
          this.isEmailVerified = userData.isEmailVerified;
          
          this.lastLoginDate = this.formatDate(userData.lastLoginAt);
          this.registeredDate = this.formatDate(userData.registeredAt);
          
          this.personalInfo = {
            fullName: userData.name,
            email: userData.email,
            phone: '',
            location: '',
            bio: ''
          };
        }
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        this.router.navigate(['/login']);
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    
    if (tab === 'tickets') {
      this.loadTickets(this.ticketsFilter);
    } else if (tab === 'bids') {
      this.loadBids(this.bidsFilter);
    }
  }

  goToOrganizerDashboard(): void {
    this.router.navigate(['/organizer/dashboard']);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  requestOrganizerRole(): void {
    this.profileService.requestOrganizerRole(this.userId).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Organizer role request submitted. We will review your request shortly.');
        } else {
          alert('Failed to submit request: ' + response.message);
        }
      },
      error: (err) => {
        console.error('Error requesting organizer role:', err);
        alert('Failed to submit request. Please try again.');
      }
    });
  }

  sendVerificationEmail(): void {
    this.profileService.sendVerificationEmail(this.userEmail).subscribe({
      next: (response) => {
        if (response.success) {
          this.showEmailVerificationModal = true;
        } else {
          alert('Failed to send verification email: ' + response.message);
        }
      },
      error: (err) => {
        console.error('Error sending verification email:', err);
        alert('Failed to send verification email. Please try again.');
      }
    });
  }

  verifyEmail(code: string): void {
    this.formErrors.verificationCode = !code || code.length !== 6;
    
    if (this.formErrors.verificationCode) {
      return;
    }
    
    this.profileService.verifyEmail(this.userEmail, code).subscribe({
      next: (response) => {
        if (response.success) {
          this.isEmailVerified = true;
          this.showEmailVerificationModal = false;
          alert('Email verified successfully!');
        } else {
          alert('Failed to verify email: ' + response.message);
        }
      },
      error: (err) => {
        console.error('Error verifying email:', err);
        alert('Failed to verify email. Please check the code and try again.');
      }
    });
  }

  resendVerificationCode(): void {
    this.profileService.sendVerificationEmail(this.userEmail).subscribe({
      next: (response) => {
        if (response.success) {
          alert('A new verification code has been sent to your email.');
        } else {
          alert('Failed to send verification code: ' + response.message);
        }
      },
      error: (err) => {
        console.error('Error sending verification code:', err);
        alert('Failed to send verification code. Please try again.');
      }
    });
  }

  updatePassword(currentPassword: string, newPassword: string, confirmPassword: string): void {
    this.formErrors.currentPassword = !currentPassword;
    this.formErrors.newPassword = !newPassword || newPassword.length < 8;
    this.formErrors.confirmPassword = newPassword !== confirmPassword;
    
    if (this.formErrors.currentPassword || this.formErrors.newPassword || this.formErrors.confirmPassword) {
      return;
    }

    this.profileService.updatePassword(this.userId, currentPassword, newPassword).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Password updated successfully!');
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        } else {
          alert('Failed to update password: ' + response.message);
        }
      },
      error: (err) => {
        console.error('Error updating password:', err);
        alert('Failed to update password. Please check your current password and try again.');
      }
    });
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
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (strengthText) {
      strengthText.textContent = `Password strength: ${this.passwordStrength}`;
    }
    
    strengthBars.forEach((bar, index) => {
      if (index < score) {
        if (score < 3) {
          bar.classList.add('weak');
          bar.classList.remove('medium', 'strong');
        } else if (score < 5) {
          bar.classList.add('medium');
          bar.classList.remove('weak', 'strong');
        } else {
          bar.classList.add('strong');
          bar.classList.remove('weak', 'medium');
        }
      } else {
        bar.classList.remove('weak', 'medium', 'strong');
      }
    });
  }

  toggleTwoFactor(): void {
    this.profileService.toggleTwoFactor(this.userId, !this.twoFactorEnabled).subscribe({
      next: (response) => {
        if (response.success) {
          this.twoFactorEnabled = !this.twoFactorEnabled;
          alert(`Two-factor authentication ${this.twoFactorEnabled ? 'enabled' : 'disabled'}.`);
        } else {
          alert('Failed to toggle two-factor authentication: ' + response.message);
        }
      },
      error: (err) => {
        console.error('Error toggling two-factor:', err);
        alert('Failed to toggle two-factor authentication. Please try again.');
      }
    });
  }

  filterTickets(filter: string): void {
    this.ticketsFilter = filter;
    this.loadTickets(filter);
  }

  loadTickets(filter: string): void {
    this.profileService.getUserTickets(this.userId, filter).subscribe({
      next: (tickets) => {
        this.tickets = tickets || [];
      },
      error: (err) => {
        console.error('Error loading tickets:', err);
        this.tickets = [];
      }
    });
  }

  browseEvents(): void {
    this.router.navigate(['/events']);
  }

  filterBids(filter: string): void {
    this.bidsFilter = filter;
    this.loadBids(filter);
  }

  loadBids(filter: string): void {
    this.profileService.getUserBids(this.userId, filter).subscribe({
      next: (bids) => {
        this.bids = bids || [];
      },
      error: (err) => {
        console.error('Error loading bids:', err);
        this.bids = [];
      }
    });
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
    
    this.profileService.updateBid(this.selectedBid.id, this.userId, newAmount).subscribe({
      next: (response) => {
        if (response.success) {
          if (this.selectedBid) {
            this.selectedBid.amount = newAmount;
            this.showUpdateBidModal = false;
            alert('Bid updated successfully!');
            this.loadBids(this.bidsFilter);
          }
        } else {
          alert('Failed to update bid: ' + response.message);
        }
      },
      error: (err) => {
        console.error('Error updating bid:', err);
        alert('Failed to update bid. Please try again.');
      }
    });
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