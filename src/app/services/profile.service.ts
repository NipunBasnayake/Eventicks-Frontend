import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*')
      .set('Authorization', `Bearer ${token}`);
  }

  updateUserProfile(userData: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/api/users/${userData.userId}`, 
      userData,
      { headers: this.getHeaders() }
    );
  }

  requestOrganizerRole(userId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/users/${userId}/role-request`,
      { role: 'ORGANIZER' },
      { headers: this.getHeaders() }
    );
  }

  sendVerificationEmail(email: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/users/send-otp`, 
      { email },
      { headers: this.getHeaders() }
    );
  }

  verifyEmail(email: string, code: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/users/verify-email`,
      { email, otp: code },
      { headers: this.getHeaders() }
    );
  }

  updatePassword(userId: number, currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/users/${userId}/change-password`,
      { currentPassword, newPassword },
      { headers: this.getHeaders() }
    );
  }

  toggleTwoFactor(userId: number, enabled: boolean): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/users/${userId}/two-factor`,
      { enabled },
      { headers: this.getHeaders() }
    );
  }

  getUserTickets(userId: number, filter: string = 'all'): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/api/tickets/user/${userId}?filter=${filter}`,
      { headers: this.getHeaders() }
    ).pipe(
      map((response: any) => response.data || [])
    );
  }

  getUserBids(userId: number, filter: string = 'all'): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/api/bids/user/${userId}?filter=${filter}`,
      { headers: this.getHeaders() }
    ).pipe(
      map((response: any) => response.data || [])
    );
  }

  updateBid(bidId: number, userId: number, amount: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/api/bids/${bidId}`,
      { userId, amount },
      { headers: this.getHeaders() }
    );
  }
}