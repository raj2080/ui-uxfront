import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '../../apis/Api';
import './Resetpassword.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    const validatePassword = (password) => {
        const errors = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        setPasswordErrors(errors);
        return Object.values(errors).every(Boolean);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'newPassword') {
            validatePassword(value);
        }

        setError('');
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!formData.newPassword || !formData.confirmPassword) {
            setError('Both password fields are required');
            return;
        }

        if (!validatePassword(formData.newPassword)) {
            setError('Password does not meet all requirements');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const result = await resetPasswordApi(token, formData.newPassword);
            
            if (result.success) {
                setSuccess(true);
                setFormData({
                    newPassword: '',
                    confirmPassword: ''
                });
                navigate('/login', { 
                    state: { 
                        message: 'Password reset successful! Please login with your new password.',
                        type: 'success'
                    }
                });
            }
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
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
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Enter your new password"
                            className={`form-input ${error ? 'error' : ''}`}
                            autoComplete="new-password"
                        />
                        <div className="password-requirements">
                            <p>Password must contain:</p>
                            <ul>
                                <li className={passwordErrors.length ? 'valid' : 'invalid'}>
                                    At least 8 characters
                                </li>
                                <li className={passwordErrors.uppercase ? 'valid' : 'invalid'}>
                                    At least one uppercase letter
                                </li>
                                <li className={passwordErrors.lowercase ? 'valid' : 'invalid'}>
                                    At least one lowercase letter
                                </li>
                                <li className={passwordErrors.number ? 'valid' : 'invalid'}>
                                    At least one number
                                </li>
                                <li className={passwordErrors.special ? 'valid' : 'invalid'}>
                                    At least one special character (!@#$%^&*(),.?":{}|&lt;&gt;)
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            <i className="fas fa-lock"></i>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your new password"
                            className={`form-input ${error ? 'error' : ''}`}
                            autoComplete="new-password"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">Password reset successful! Redirecting to login...</div>}

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
            </div>
        </div>
    );
};

export default ResetPassword;