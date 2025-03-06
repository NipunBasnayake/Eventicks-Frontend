import React, { useState } from 'react';
import './searcharea.css';

export default function SearchArea() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    console.log('Searching for:', searchQuery);
  };
  
  return (
    <div className="search-hero-section">
      <div className="v5_102">
        <div className="v4_14"></div>
        <div className="hero-content">
          <h1 className="v5_55">Let's Book Your Event</h1>
          <p className="v5_56">Book live events and discover concerts, events, theater and more.</p>
          
          <form onSubmit={handleSearchSubmit} className="v5_74">
            <div className="v5_73">
              <input 
                type="text" 
                className="v5_57 search-input" 
                placeholder="Search for Events, Artists, Venues"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search"
              />
            </div>
            <div className="v5_72">
              <button type="submit" className="v5_64 search-button">
                <div className="v5_71">
                  <span className="v5_67">Search</span>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}