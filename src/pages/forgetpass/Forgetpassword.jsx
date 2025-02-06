import React, { useState } from 'react';
import { forgotPasswordApi } from '../../apis/Api';
import './Forgetpassword.css';

const Forgetpassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError('');
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Email is required');
            return;
        }

        try {
            setLoading(true);
            const response = await forgotPasswordApi(email);
            console.log("Forgot password API response:", response.data); // Log the response

            setMessage(response.data.message);
            setEmail('');
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgetpassword-container">
            <div className="forgetpassword-box">
                <div className="forgetpassword-header">
                    <h1>Forgot Password</h1>
                    <p>Please enter your email to receive a password reset link.</p>
                </div>

                <form onSubmit={handleSubmit} className="forgetpassword-form">
                    <div className="form-group">
                        <label htmlFor="email">
                            <i className="fas fa-envelope"></i>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email"
                            className={`form-input ${error ? 'error' : ''}`}
                        />
                        {error && <span className="error-text">{error}</span>}
                    </div>

                    <button 
                        type="submit" 
                        className={`forgetpassword-button ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </form>

                {message && <div className="success-message">{message}</div>}
            </div>
        </div>
    );
};

export default Forgetpassword;