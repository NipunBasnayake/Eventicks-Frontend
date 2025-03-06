import React from "react";
import "./latest.css";

const EventCard = ({
  image,
  date,
  time,
  location,
  type,
  title,
  price,
  ticketsAvailable,
}) => {
  const dateParts = date.split(" ");
  const day = dateParts[0];
  const month = dateParts[1].substring(0, 3);

  return (
    <div className="event-card">
      <div className="event-image-wrapper">
        <img src={image} alt={title} className="event-image" />
        <div className="event-overlay"></div>
        <div className="event-date-badge">
          <span className="event-day">{day}</span>
          <span className="event-month">{month}</span>
        </div>
        <div className="event-type-badge">{type}</div>
      </div>

      <div className="event-content">
        <h3 className="event-title">{title}</h3>

        <ul className="event-details">
          <li className="event-detail">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{time}</span>
          </li>
          <li className="event-detail">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{location}</span>
          </li>
          <li className="event-detail">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
              <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
              <path d="M18 12a2 2 0 0 0 0 4h4v-4z"></path>
            </svg>
            <span>{price}</span>
          </li>
        </ul>

        <div className="event-footer">
          <button className="book-now-button">Book Now</button>
          <div className="tickets-info">
            <span className="tickets-count">{ticketsAvailable}</span>
            <span className="tickets-label">Tickets Left</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Latest = () => {
  const events = [
    {
      image: "./src/assets/images/event1.webp",
      date: "05 April 2025",
      time: "07.00 PM",
      location: "Nelum Pokuna, Colombo",
      type: "Indoor Musical Concert",
      title: "BNS Live",
      price: "5000 LKR",
      ticketsAvailable: 100,
    },
    {
      image: "./src/assets/images/event2.webp",
      date: "20 April 2025",
      time: "06.30 PM",
      location: "Sugathadasa, Colombo",
      type: "Pop & Fusion Music Show",
      title: "Wayo",
      price: "3500 LKR",
      ticketsAvailable: 120,
    },
    {
      image: "./src/assets/images/event3.webp",
      date: "10 May 2025",
      time: "07.30 PM",
      location: "Shangri-La, Colombo",
      type: "Classical Music Performance",
      title: "Marians",
      price: "6000 LKR",
      ticketsAvailable: 80,
    },
    {
      image: "./src/assets/images/event4.webp",
      date: "25 May 2025",
      time: "08.00 PM",
      location: "Earl’s Regency, Kandy",
      type: "Acoustic & Folk Music Show",
      title: "Nanda Malini",
      price: "4500 LKR",
      ticketsAvailable: 90,
    },
    {
      image: "./src/assets/images/event5.webp",
      date: "07 June 2025",
      time: "06.00 PM",
      location: "BMICH, Colombo",
      type: "Rock & Band Performance",
      title: "Chithral",
      price: "5000 LKR",
      ticketsAvailable: 110,
    },
    {
      image: "./src/assets/images/event6.webp",
      date: "22 June 2025",
      time: "07.00 PM",
      location: "Nelum Pokuna, Colombo",
      type: "Orchestra & Symphony Night",
      title: "Symphony SL",
      price: "7000 LKR",
      ticketsAvailable: 75,
    },
    {
      image: "./src/assets/images/event7.webp",
      date: "15 July 2025",
      time: "06.30 PM",
      location: "Taj Samudra, Colombo",
      type: "Jazz & Soul Music",
      title: "Soul Sounds",
      price: "5500 LKR",
      ticketsAvailable: 85,
    },
    {
      image: "./src/assets/images/event8.webp",
      date: "30 July 2025",
      time: "07.30 PM",
      location: "Nelum Pokuna, Colombo",
      type: "Modern Pop & Electronic Fusion",
      title: "Infinity X",
      price: "4000 LKR",
      ticketsAvailable: 150,
    },
    {
      image: "./src/assets/images/event9.webp",
      date: "12 August 2025",
      time: "08.00 PM",
      location: "MR Theatre, Hambantota",
      type: "Sinhala Retro Night",
      title: "Flashback",
      price: "3800 LKR",
      ticketsAvailable: 95,
    },
    {
      image: "./src/assets/images/event10.webp",
      date: "20 August 2025",
      time: "06.00 PM",
      location: "Water’s Edge, B'mulla",
      type: "Outdoor Classical Fusion",
      title: "Sanda Madala",
      price: "5500 LKR",
      ticketsAvailable: 70,
    },
  ];

  return (
    <div className="latest-events">
      <h1>Latest Events</h1>
      <br />
      <div className="event-list">
        {events.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>
      <span className="see-all-events">See All Events</span>
    </div>
  );
};

export default Latest;
