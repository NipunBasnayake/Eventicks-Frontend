import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

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
    });
  }

  // Google Sign-in method as stub
  signInWithGoogle(): Promise<any> {
    // Google Sign-In implementation would go here
    return Promise.resolve({});
  }

  // Google login processing method commented out
  /*
  processGoogleLogin(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/google-auth`, { user }).pipe(
      tap(response => {
        this.currentUserSubject.next(response.data || response);
      })
    );
  }
  */

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
}