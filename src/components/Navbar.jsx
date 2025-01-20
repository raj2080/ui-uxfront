// Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    setIsOpen(false);
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        {/* Left Section */}
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            Confess <span className="brand-highlight">here</span>
          </Link>
        </div>

        {/* Center Section */}
        <div className="navbar-center">
          <div className={`search-container ${searchFocused ? 'focused' : ''}`}>
            <input
              type="search"
              placeholder="Search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="search-input"
            />
            <button className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          <div className="nav-links">
            <Link to="/communities" className="nav-link">
              <i className="fas fa-users"></i>
              Communities
            </Link>
            <Link to="/contact" className="nav-link">
              <i className="fas fa-envelope"></i>
              Contact us
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="auth-nav">
              <Link to="/profile" className="nav-link profile-link">
                <i className="fas fa-user"></i>
                Profile
              </Link>
              <button onClick={handleLogout} className="logout-button">
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="get-started-button">
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`navbar-toggler ${isOpen ? 'active' : ''}`} 
          onClick={toggleNavbar}
        >
          <span className="toggler-icon"></span>
          <span className="toggler-icon"></span>
          <span className="toggler-icon"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'show' : ''}`}>
        <div className="search-container">
          <input
            type="search"
            placeholder="Search..."
            className="search-input"
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <Link to="/communities" className="mobile-link">Communities</Link>
        <Link to="/contact" className="mobile-link">Contact us</Link>
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="mobile-link">Profile</Link>
            <button onClick={handleLogout} className="mobile-logout-button">Logout</button>
          </>
        ) : (
          <Link to="/login" className="mobile-get-started">Get Started</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;