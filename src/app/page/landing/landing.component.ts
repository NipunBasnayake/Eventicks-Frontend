import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from "../../common/nav-bar/nav-bar.component";
import { Event } from '../../models/event';
import { FooterComponent } from "../../common/footer/footer.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, NavBarComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {

  searchQuery: string = '';
  events: Event[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  handleSearchChange(event: any): void {
    this.searchQuery = event.target.value;
  }

  handleSearchSubmit(event: Event): void {
    console.log('Searching for:', this.searchQuery);
    this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
  }

  viewEventDetails(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }

  seeAllEvents(): void {
    this.router.navigate(['/events']);
  }

  loadEvents(): void {
    this.events = [
      {
        id: 1,
        image: "https://assets.mytickets.lk/images/events/Oye%20Ojaye%20/IMG-20250308-WA0008-1741410420712.jpg",
        date: "05 April 2025",
        time: "07.00 PM",
        location: "Nelum Pokuna, Colombo",
        type: "Indoor Musical Concert",
        title: "BNS Live",
        price: "5000 LKR",
        ticketsAvailable: 100,
      },
      {
        id: 2,
        image: "https://assets.mytickets.lk/images/events/Bambarakanda%20Waterfall%20Abseiling/WhatsApp%20Image%202025-02-09%20at%2013.19.38-1739445005605.jpeg",
        date: "20 April 2025",
        time: "06.30 PM",
        location: "Sugathadasa, Colombo",
        type: "Pop & Fusion Music Show",
        title: "Wayo",
        price: "3500 LKR",
        ticketsAvailable: 120,
      },
      {
        id: 3,
        image: "https://assets.mytickets.lk/images/events/Bambarakanda%20Waterfall%20Abseiling/WhatsApp%20Image%202025-02-09%20at%2013.19.38-1739445005605.jpeg",
        date: "10 May 2025",
        time: "07.30 PM",
        location: "Shangri-La, Colombo",
        type: "Classical Music Performance",
        title: "Marians",
        price: "6000 LKR",
        ticketsAvailable: 80,
      },
      {
        id: 4,
        image: "https://assets.mytickets.lk/images/events/Bambarakanda%20Waterfall%20Abseiling/WhatsApp%20Image%202025-02-09%20at%2013.19.38-1739445005605.jpeg",
        date: "25 May 2025",
        time: "08.00 PM",
        location: "Earl's Regency, Kandy",
        type: "Acoustic & Folk Music Show",
        title: "Nanda Malini",
        price: "4500 LKR",
        ticketsAvailable: 90,
      },
      {
        id: 5,
        image: "https://assets.mytickets.lk/images/events/Bambarakanda%20Waterfall%20Abseiling/WhatsApp%20Image%202025-02-09%20at%2013.19.38-1739445005605.jpeg",
        date: "07 June 2025",
        time: "06.00 PM",
        location: "BMICH, Colombo",
        type: "Rock & Band Performance",
        title: "Chithral",
        price: "5000 LKR",
        ticketsAvailable: 110,
      },
      {
        id: 6,
        image: "https://assets.mytickets.lk/images/events/Bambarakanda%20Waterfall%20Abseiling/WhatsApp%20Image%202025-02-09%20at%2013.19.38-1739445005605.jpeg",
        date: "22 June 2025",
        time: "07.00 PM",
        location: "Nelum Pokuna, Colombo",
        type: "Orchestra & Symphony Night",
        title: "Symphony SL",
        price: "7000 LKR",
        ticketsAvailable: 75,
      },
      {
        id: 7,
        image: "https://assets.mytickets.lk/images/events/Bambarakanda%20Waterfall%20Abseiling/WhatsApp%20Image%202025-02-09%20at%2013.19.38-1739445005605.jpeg",
        date: "15 July 2025",
        time: "06.30 PM",
        location: "Taj Samudra, Colombo",
        type: "Jazz & Soul Music",
        title: "Soul Sounds",
        price: "5500 LKR",
        ticketsAvailable: 85,
      },
      {
        id: 8,
        image: "https://assets.mytickets.lk/images/events/Bambarakanda%20Waterfall%20Abseiling/WhatsApp%20Image%202025-02-09%20at%2013.19.38-1739445005605.jpeg",
        date: "30 July 2025",
        time: "07.30 PM",
        location: "Nelum Pokuna, Colombo",
        type: "Modern Pop & Electronic Fusion",
        title: "Infinity X",
        price: "4000 LKR",
        ticketsAvailable: 150,
      },
      {
        id: 9,
        image: "https://assets.mytickets.lk/images/events/Bambarakanda%20Waterfall%20Abseiling/WhatsApp%20Image%202025-02-09%20at%2013.19.38-1739445005605.jpeg",
        date: "12 August 2025",
        time: "08.00 PM",
        location: "MR Theatre, Hambantota",
        type: "Sinhala Retro Night",
        title: "Flashback",
        price: "3800 LKR",
        ticketsAvailable: 95,
      },
      {
        id: 10,
        image: "https://assets.mytickets.lk/images/events/Bambarakanda%20Waterfall%20Abseiling/WhatsApp%20Image%202025-02-09%20at%2013.19.38-1739445005605.jpeg",
        date: "20 August 2025",
        time: "06.00 PM",
        location: "Water's Edge, B'mulla",
        type: "Outdoor Classical Fusion",
        title: "Sanda Madala",
        price: "5500 LKR",
        ticketsAvailable: 70,
      }
    ];
  }
}