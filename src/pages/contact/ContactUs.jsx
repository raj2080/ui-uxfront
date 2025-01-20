// ContactUs.jsx
import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        console.log('Form submitted:', formData);
        setSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
            setSubmitted(false);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                category: 'general'
            });
        }, 3000);
    };

    return (
        <div className="contact-page">
            {/* Header Section */}
            <div className="contact-header">
                <h1>Contact Us</h1>
                <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </div>

            {/* Quick Contact Options */}
            <div className="quick-contact">
                <div className="contact-card">
                    <i className="fas fa-envelope"></i>
                    <h3>Email Us</h3>
                    <p>support@confesshere.com</p>
                    <p>business@confesshere.com</p>
                </div>
                <div className="contact-card">
                    <i className="fas fa-clock"></i>
                    <h3>Operating Hours</h3>
                    <p>Monday - Friday</p>
                    <p>9:00 AM - 6:00 PM UTC</p>
                </div>
                <div className="contact-card">
                    <i className="fas fa-map-marker-alt"></i>
                    <h3>Location</h3>
                    <p>123 Confession Street</p>
                    <p>Digital Valley, Web 12345</p>
                </div>
            </div>

            {/* Contact Form Section */}
            <div className="contact-form-section">
                <div className="form-container">
                    <h2>Send Us a Message</h2>
                    {submitted ? (
                        <div className="success-message">
                            <i className="fas fa-check-circle"></i>
                            <p>Thank you for your message! We'll get back to you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="general">General Inquiry</option>
                                    <option value="support">Technical Support</option>
                                    <option value="billing">Billing Question</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="report">Report an Issue</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="What is this about?"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your message here..."
                                    rows="5"
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-button">
                                <i className="fas fa-paper-plane"></i> Send Message
                            </button>
                        </form>
                    )}
                </div>

                {/* FAQ Section */}
                <div className="faq-section">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-list">
                        <div className="faq-item">
                            <h3>How do I reset my password?</h3>
                            <p>Click on the "Forgot Password" link on the login page and follow the instructions sent to your email.</p>
                        </div>
                        <div className="faq-item">
                            <h3>How can I delete my confession?</h3>
                            <p>Go to your profile, find the confession, and click the delete button. Note that some confessions cannot be deleted after 24 hours.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Is my confession anonymous?</h3>
                            <p>Yes! All confessions are posted anonymously by default unless you choose to reveal your identity.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Links */}
            <div className="social-links">
                <h3>Connect With Us</h3>
                <div className="social-icons">
                    <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                    <a href="#" className="social-icon"><i className="fab fa-facebook"></i></a>
                    <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                    <a href="#" className="social-icon"><i className="fab fa-linkedin"></i></a>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;