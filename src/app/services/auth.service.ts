import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(fullName: string, email: string, password: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*');

    const body = JSON.stringify({
      name: fullName,
      email: email,
      password: password
    });

    return this.http.post(`http://localhost:8080/auth/register`, body, {
      headers: headers,
      responseType: 'json'
    });
  }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*');

    const body = JSON.stringify({
      email: email,
      password: password
    });

    return this.http.post(`http://localhost:8080/auth/login`, body, {
      headers: headers,
      responseType: 'json'
    });
  }

  signInWithGoogle(): Promise<any> {
    //  Google Sign-In
    //  Firebase, Angular Fire, or a custom implementation
    return Promise.resolve({});
  }

  processGoogleLogin(user: any): Observable<any> {
    return this.http.post(`http://localhost:8080/auth//google-auth`, { user });
  }
}