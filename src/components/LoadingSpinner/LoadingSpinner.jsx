// src/components/LoadingSpinner/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ fullScreen }) => {
  return (
    <div className={`loading-spinner-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="loading-spinner">
        <div className="spinner-border" />
        <div className="spinner-border" />
      </div>
      <div className="loading-text">Loading...</div>
    </div>
  );
};

export default LoadingSpinner;