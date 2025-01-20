
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Confess Here</h3>
                    <p>Share your thoughts anonymously and connect with others through authentic confessions.</p>
                    <div className="social-links">
                        <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                        <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                        <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/communities">Communities</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Communities</h4>
                    <ul>
                        <li><Link to="/communities/work-life">Work Life</Link></li>
                        <li><Link to="/communities/student-life">Student Life</Link></li>
                        <li><Link to="/communities/relationships">Relationships</Link></li>
                        <li><Link to="/communities/food">Food & Cooking</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Support</h4>
                    <ul>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms of Service</Link></li>
                        <li><Link to="/help">Help Center</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} Confess Here. All rights reserved.</p>
                <div className="footer-bottom-links">
                    <Link to="/privacy">Privacy</Link>
                    <Link to="/terms">Terms</Link>
                    <Link to="/cookies">Cookies</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;