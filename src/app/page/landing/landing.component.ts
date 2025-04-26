import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { EventPopupComponent } from '../../components/event-popup/event-popup.component';
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
  filteredEvents: EventModel[] = [];
  selectedEvent: EventModel | null = null;
  showEventPopup: boolean = false;
  activeFilter: string | null = null;

  categories = [
    { value: 'LIVE_CONCERTS', label: 'Live Concerts' },
    { value: 'DJ_NIGHTS', label: 'DJ Nights' },
    { value: 'CLASSICAL_MUSIC', label: 'Classical Music' },
    { value: 'OPEN_MIC', label: 'Open Mic' },
    { value: 'TRIBUTE_SHOWS', label: 'Tribute Shows' },
    { value: 'MUSIC_FESTIVALS', label: 'Music Festivals' }
  ];

  constructor(private router: Router, private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
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
          this.filteredEvents = [...this.events];
        }
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }

  filterEvents(category: string | null): void {
    this.activeFilter = category;
    this.applyFilters();
  }

  handleSearchChange(event: any): void {
    this.searchQuery = event.target.value.toLowerCase();
    this.applyFilters();
  }

  handleSearchSubmit(event: Event): void {
    event.preventDefault(); // Prevent form submission
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.events];

    if (this.activeFilter) {
      filtered = filtered.filter(event => event.category === this.activeFilter);
    }

    if (this.searchQuery) {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(this.searchQuery) ||
        event.description.toLowerCase().includes(this.searchQuery) ||
        event.venueName.toLowerCase().includes(this.searchQuery) ||
        event.venueLocation.toLowerCase().includes(this.searchQuery))
    }

    this.filteredEvents = filtered;
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