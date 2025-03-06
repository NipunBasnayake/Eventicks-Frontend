import React from 'react';
import './latest.css';

const EventCard = ({ image, date, time, location, type, title, price, ticketsAvailable }) => {
  return (
    <div className="event-card">
      <div className="event-image" style={{ backgroundImage: `url(${image})` }}></div>
      <div className="event-content">
        <div className="event-header">
          <div className="event-badge">{type}</div>
          <div className="event-datetime">
            <div className="event-date">{date}</div>
            <div className="event-time">{time}</div>
          </div>
        </div>

        <h3 className="event-title">{title}</h3>
        <div className="event-location">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
          </svg>
          <span>{location}</span>
        </div>

        <div className="event-footer">
          <div className="event-price-container">
            <span className="price-label">Price</span>
            <span className="price-value">{price}</span>
          </div>

          <div className="event-actions">
            <button className="book-now-btn">Book Now</button>
            <div className="tickets-available">
              <span className="ticket-count">{ticketsAvailable}</span>
              <span className="ticket-label">Available Tickets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Latest = () => {
  const events = [
    {
      image: "../images/event1.jpg",
      date: "14 March 2025",
      time: "04.00 PM",
      location: "Bellevue Beach Club, Colombo",
      type: "Outdoor Musical Concert",
      title: "SOIREE 3.0",
      price: "4000 LKR",
      ticketsAvailable: 45,
    },
    {
      image: "../images/event2.jpg",
      date: "15 March 2025",
      time: "06.00 PM",
      location: "Grand Arena, Kandy",
      type: "Live Theatre Performance",
      title: "Drama Night",
      price: "2500 LKR",
      ticketsAvailable: 30,
    },
    {
      image: "../images/event2.jpg",
      date: "15 March 2025",
      time: "06.00 PM",
      location: "Grand Arena, Kandy",
      type: "Live Theatre Performance",
      title: "Drama Night",
      price: "2500 LKR",
      ticketsAvailable: 30,
    },
    {
      image: "../images/event2.jpg",
      date: "15 March 2025",
      time: "06.00 PM",
      location: "Grand Arena, Kandy",
      type: "Live Theatre Performance",
      title: "Drama Night",
      price: "2500 LKR",
      ticketsAvailable: 30,
    },
    {
      image: "../images/event2.jpg",
      date: "15 March 2025",
      time: "06.00 PM",
      location: "Grand Arena, Kandy",
      type: "Live Theatre Performance",
      title: "Drama Night",
      price: "2500 LKR",
      ticketsAvailable: 30,
    },
    {
      image: "../images/event2.jpg",
      date: "15 March 2025",
      time: "06.00 PM",
      location: "Grand Arena, Kandy",
      type: "Live Theatre Performance",
      title: "Drama Night",
      price: "2500 LKR",
      ticketsAvailable: 30,
    },
    {
      image: "../images/event2.jpg",
      date: "15 March 2025",
      time: "06.00 PM",
      location: "Grand Arena, Kandy",
      type: "Live Theatre Performance",
      title: "Drama Night",
      price: "2500 LKR",
      ticketsAvailable: 30,
    },
    {
      image: "../images/event2.jpg",
      date: "15 March 2025",
      time: "06.00 PM",
      location: "Grand Arena, Kandy",
      type: "Live Theatre Performance",
      title: "Drama Night",
      price: "2500 LKR",
      ticketsAvailable: 30,
    },
    {
      image: "../images/event2.jpg",
      date: "15 March 2025",
      time: "06.00 PM",
      location: "Grand Arena, Kandy",
      type: "Live Theatre Performance",
      title: "Drama Night",
      price: "2500 LKR",
      ticketsAvailable: 30,
    },
    // Add more events as needed
  ];

  return (
    <div className="latest-events">
      <h1>Latest Events</h1>
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