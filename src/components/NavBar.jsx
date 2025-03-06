import React, { useState } from "react";
import "./navbar.css";

export default function NavBar() {
    const [dropdown, setDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleDropdown = (menu) => {
        setDropdown(dropdown === menu ? null : menu);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="logo">
                    Even<span className="logo-accent">ticks</span>
                </div>
                
                <div className="hamburger" onClick={toggleMobileMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                
                <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    <li 
                        className="dropdown-container" 
                        onMouseEnter={() => toggleDropdown("events")} 
                        onMouseLeave={() => setDropdown(null)}
                    >
                        <a href="#" className="dropdown-toggle">
                            Events
                            <svg className="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </a>
                        {dropdown === "events" && (
                            <ul className="dropdown-menu">
                                <li><a href="#">Concerts</a></li>
                                <li><a href="#">Festivals</a></li>
                                <li><a href="#">Workshops</a></li>
                            </ul>
                        )}
                    </li>
                    <li 
                        className="dropdown-container" 
                        onMouseEnter={() => toggleDropdown("theater")} 
                        onMouseLeave={() => setDropdown(null)}
                    >
                        <a href="#" className="dropdown-toggle">
                            Theater
                            <svg className="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </a>
                        {dropdown === "theater" && (
                            <ul className="dropdown-menu">
                                <li><a href="#">Drama</a></li>
                                <li><a href="#">Musicals</a></li>
                                <li><a href="#">Comedy</a></li>
                            </ul>
                        )}
                    </li>
                    <li 
                        className="dropdown-container" 
                        onMouseEnter={() => toggleDropdown("sports")} 
                        onMouseLeave={() => setDropdown(null)}
                    >
                        <a href="#" className="dropdown-toggle">
                            Sports
                            <svg className="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </a>
                        {dropdown === "sports" && (
                            <ul className="dropdown-menu">
                                <li><a href="#">Football</a></li>
                                <li><a href="#">Basketball</a></li>
                                <li><a href="#">Tennis</a></li>
                            </ul>
                        )}
                    </li>
                    <li><a href="#">Leisure</a></li>
                    <li><a href="#">Other</a></li>
                </ul>

                <div className="auth-buttons">
                    <button className="register-btn">Register</button>
                    <button className="sign-in-btn">Sign In</button>
                </div>
            </div>
        </nav>
    );
}