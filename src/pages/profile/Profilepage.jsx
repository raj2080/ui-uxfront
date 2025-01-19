// src/pages/profile/Profilepage.jsx
import React, { useEffect, useState } from 'react';
import { getUserProfile, logout } from '../../apis/Api';
import { useNavigate } from 'react-router-dom';
import './Profilepage.css';

const Profilepage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get the stored user data
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
          throw new Error('User data not found');
        }

        const response = await getUserProfile();
        if (response.data) {
          setUserData(response.data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Could not load profile data. Please try again.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
         
        </div>

        {userData && (
          <div className="profile-details">
            <div className="profile-info">
              <div className="info-group">
                <label>Nickname</label>
                <p>{userData.nickname}</p>
              </div>

              <div className="info-group">
                <label>Email</label>
                <p>{userData.email}</p>
              </div>


              <div className="info-group">
                <label>Last Updated</label>
                <p>{formatDate(userData.updatedAt)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profilepage;