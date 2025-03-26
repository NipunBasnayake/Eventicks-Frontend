import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = 'http://localhost:8080';
  private inMemoryOnly = false;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
      this.inMemoryOnly = false;
    }
  }

  register(fullName: string, email: string, password: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*');
    
    const body = JSON.stringify({
      name: fullName,
      email: email,
      password: password
    });
    
    return this.http.post(`${this.apiUrl}/auth/register`, body, {
      headers: headers,
      responseType: 'json'
    }).pipe(
      tap(response => {
        this.storeUserData(response, true);
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*');
    
    const body = JSON.stringify({
      email: email,
      password: password
    });
    
    return this.http.post(`${this.apiUrl}/auth/login`, body, {
      headers: headers,
      responseType: 'json'
    }).pipe(
      tap(response => {
        // Store user data upon successful login
        this.storeUserData(response, !this.inMemoryOnly);
      })
    );
  }

  signInWithGoogle(): Promise<any> {
    return Promise.resolve({});
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.inMemoryOnly = false;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  getCurrentUser(): any {
    const currentUser = this.currentUserSubject.getValue();
    if (currentUser) {
      return currentUser;
    }

    if (!this.inMemoryOnly) {
      const localUser = localStorage.getItem('user');
      if (localUser) {
        const parsedUser = JSON.parse(localUser);
        this.currentUserSubject.next(parsedUser);
        return parsedUser;
      }
    }
    return null;
  }

  getToken(): string | null {
    const user = this.getCurrentUser();
    return user && user.token ? user.token : null;
  }

  getUserEmail(): string | null {
    const user = this.getCurrentUser();
    return user && user.email ? user.email : null;
  }

  storeUserData(userData: any, rememberMe: boolean): void {
    this.currentUserSubject.next(userData);
    
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
      this.inMemoryOnly = false;
    } else {
      localStorage.removeItem('user');
      this.inMemoryOnly = true;
    }
  }
  
  isInMemoryOnly(): boolean {
    return this.inMemoryOnly;
  }

  forgotPassword(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    
    return this.http.post<any>(
      `${this.apiUrl}/auth/forgot`, 
      null, 
      { params }
    ).pipe(
      map(response => response.data)
    );
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    const body = {
      email: email,
      otp: otp
    };
    
    return this.http.post<any>(
      `${this.apiUrl}/auth/verify-otp`, 
      body
    ).pipe(
      map(response => response.data)
    );
  }

  resetPassword(email: string, newPassword: string): Observable<any> {
    const body = {
      email: email,
      newPassword: newPassword
    };
    
    return this.http.post<any>(
      `${this.apiUrl}/auth/reset-password`, 
      body
    ).pipe(
      map(response => response.data)
    );
  }

  getUserProfile(email: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*');
    
    return this.http.get(`${this.apiUrl}/api/users/email/${email}`, {
      headers: headers
    }).pipe(
      map(response => response)
    );
  }
}