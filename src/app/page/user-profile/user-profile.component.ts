import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
  import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { Router } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { ReactiveFormsModule } from '@angular/forms';
  
  @Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
  })
  export class UserProfileComponent implements OnInit {
    @ViewChild('profilePictureInput') profilePictureInput!: ElementRef;
  
    // Active tab tracking
    activeTab: string = 'personal';
  
    // User data
    user: any = {
      id: 1,
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      role: 'USER', // USER, ORGANIZER, ADMIN
      profilePicture: null,
      isUserVerified: false,
      phone: '',
      location: '',
      bio: '',
      twoFactorEnabled: false
    };
  
    // Forms
    personalInfoForm!: FormGroup;
    passwordForm!: FormGroup;
    verificationForm!: FormGroup;
    updateBidForm!: FormGroup;
    eventForm!: FormGroup;
    rejectReasonForm!: FormGroup;
  
    // Password strength
    passwordStrength: number = 0;
    strengthText: string = 'Weak';
    strengthColor: string = '#ea4335';
  
    // Filter states
    ticketFilter: string = 'all';
    bidFilter: string = 'all';
    eventFilter: string = 'all';
    requestFilter: string = 'all';
    ticketReviewFilter: string = 'all';
  
    // Modal visibility flags
    showEmailVerificationModal: boolean = false;
    showUpdateBidModal: boolean = false;
    showCreateEventModal: boolean = false;
    showRejectReasonModal: boolean = false;
  
    // User data collections
    userTickets: any[] = [];
    userBids: any[] = [];
    organizerEvents: any[] = [];
    organizerRequests: any[] = [];
    ticketReviews: any[] = [];
    loginActivities: any[] = [];
    
    // Filtered collections
    filteredTickets: any[] = [];
    filteredBids: any[] = [];
    filteredEvents: any[] = [];
    filteredRequests: any[] = [];
    filteredTicketReviews: any[] = [];
  
    // Additional state
    organizerRequestPending: boolean = false;
    resendCooldown: number = 0;
    selectedBid: any = null;
    auctionTimeRemaining: string = '';
    eventImagePreview: string | null = null;
    rejectionTicketId: number | null = null;
  
    // Organizer dashboard stats
    organizerStats: any = {
      totalEvents: 0,
      ticketsSold: 0,
      totalRevenue: 0,
      activeBids: 0
    };
  
    // Recent sales for organizer dashboard
    recentSales: any[] = [];
  
    constructor(
      private fb: FormBuilder,
      private router: Router
    ) { }
  
    ngOnInit(): void {
      this.initializeForms();
      this.loadUserData();
      this.applyFilters();
    }
  
    initializeForms(): void {
      // Personal info form
      this.personalInfoForm = this.fb.group({
        fullName: [this.user.fullName, Validators.required],
        email: [{ value: this.user.email, disabled: this.user.isUserVerified }, [Validators.required, Validators.email]],
        phone: [this.user.phone],
        location: [this.user.location],
        bio: [this.user.bio]
      });
  
      // Password form
      this.passwordForm = this.fb.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      }, {
        validators: this.mustMatch('newPassword', 'confirmPassword')
      });
  
      // Email verification form
      this.verificationForm = this.fb.group({
        verificationCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
      });
  
      // Update bid form
      this.updateBidForm = this.fb.group({
        newBidAmount: [0, Validators.required]
      });
  
      // Event form
      this.eventForm = this.fb.group({
        title: ['', Validators.required],
        date: ['', Validators.required],
        time: ['', Validators.required],
        location: ['', Validators.required],
        type: ['', Validators.required],
        description: ['', Validators.required],
        image: ['', Validators.required],
        tickets: this.fb.array([this.createTicketFormGroup()])
      });
  
      // Reject reason form
      this.rejectReasonForm = this.fb.group({
        reason: ['', Validators.required]
      });
    }
  
    // Form utilities
    get ticketsFormArray(): FormArray {
      return this.eventForm.get('tickets') as FormArray;
    }
  
    createTicketFormGroup(): FormGroup {
      return this.fb.group({
        type: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0)]],
        quantity: [1, [Validators.required, Validators.min(1)]],
        enableBidding: [false],
        minBidPrice: [{ value: 0, disabled: true }],
        description: ['']
      });
    }
  
    mustMatch(controlName: string, matchingControlName: string) {
      return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
  
        if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
          return;
        }
  
        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
        } else {
          matchingControl.setErrors(null);
        }
      };
    }
  
    // Tab management
    setActiveTab(tab: string): void {
      this.activeTab = tab;
      if (tab === 'tickets' || tab === 'bids' || tab === 'events' || tab === 'requests' || tab === 'tickets-review') {
        this.applyFilters();
      }
    }
  
    // Filter methods
    filterTickets(filter: string): void {
      this.ticketFilter = filter;
      this.applyFilters();
    }
  
    filterBids(filter: string): void {
      this.bidFilter = filter;
      this.applyFilters();
    }
  
    filterEvents(filter: string): void {
      this.eventFilter = filter;
      this.applyFilters();
    }
  
    filterRequests(filter: string): void {
      this.requestFilter = filter;
      this.applyFilters();
    }
  
    filterTicketReviews(filter: string): void {
      this.ticketReviewFilter = filter;
      this.applyFilters();
    }
  
    applyFilters(): void {
      // Apply ticket filters
      if (this.ticketFilter === 'all') {
        this.filteredTickets = [...this.userTickets];
      } else if (this.ticketFilter === 'upcoming') {
        this.filteredTickets = this.userTickets.filter(ticket => {
          const eventDate = new Date(ticket.event.date);
          return eventDate >= new Date();
        });
      } else if (this.ticketFilter === 'past') {
        this.filteredTickets = this.userTickets.filter(ticket => {
          const eventDate = new Date(ticket.event.date);
          return eventDate < new Date();
        });
      }
  
      // Apply bid filters
      if (this.bidFilter === 'all') {
        this.filteredBids = [...this.userBids];
      } else {
        this.filteredBids = this.userBids.filter(bid => bid.status === this.bidFilter.toUpperCase());
      }
  
      // Apply event filters
      if (this.eventFilter === 'all') {
        this.filteredEvents = [...this.organizerEvents];
      } else {
        this.filteredEvents = this.organizerEvents.filter(event => event.status === this.eventFilter.toUpperCase());
      }
  
      // Apply request filters
      if (this.requestFilter === 'all') {
        this.filteredRequests = [...this.organizerRequests];
      } else {
        this.filteredRequests = this.organizerRequests.filter(request => request.status === this.requestFilter.toUpperCase());
      }
  
      // Apply ticket review filters
      if (this.ticketReviewFilter === 'all') {
        this.filteredTicketReviews = [...this.ticketReviews];
      } else {
        this.filteredTicketReviews = this.ticketReviews.filter(review => review.status === this.ticketReviewFilter.toUpperCase());
      }
    }
  
    // Profile picture management
    openProfilePictureSelector(): void {
      this.profilePictureInput.nativeElement.click();
    }
  
    onProfilePictureSelected(event: any): void {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        
        // Preview image
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.user.profilePicture = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // TODO: Upload image to server
        console.log('Profile picture selected', file);
      }
    }
  
    // Personal info methods
    updatePersonalInfo(): void {
      if (this.personalInfoForm.valid) {
        const formValues = this.personalInfoForm.getRawValue();
        
        // Update user object
        this.user.fullName = formValues.fullName;
        this.user.phone = formValues.phone;
        this.user.location = formValues.location;
        this.user.bio = formValues.bio;
        
        // If email changed and user wasn't verified, update email
        if (!this.user.isUserVerified && formValues.email !== this.user.email) {
          this.user.email = formValues.email;
        }
        
        // TODO: Save to server
        console.log('Updated personal info', this.user);
        
        // Show success message
        alert('Personal information updated successfully');
      }
    }
  
    // Email verification methods
    sendVerificationEmail(): void {
      this.showEmailVerificationModal = true;
      // TODO: Send verification email
      console.log('Sending verification email to', this.user.email);
    }
  
    closeEmailVerificationModal(): void {
      this.showEmailVerificationModal = false;
      this.verificationForm.reset();
    }
  
    verifyEmail(): void {
      if (this.verificationForm.valid) {
        const code = this.verificationForm.get('verificationCode')?.value;
        
        // TODO: Verify code with server
        console.log('Verifying email with code', code);
        
        // Simulate successful verification
        this.user.isUserVerified = true;
        this.closeEmailVerificationModal();
        
        // Disable email field in personal info form
        this.personalInfoForm.get('email')?.disable();
        
        // Show success message
        alert('Email verified successfully');
      }
    }
  
    resendVerificationCode(): void {
      if (this.resendCooldown === 0) {
        // TODO: Resend verification code
        console.log('Resending verification code to', this.user.email);
        
        // Start cooldown
        this.resendCooldown = 60;
        const cooldownInterval = setInterval(() => {
          this.resendCooldown--;
          if (this.resendCooldown === 0) {
            clearInterval(cooldownInterval);
          }
        }, 1000);
      }
    }
  
    // Password management
    checkPasswordStrength(): void {
      const password = this.passwordForm.get('newPassword')?.value || '';
      
      // Calculate password strength (simple implementation)
      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      
      this.passwordStrength = strength;
      
      // Set strength text and color
      switch (strength) {
        case 0:
        case 1:
          this.strengthText = 'Weak';
          this.strengthColor = '#ea4335';
          break;
        case 2:
          this.strengthText = 'Medium';
          this.strengthColor = '#fbbc05';
          break;
        case 3:
          this.strengthText = 'Strong';
          this.strengthColor = '#34a853';
          break;
        case 4:
          this.strengthText = 'Very Strong';
          this.strengthColor = '#34a853';
          break;
      }
    }
  
    strengthClass(index: number): string {
      if (index < this.passwordStrength) {
        switch (this.passwordStrength) {
          case 1: return 'weak';
          case 2: return 'medium';
          case 3:
          case 4: return 'strong';
          default: return '';
        }
      }
      return '';
    }
  
    changePassword(): void {
      if (this.passwordForm.valid) {
        const formValues = this.passwordForm.value;
        
        // TODO: Send password change request to server
        console.log('Changing password', formValues);
        
        // Reset form
        this.passwordForm.reset();
        
        // Show success message
        alert('Password changed successfully');
      }
    }
  
    // Two-factor authentication
    toggleTwoFactor(): void {
      // TODO: Enable/disable two-factor authentication
      this.user.twoFactorEnabled = !this.user.twoFactorEnabled;
      console.log('Two-factor authentication', this.user.twoFactorEnabled ? 'enabled' : 'disabled');
    }
  
    // Organizer request
    requestOrganizerRole(): void {
      if (!this.organizerRequestPending) {
        // TODO: Send organizer role request
        console.log('Requesting organizer role');
        
        this.organizerRequestPending = true;
        alert('Your request to become an organizer has been submitted and is pending review.');
      }
    }
  
    // Ticket management
    viewTicket(ticketId: number): void {
      // TODO: Implement ticket view
      console.log('Viewing ticket', ticketId);
    }
  
    downloadTicket(ticketId: number): void {
      // TODO: Implement ticket download
      console.log('Downloading ticket', ticketId);
    }
  
    browseEvents(): void {
      this.router.navigate(['/events']);
    }
  
    // Bid management
    openUpdateBidDialog(bid: any): void {
      this.selectedBid = bid;
      this.updateBidForm.patchValue({
        newBidAmount: bid.highestBid + 100
      });
      
      // Set minimum bid amount validator
      this.updateBidForm.get('newBidAmount')?.setValidators([
        Validators.required,
        Validators.min(bid.highestBid + 100)
      ]);
      this.updateBidForm.get('newBidAmount')?.updateValueAndValidity();
      
      // Calculate remaining time for auction
      const endTime = new Date(bid.endTime);
      const now = new Date();
      const timeRemaining = endTime.getTime() - now.getTime();
      
      if (timeRemaining > 0) {
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        this.auctionTimeRemaining = `${hours}h ${minutes}m`;
      } else {
        this.auctionTimeRemaining = 'Auction ended';
      }
      
      this.showUpdateBidModal = true;
    }
  
    closeUpdateBidModal(): void {
      this.showUpdateBidModal = false;
      this.selectedBid = null;
    }
  
    submitBidUpdate(): void {
      if (this.updateBidForm.valid && this.selectedBid) {
        const newAmount = this.updateBidForm.get('newBidAmount')?.value;
        
        // TODO: Send bid update to server
        console.log('Updating bid to', newAmount);
        
        // Update bid in local data
        this.selectedBid.bidAmount = newAmount;
        this.selectedBid.highestBid = newAmount;
        
        this.closeUpdateBidModal();
        
        // Show success message
        alert('Bid updated successfully');
      }
    }
  
    payForWonBid(bid: any): void {
      // TODO: Implement payment for won bid
      console.log('Paying for won bid', bid);
    }
  
    browseAuctions(): void {
      this.router.navigate(['/auctions']);
    }
  
    // Event management
    openCreateEventModal(): void {
      this.showCreateEventModal = true;
      this.eventForm.reset();
      
      // Reset tickets form array to have one empty ticket
      while (this.ticketsFormArray.length > 0) {
        this.ticketsFormArray.removeAt(0);
      }
      this.addTicket();
    }
  
    closeCreateEventModal(): void {
      this.showCreateEventModal = false;
      this.eventImagePreview = null;
    }
  
    addTicket(): void {
      this.ticketsFormArray.push(this.createTicketFormGroup());
    }
  
    removeTicket(index: number): void {
      if (this.ticketsFormArray.length > 1) {
        this.ticketsFormArray.removeAt(index);
      }
    }
  
    onEventImageSelected(event: any): void {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        
        // Preview image
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.eventImagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // Set form value
        this.eventForm.patchValue({
          image: file
        });
      }
    }
  
    removeEventImage(): void {
      this.eventImagePreview = null;
      this.eventForm.patchValue({
        image: null
      });
    }
  
    saveEventAsDraft(): void {
      // TODO: Save event as draft
      console.log('Saving event as draft', this.eventForm.value);
      
      // Show success message
      alert('Event saved as draft');
      this.closeCreateEventModal();
    }
  
    submitEvent(): void {
      if (this.eventForm.valid) {
        // TODO: Submit event for review
        console.log('Submitting event for review', this.eventForm.value);
        
        // Show success message
        alert('Event submitted for review');
        this.closeCreateEventModal();
      } else {
        // Mark all fields as touched to show validation errors
        this.markFormGroupTouched(this.eventForm);
      }
    }
  
    markFormGroupTouched(formGroup: FormGroup): void {
      Object.values(formGroup.controls).forEach(control => {
        control.markAsTouched();
        
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        } else if (control instanceof FormArray) {
          control.controls.forEach(c => {
            if (c instanceof FormGroup) {
              this.markFormGroupTouched(c);
            }
          });
        }
      });
    }
  
    editEvent(eventId: number): void {
      // TODO: Implement event editing
      console.log('Editing event', eventId);
    }
  
    viewEventDetails(eventId: number): void {
      // TODO: Implement event details view
      console.log('Viewing event details', eventId);
    }
  
    manageEventTickets(eventId: number): void {
      // TODO: Implement ticket management
      console.log('Managing tickets for event', eventId);
    }
  
    // Admin functions
    approveOrganizerRequest(requestId: number): void {
      // TODO: Approve organizer request
      console.log('Approving organizer request', requestId);
      
      // Update request in UI
      const request = this.organizerRequests.find(r => r.id === requestId);
      if (request) {
        request.status = 'APPROVED';
        this.applyFilters();
      }
    }
  
    rejectOrganizerRequest(requestId: number): void {
      // TODO: Reject organizer request
      console.log('Rejecting organizer request', requestId);
      
      // Update request in UI
      const request = this.organizerRequests.find(r => r.id === requestId);
      if (request) {
        request.status = 'REJECTED';
        this.applyFilters();
      }
    }
  
    viewUserProfile(userId: number): void {
      // TODO: View user profile
      console.log('Viewing user profile', userId);
    }
  
    approveTicket(reviewId: number): void {
      // TODO: Approve ticket
      console.log('Approving ticket', reviewId);
      
      // Update ticket review in UI
      const review = this.ticketReviews.find(r => r.id === reviewId);
      if (review) {
        review.status = 'APPROVED';
        this.applyFilters();
      }
    }
  
    openRejectReasonDialog(reviewId: number): void {
      this.rejectionTicketId = reviewId;
      this.showRejectReasonModal = true;
      this.rejectReasonForm.reset();
    }
  
    closeRejectReasonModal(): void {
      this.showRejectReasonModal = false;
      this.rejectionTicketId = null;
    }
  
    submitRejectReason(): void {
      if (this.rejectReasonForm.valid && this.rejectionTicketId) {
        const reason = this.rejectReasonForm.get('reason')?.value;
        
        // TODO: Send rejection with reason to server
        console.log('Rejecting ticket with reason', this.rejectionTicketId, reason);
        
        // Update ticket review in UI
        const review = this.ticketReviews.find(r => r.id === this.rejectionTicketId);
        if (review) {
          review.status = 'REJECTED';
          review.rejectionReason = reason;
          this.applyFilters();
        }
        
        this.closeRejectReasonModal();
      }
    }
  
    // Utility methods
    closeOverlayOnOutsideClick(event: MouseEvent): void {
      if ((event.target as HTMLElement).classList.contains('popup-overlay')) {
        this.showEmailVerificationModal = false;
        this.showUpdateBidModal = false;
        this.showCreateEventModal = false;
        this.showRejectReasonModal = false;
      }
    }
  
    // Data loading (mock implementations)
    loadUserData(): void {
      // TODO: Load real data from server
      
      // Mock user tickets
      this.userTickets = [
        {
          id: 1,
          event: {
            id: 101,
            title: 'BNS Live',
            date: '05 April 2025',
            time: '07.00 PM',
            location: 'Nelum Pokuna, Colombo',
            image: 'https://assets.mytickets.lk/images/events/Oye%20Ojaye%20/IMG-20250308-WA0008-1741410420712.jpg'
          },
          type: 'VIP',
          purchasePrice: 5000,
          purchaseDate: '2025-02-15'
        },
        {
          id: 2,
          event: {
            id: 102,
            title: 'Wayo',
            date: '20 April 2025',
            time: '06.30 PM',
            location: 'Sugathadasa, Colombo',
            image: 'https://assets.mytickets.lk/images/events/Bambarakanda%20Waterfall%20Abseiling/WhatsApp%20Image%202025-02-09%20at%2013.19.38-1739445005605.jpeg',
            status: 'PAST',
            ticketsSold: 180,
            totalTickets: 200
          }
        ];
        
        // Mock organizer stats
        this.organizerStats = {
          totalEvents: 3,
          ticketsSold: 430,
          totalRevenue: 1950000,
          activeBids: 5
        };
        
        // Mock recent sales
        this.recentSales = [
          {
            eventTitle: 'Rock Music Festival',
            ticketType: 'VIP',
            purchaseDate: '2025-03-10T14:25:00',
            customerName: 'Sarah Johnson',
            price: 7500
          },
          {
            eventTitle: 'Rock Music Festival',
            ticketType: 'Regular',
            purchaseDate: '2025-03-09T10:15:00',
            customerName: 'Michael Brown',
            price: 3500
          },
          {
            eventTitle: 'Rock Music Festival',
            ticketType: 'Regular',
            purchaseDate: '2025-03-08T16:45:00',
            customerName: 'Amanda Wilson',
            price: 3500
          },
          {
            eventTitle: 'Classical Music Evening',
            ticketType: 'Premium',
            purchaseDate: '2025-02-25T09:30:00',
            customerName: 'David Lee',
            price: 6000
          }
        ];
      }
      
      if (this.user.role === 'ADMIN') {
        // Mock organizer requests
        this.organizerRequests = [
          {
            id: 301,
            user: {
              id: 1001,
              fullName: 'Mark Williams',
              email: 'mark.williams@example.com',
              profilePicture: null
            },
            requestDate: '2025-03-15T09:45:00',
            status: 'PENDING'
          },
          {
            id: 302,
            user: {
              id: 1002,
              fullName: 'Jessica Taylor',
              email: 'jessica.taylor@example.com',
              profilePicture: null
            },
            requestDate: '2025-03-12T14:20:00',
            status: 'APPROVED'
          },
          {
            id: 303,
            user: {
              id: 1003,
              fullName: 'Robert Garcia',
              email: 'robert.garcia@example.com',
              profilePicture: null
            },
            requestDate: '2025-03-10T11:30:00',
            status: 'REJECTED'
          }
        ];
        
        // Mock ticket reviews
        this.ticketReviews = [
          {
            id: 401,
            event: {
              id: 501,
              title: 'Summer Beach Party',
              date: '20 June 2025',
              time: '04:00 PM',
              location: 'Mount Lavinia Beach',
              description: 'Join us for the ultimate summer beach party with live DJs, food stalls, and beach games. This event is perfect for families and friends looking for a day of fun under the sun.',
              image: 'https://assets.mytickets.lk/images/events/Bambarakanda%20Waterfall%20Abseiling/WhatsApp%20Image%202025-02-09%20at%2013.19.38-1739445005605.jpeg'
            },
            organizer: {
              id: 601,
              fullName: 'Beach Party Organizers Ltd',
              profilePicture: null
            },
            tickets: [
              { type: 'Regular', price: 2500, quantity: 500 },
              { type: 'VIP', price: 5000, quantity: 100 }
            ],
            status: 'PENDING'
          },
          {
            id: 402,
            event: {
              id: 502,
              title: 'Tech Conference 2025',
              date: '15 July 2025',
              time: '09:00 AM',
              location: 'BMICH, Colombo',
              description: 'A premier tech conference featuring industry leaders, workshops, and networking opportunities. Learn about the latest trends in AI, blockchain, and sustainable tech solutions.',
              image: 'https://assets.mytickets.lk/images/events/Bambarakanda%20Waterfall%20Abseiling/WhatsApp%20Image%202025-02-09%20at%2013.19.38-1739445005605.jpeg'
            },
            organizer: {
              id: 602,
              fullName: 'Sri Lanka Tech Association',
              profilePicture: null
            },
            tickets: [
              { type: 'Standard', price: 8000, quantity: 300 },
              { type: 'Premium', price: 15000, quantity: 50 },
              { type: 'Workshop Pass', price: 5000, quantity: 100 }
            ],
            status: 'APPROVED'
          },
          {
            id: 403,
            event: {
              id: 503,
              title: 'Food Festival 2025',
              date: '05 August 2025',
              time: '11:00 AM',
              location: 'Race Course Grounds, Colombo',
              description: 'Experience the best culinary delights from around the world. Over 50 food stalls, cooking demonstrations, and competitions.',
              image: 'https://assets.mytickets.lk/images/events/Bambarakanda%20Waterfall%20Abseiling/WhatsApp%20Image%202025-02-09%20at%2013.19.38-1739445005605.jpeg'
            },
            organizer: {
              id: 603,
              fullName: 'Foodies Lanka',
              profilePicture: null
            },
            tickets: [
              { type: 'Entry Pass', price: 1500, quantity: 1000 },
              { type: 'Tasting Pass', price: 4000, quantity: 200 }
            ],
            status: 'REJECTED',
            rejectionReason: 'The event description lacks specific details about COVID-19 safety measures. Please update with information on crowd management and health protocols.'
          }
        ];
      }
      
      // Apply initial filters
      this.applyFilters();
    }
  }20Waterfall%20Abseiling/WhatsApp%20Image%202025-02-09%20at%2013.19.38-1739445005605.jpeg'
          },
          type: 'Regular',
          purchasePrice: 3500,
          purchaseDate: '2025-03-01'
        }
      ];
      
      // Mock user bids
      this.userBids = [
        {
          id: 1,
          event: {
            id: 103,
            title: 'Marians',
            date: '10 May 2025'
          },
          ticketType: 'Premium',
          bidAmount: 7500,
          highestBid: 8000,
          endTime: '2025-04-15T18:00:00',
          status: 'ACTIVE'
        },
        {
          id: 2,
          event: {
            id: 104,
            title: 'Symphony SL',
            date: '22 June 2025'
          },
          ticketType: 'VIP',
          bidAmount: 9000,
          highestBid: 9000,
          endTime: '2025-03-10T20:00:00',
          status: 'WON'
        },
        {
          id: 3,
          event: {
            id: 105,
            title: 'Soul Sounds',
            date: '15 July 2025'
          },
          ticketType: 'VIP',
          bidAmount: 6000,
          highestBid: 7500,
          endTime: '2025-02-28T22:00:00',
          status: 'LOST'
        }
      ];
      
      // Mock login activities
      this.loginActivities = [
        {
          id: 1,
          timestamp: '2025-03-18T15:30:00',
          device: 'Chrome on Windows',
          ipAddress: '192.168.1.1',
          location: 'Colombo, Sri Lanka'
        },
        {
          id: 2,
          timestamp: '2025-03-15T10:15:00',
          device: 'Safari on iPhone',
          ipAddress: '192.168.1.2',
          location: 'Colombo, Sri Lanka'
        },
        {
          id: 3,
          timestamp: '2025-03-10T18:45:00',
          device: 'Firefox on Mac',
          ipAddress: '192.168.1.3',
          location: 'Kandy, Sri Lanka'
        }
      ];
      
      // Load role-specific data
      if (this.user.role === 'ORGANIZER') {
        // Mock organizer events
        this.organizerEvents = [
          {
            id: 201,
            title: 'Rock Music Festival',
            date: '15 May 2025',
            location: 'Viharamahadevi Park, Colombo',
            image: 'https://assets.mytickets.lk/images/events/Bambarakanda%20Waterfall%20Abseiling/WhatsApp%20Image%202025-02-09%20at%2013.19.38-1739445005605.jpeg',
            status: 'ACTIVE',
            ticketsSold: 250,
            totalTickets: 500
          },
          {
            id: 202,
            title: 'Jazz Night',
            date: '10 June 2025',
            location: 'Cinnamon Grand, Colombo',
            image: 'https://assets.mytickets.lk/images/events/Bambarakanda%20Waterfall%20Abseiling/WhatsApp%20Image%202025-02-09%20at%2013.19.38-1739445005605.jpeg',
            status: 'DRAFT',
            ticketsSold: 0,
            totalTickets: 200
          },
          {
            id: 203,
            title: 'Classical Music Evening',
            date: '01 March 2025',
            location: 'BMICH, Colombo',
            image: 'https://assets.mytickets.lk/images/events/Bambarakanda%
}
