export class Event {
    id?: number;
    image: string;
    date: string;
    time: string;
    location: string;
    type: string;
    title: string;
    price: string;
    ticketsAvailable: number;
    description?: string;

    constructor(
        image: string = '',
        date: string = '',
        time: string = '',
        location: string = '',
        type: string = '',
        title: string = '',
        price: string = '',
        ticketsAvailable: number = 0,
        id?: number,
        description?: string
    ) {
        this.id = id;
        this.image = image;
        this.date = date;
        this.time = time;
        this.location = location;
        this.type = type;
        this.title = title;
        this.price = price;
        this.ticketsAvailable = ticketsAvailable;
        this.description = description;
    }
}