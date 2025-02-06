import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '../../apis/Api';
import './Resetpassword.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
        setError('');
        setMessage('');
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setError('');
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            setError('Both password fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const response = await resetPasswordApi(token, newPassword);

            setMessage(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="resetpassword-container">
            <div className="resetpassword-box">
                <div className="resetpassword-header">
                    <h1>Reset Password</h1>
                    <p>Please enter your new password.</p>
                </div>

                <form onSubmit={handleSubmit} className="resetpassword-form">
                    <div className="form-group">
                        <label htmlFor="newPassword">
                            <i className="fas fa-lock"></i>
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter your new password"
                            className={`form-input ${error ? 'error' : ''}`}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            <i className="fas fa-lock"></i>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            placeholder="Confirm your new password"
                            className={`form-input ${error ? 'error' : ''}`}
                        />
                        {error && <span className="error-text">{error}</span>}
                    </div>

                    <button 
                        type="submit" 
                        className={`resetpassword-button ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                </form>

                {message && <div className="success-message">{message}</div>}
            </div>
        </div>
    );
};

export default ResetPassword;