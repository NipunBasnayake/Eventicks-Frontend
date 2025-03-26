import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.css'
})
export class EmailVerificationComponent implements OnInit {
  verificationStatus: 'verifying' | 'success' | 'error' = 'verifying';
  errorMessage: string = '';
  private apiUrl = 'http://localhost:8080';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    console.log('EmailVerificationComponent initialized');
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      console.log('Token from URL:', token ? 'Token present' : 'No token');
      
      if (token) {
        this.verifyEmail(token);
      } else {
        this.verificationStatus = 'error';
        this.errorMessage = 'Invalid verification link. No token provided.';
      }
    });
  }

  verifyEmail(token: string): void {
    console.log('Verifying email with token...');
    
    this.http.get(`${this.apiUrl}/auth/verify-email`, {
      params: { token }
    }).subscribe({
      next: (response: any) => {
        console.log('Verification response:', response);
        
        if (response.success) {
          this.verificationStatus = 'success';
        } else {
          this.verificationStatus = 'error';
          this.errorMessage = response.message || 'Verification failed';
        }
      },
      error: (err) => {
        console.error('Verification error:', err);
        this.verificationStatus = 'error';
        this.errorMessage = err.error?.message || 'Verification failed. Please try again.';
      }
    });
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  requestNewVerification(): void {
    this.router.navigate(['/request-verification']);
  }
}