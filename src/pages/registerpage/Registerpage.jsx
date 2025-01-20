// Registerpage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupApi } from "../../apis/Api";
import './Registerpage.css';

const Registerpage = () => {
  const [nickname, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypepassword, setRetypePassword] = useState('');
  const [loading, setLoading] = useState(false);

  // States for error messages
  const [nicknameError, setNickNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [retypepasswordError, setRetypePasswordError] = useState('');

  const navigate = useNavigate();

  const handleNickname = (e) => {
    setNickName(e.target.value);
    setNickNameError('');
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const handleRetypepassword = (e) => {
    setRetypePassword(e.target.value);
    setRetypePasswordError('');
  };

  const validate = () => {
    let isValid = true;

    if (nickname.trim() === '') {
      setNickNameError("Nickname is Required!");
      isValid = false;
    }

    if (email.trim() === '') {
      setEmailError("Email is Required!");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (password.trim() === '') {
      setPasswordError("Password is Required!");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    }

    if (retypepassword.trim() === '') {
      setRetypePasswordError("Confirm password is required");
      isValid = false;
    }

    if (retypepassword.trim() !== password.trim()) {
      setRetypePasswordError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      const response = await signupApi({ 
        nickname,
        email,
        password,
        retypepassword
      });

      if (response.data.success) {
        // Clear form
        setNickName('');
        setEmail('');
        setPassword('');
        setRetypePassword('');
        
        // Show success message and redirect
        alert("Registration successful! Please login.");
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || "Registration failed";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Please fill in the form to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="nickname">
              <i className="fas fa-user"></i>
              Nickname
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={handleNickname}
              placeholder="Enter your nickname"
              className={`form-input ${nicknameError ? 'error' : ''}`}
            />
            {nicknameError && <span className="error-text">{nicknameError}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmail}
              placeholder="Enter your email"
              className={`form-input ${emailError ? 'error' : ''}`}
            />
            {emailError && <span className="error-text">{emailError}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePassword}
              placeholder="Enter your password"
              className={`form-input ${passwordError ? 'error' : ''}`}
            />
            {passwordError && <span className="error-text">{passwordError}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="retypepassword">
              <i className="fas fa-lock"></i>
              Confirm Password
            </label>
            <input
              type="password"
              id="retypepassword"
              value={retypepassword}
              onChange={handleRetypepassword}
              placeholder="Confirm your password"
              className={`form-input ${retypepasswordError ? 'error' : ''}`}
            />
            {retypepasswordError && <span className="error-text">{retypepasswordError}</span>}
          </div>

          <button 
            type="submit" 
            className={`register-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Registerpage;