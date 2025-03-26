import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
    ).pipe(
      catchError(error => {
        console.error('Error updating user profile:', error);
        return throwError(() => error);
      })
    );
  }

  requestOrganizerRole(userId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/users/${userId}/role-request`,
      { role: 'ORGANIZER' },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error requesting organizer role:', error);
        return throwError(() => error);
      })
    );
  }

  sendVerificationEmail(email: string): Observable<any> {
    console.log('Sending verification email to:', email);
    
    return this.http.post(`${this.apiUrl}/auth/send-verification-email`, null,
      { 
        headers: this.getHeaders(),
        params: { email: email }
      }
    ).pipe(
      catchError(error => {
        console.error('API Error with verification email:', error);
        return throwError(() => error);
      })
    );
  }

  checkEmailVerification(email: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/auth/check-verification`,
      { 
        headers: this.getHeaders(),
        params: { email: email }
      }
    ).pipe(
      catchError(error => {
        console.error('Error checking verification status:', error);
        return throwError(() => error);
      })
    );
  }

  updatePassword(userId: number, currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/users/${userId}/change-password`,
      { currentPassword, newPassword },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error updating password:', error);
        return throwError(() => error);
      })
    );
  }

  toggleTwoFactor(userId: number, enabled: boolean): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/users/${userId}/two-factor`,
      { enabled },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error toggling two-factor auth:', error);
        return throwError(() => error);
      })
    );
  }

  getUserTickets(userId: number, filter: string = 'all'): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/api/tickets/user/${userId}?filter=${filter}`,
      { headers: this.getHeaders() }
    ).pipe(
      map((response: any) => response.data || []),
      catchError(error => {
        console.error('Error getting user tickets:', error);
        return throwError(() => error);
      })
    );
  }

  getUserBids(userId: number, filter: string = 'all'): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/api/bids/user/${userId}?filter=${filter}`,
      { headers: this.getHeaders() }
    ).pipe(
      map((response: any) => response.data || []),
      catchError(error => {
        console.error('Error getting user bids:', error);
        return throwError(() => error);
      })
    );
  }

  updateBid(bidId: number, userId: number, amount: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/api/bids/${bidId}`,
      { userId, amount },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error updating bid:', error);
        return throwError(() => error);
      })
    );
  }
}