import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8080/api/events'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createEvent(event: Event): Observable<ApiResponse<Event>> {
    return this.http.post<ApiResponse<Event>>(
      this.apiUrl,
      event,
      { headers: this.getAuthHeaders() }
    );
  }

  getEventById(eventId: number): Observable<ApiResponse<Event>> {
    return this.http.get<ApiResponse<Event>>(
      `${this.apiUrl}/${eventId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getFilteredEvents(
    category?: string,
    venueLocation?: string,
    searchTerm?: string
  ): Observable<ApiResponse<Event[]>> {
    let params: any = {};
    if (category) params.category = category;
    if (venueLocation) params.venueLocation = venueLocation;
    if (searchTerm) params.searchTerm = searchTerm;
  
    return this.http.get<ApiResponse<Event[]>>(
      this.apiUrl,
      { 
        headers: this.getAuthHeaders(),
        params: params
      }
    );
  }
  

  getUpcomingEvents(): Observable<ApiResponse<Event[]>> {
    return this.http.get<ApiResponse<Event[]>>(
      `${this.apiUrl}/upcoming`,
      { headers: this.getAuthHeaders() }
    );
  }

  updateEvent(eventId: number, event: Event): Observable<ApiResponse<Event>> {
    return this.http.put<ApiResponse<Event>>(
      `${this.apiUrl}/${eventId}`,
      event,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteEvent(eventId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/${eventId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getEventsByCreator(userId: number): Observable<ApiResponse<Event[]>> {
    return this.http.get<ApiResponse<Event[]>>(
      `${this.apiUrl}/creator/${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getAllCategories(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(
      `${this.apiUrl}/categories`,
      { headers: this.getAuthHeaders() }
    );
  }

  getAllLocations(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(
      `${this.apiUrl}/locations`,
      { headers: this.getAuthHeaders() }
    );
  }
}
