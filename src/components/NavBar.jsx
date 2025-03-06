import React, { useState } from "react";
import "./navbar.css";

export default function NavBar() {
    const [dropdown, setDropdown] = useState(null);

    const toggleDropdown = (menu) => {
        setDropdown(dropdown === menu ? null : menu);
    };

    return (
        <nav className="navbar">
            <div className="logo">Even<span class="topicTicks">ticks</span></div>
            <ul className="nav-links">
                <li className="dropdown-container" onMouseEnter={() => toggleDropdown("events")} onMouseLeave={() => setDropdown(null)}>
                    <a href="#">Events</a>
                    {dropdown === "events" && (
                        <ul className="dropdown-menu">
                            <li><a href="#">Concerts</a></li>
                            <li><a href="#">Festivals</a></li>
                            <li><a href="#">Workshops</a></li>
                        </ul>
                    )}
                </li>
                <li className="dropdown-container" onMouseEnter={() => toggleDropdown("theater")} onMouseLeave={() => setDropdown(null)}>
                    <a href="#">Theater</a>
                    {dropdown === "theater" && (
                        <ul className="dropdown-menu">
                            <li><a href="#">Drama</a></li>
                            <li><a href="#">Musicals</a></li>
                            <li><a href="#">Comedy</a></li>
                        </ul>
                    )}
                </li>
                <li className="dropdown-container" onMouseEnter={() => toggleDropdown("sports")} onMouseLeave={() => setDropdown(null)}>
                    <a href="#">Sports</a>
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
                <span className="register">Register</span>
                <a href="#" className="sign-in">Sign In</a>
            </div>
        </nav>
    );
}