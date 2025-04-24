import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface EventDto {
  eventId?: number;
  name: string;
  description: string;
  eventDate: string;
  venueName: string;
  venueLocation: string;
  category: string;
  totalTickets: number;
  ticketTypes: TicketType[];
}

interface TicketType {
  name: string;
  price: number;
  quantity: number;
  maxPerUser?: number;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8080/api/events'; // Update with your API URL

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createEvent(eventData: FormData): Observable<ApiResponse<EventDto>> {
    return this.http.post<ApiResponse<EventDto>>(
      this.apiUrl, 
      eventData, 
      { headers: this.getAuthHeaders() }
    );
  }

  getEventById(eventId: number): Observable<ApiResponse<EventDto>> {
    return this.http.get<ApiResponse<EventDto>>(
      `${this.apiUrl}/${eventId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getFilteredEvents(
    category?: string,
    venueLocation?: string,
    searchTerm?: string
  ): Observable<ApiResponse<EventDto[]>> {
    let params: any = {};
    if (category) params.category = category;
    if (venueLocation) params.venueLocation = venueLocation;
    if (searchTerm) params.searchTerm = searchTerm;

    return this.http.get<ApiResponse<EventDto[]>>(
      this.apiUrl,
      { 
        headers: this.getAuthHeaders(),
        params: params
      }
    );
  }

  getUpcomingEvents(): Observable<ApiResponse<EventDto[]>> {
    return this.http.get<ApiResponse<EventDto[]>>(
      `${this.apiUrl}/upcoming`,
      { headers: this.getAuthHeaders() }
    );
  }

  updateEvent(eventId: number, eventData: EventDto): Observable<ApiResponse<EventDto>> {
    return this.http.put<ApiResponse<EventDto>>(
      `${this.apiUrl}/${eventId}`,
      eventData,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteEvent(eventId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/${eventId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getEventsByCreator(userId: number): Observable<ApiResponse<EventDto[]>> {
    return this.http.get<ApiResponse<EventDto[]>>(
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