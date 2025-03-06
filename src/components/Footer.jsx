import React from 'react';
import './footer.css';

import { FaFacebookF, FaInstagram, FaWhatsapp, FaLinkedinIn } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h2 className="footer-title">Eventicks</h2>
                    <p className="footer-description">
                        Eventicks is one of the fast-growing ticket marketplaces that includes events of music,
                        sport, art, theatre, and more. It is capable of accommodating events of all types, sizes,
                        and complexities with state-of-the-art technology.
                    </p>
                    <div className="social-icons">
                        <a href="#" className="social-icon"><FaFacebookF /></a>
                        <a href="#" className="social-icon"><FaInstagram /></a>
                        <a href="#" className="social-icon"><FaWhatsapp /></a>
                        <a href="#" className="social-icon"><FaLinkedinIn /></a>
                        <a href="mailto:hello@eventicks.com" className="social-icon"><MdEmail /></a>
                    </div>
                </div>

                <div className="footer-section sitemap">
                    <h3 className="section-title">Site Map</h3>
                    <ul className="footer-links">
                        <li><a href="#">Events</a></li>
                        <li><a href="#">Theater</a></li>
                        <li><a href="#">Sports</a></li>
                        <li><a href="#">Leisure</a></li>
                        <li><a href="#">Other</a></li>
                    </ul>
                </div>

                <div className="footer-section faq">
                    <h3 className="section-title">FAQ</h3>
                    <ul className="footer-links">
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms & Conditions</a></li>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h3 className="section-title">Contact</h3>
                    <div className="contact-info">
                        <div className="contact-item">
                            <MdPhone className="contact-icon" />
                            <span>071 000 0000 | 077 000 0000</span>
                        </div>
                        <div className="contact-item">
                            <MdLocationOn className="contact-icon" />
                            <span>No 261/A/3/5, Galle Road, Panadura</span>
                        </div>
                        <div className="contact-item">
                            <MdEmail className="contact-icon" />
                            <span>hello@eventicks.com</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© Copyright 2025 Eventicks Private Limited | All Rights Reserved</p>
            </div>
        </footer>
    );
}