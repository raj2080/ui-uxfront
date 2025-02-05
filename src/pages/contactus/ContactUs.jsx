import React, { useState } from 'react';
import { submitContactUs } from '../../apis/Api'; // Ensure the path is correct
import './ContactUs.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        phonenumber: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
    });

    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        const phoneRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@gmail\.com$/;

        // Email validation
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email address. It must be a valid @gmail.com email.';
        }

        // Phone number validation
        if (!phoneRegex.test(formData.phonenumber)) {
            newErrors.phonenumber = 'Phone number must be exactly 10 digits.';
        }

        // Subject word limit validation
        const subjectWords = formData.subject.trim().split(/\s+/).length;
        if (subjectWords > 15) {
            newErrors.subject = 'Subject must be within 15 words.';
        }

        // Message word limit validation
        const messageWords = formData.message.trim().split(/\s+/).length;
        if (messageWords > 200) {
            newErrors.message = 'Message must be within 200 words.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await submitContactUs(formData);
            setSubmitted(true);

            // Reset form after 3 seconds
            setTimeout(() => {
                setSubmitted(false);
                setFormData({
                    name: '',
                    phonenumber: '',
                    email: '',
                    subject: '',
                    message: '',
                    category: 'general'
                });
                setErrors({});
            }, 3000);
        } catch (error) {
            console.error('Failed to submit form', error);
        }
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
                    <p>Dillibazar, Kathmandu</p>
                    <p>Nepal</p>
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
                                        placeholder="your@gmail.com"
                                    />
                                    {errors.email && <p className="error-message">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="phonenumber">Phone Number</label>
                                <input
                                    type="text"
                                    id="phonenumber"
                                    name="phonenumber"
                                    value={formData.phonenumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your phone number"
                                />
                                {errors.phonenumber && <p className="error-message">{errors.phonenumber}</p>}
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
                                {errors.subject && <p className="error-message">{errors.subject}</p>}
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
                                {errors.message && <p className="error-message">{errors.message}</p>}
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
                    <a href="https://x.com/" className="social-icon"><i className="fab fa-twitter"></i></a>
                    <a href="https://www.facebook.com/" className="social-icon"><i className="fab fa-facebook"></i></a>
                    <a href="https://www.instagram.com/" className="social-icon"><i className="fab fa-instagram"></i></a>
                    <a href="https://www.linkedin.com/" className="social-icon"><i className="fab fa-linkedin"></i></a>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;