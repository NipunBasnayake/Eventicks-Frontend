import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { EventModel } from '../models/EventModel';

@Component({
  selector: 'app-event-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-popup.component.html',
  styleUrls: ['./event-popup.component.css']
})
export class EventPopupComponent implements OnInit {
  @Input() event!: EventModel; // Use definite assignment assertion
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() purchase = new EventEmitter<{eventId: number, ticketCount: number}>();
  
  ticketCountControl = new FormControl(1);
  ticketCount: number = 1;

  ngOnInit(): void {
    this.ticketCountControl.valueChanges.subscribe(value => {
      if (value) {
        this.ticketCount = parseInt(value.toString(), 10);
      }
    });
  }

  formatEventDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  incrementTickets(): void {
    if (this.ticketCount < this.event.availableTickets) {
      this.ticketCount++;
      this.ticketCountControl.setValue(this.ticketCount);
    }
  }

  decrementTickets(): void {
    if (this.ticketCount > 1) {
      this.ticketCount--;
      this.ticketCountControl.setValue(this.ticketCount);
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  purchaseTickets(): void {
    this.purchase.emit({
      eventId: this.event.eventId,
      ticketCount: this.ticketCount
    });
  }

  closeOverlayOnOutsideClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('popup-overlay')) {
      this.closeModal();
    }
  }
}