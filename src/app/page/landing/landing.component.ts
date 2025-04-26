import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { EventPopupComponent } from '../../event-popup/event-popup.component';
import { EventModel } from '../../models/EventModel';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavBarComponent, FooterComponent, EventPopupComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  searchQuery: string = '';
  events: EventModel[] = [];
  selectedEvent: EventModel | null = null;
  showEventPopup: boolean = false;

  constructor(private router: Router, private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  handleSearchChange(event: any): void {
    this.searchQuery = event.target.value;
  }

  handleSearchSubmit(event: Event): void {
    this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
  }

  viewEventDetails(event: EventModel): void {
    this.selectedEvent = event;
    this.showEventPopup = true;
  }

  closeEventPopup(): void {
    this.showEventPopup = false;
  }

  handlePurchase(purchaseData: {eventId: number, ticketCount: number}): void {
    console.log('Purchase initiated:', purchaseData);
    this.closeEventPopup();
  }

  seeAllEvents(): void {
    this.router.navigate(['/events']);
  }

  loadEvents(): void {
    this.eventService.getFilteredEvents().subscribe({
      next: (response) => {
        if (response.success) {
          this.events = response.data.map((event: any) => {
            return new EventModel(
              event.name,
              event.description,
              event.eventDate,
              event.imageUrl,
              event.venueName,
              event.venueLocation,
              event.category,
              event.createdById,
              event.totalTickets,
              event.createdAt,
              event.availableTickets,
              event.eventId,
              event.ticketPrice
            );
          });
        } else {
          console.error('Failed to load events:', response.message);
        }
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }

  getMonthShortName(dateString: string): string {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = new Date(dateString).getMonth();
    return monthNames[monthIndex];
  }

  formatEventTime(dateString: string): string {
    const eventDate = new Date(dateString);
    let hours = eventDate.getHours();
    let minutes = eventDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? hours : 12;
  
    const minutesFormatted = minutes < 10 ? '0' + minutes : minutes.toString();
    return `${hours}:${minutesFormatted} ${ampm}`;
  }
}