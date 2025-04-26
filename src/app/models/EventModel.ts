export class EventModel {
    eventId: number;
    name: string;
    description: string;
    eventDate: string;
    imageUrl: string;
    venueName: string;
    venueLocation: string;
    category: string;
    createdById: number;
    totalTickets: number;
    createdAt: string;
    availableTickets: number;
    ticketPrice: number;

    constructor(
        name: string = '',
        description: string = '',
        eventDate: string = '',
        imageUrl: string = '',
        venueName: string = '',
        venueLocation: string = '',
        category: string = '',
        createdById: number = 1,
        totalTickets: number = 0,
        createdAt: string = '',
        availableTickets: number = 0,
        eventId: number,
        ticketPrice: number = 0
    ) {
        this.eventId = eventId;
        this.name = name;
        this.description = description;
        this.eventDate = eventDate;
        this.imageUrl = imageUrl;
        this.venueName = venueName;
        this.venueLocation = venueLocation;
        this.category = category;
        this.createdById = createdById;
        this.totalTickets = totalTickets;
        this.createdAt = createdAt;
        this.availableTickets = availableTickets;
        this.ticketPrice = ticketPrice;
    }
}
