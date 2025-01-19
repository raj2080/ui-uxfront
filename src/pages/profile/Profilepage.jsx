import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../../apis/Api';
import { useNavigate } from 'react-router-dom';
import './Profilepage.css';

const Profilepage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    email: ''
  });
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
          setFormData({
            nickname: response.data.nickname,
            email: response.data.email
          });
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Could not load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      nickname: userData.nickname,
      email: userData.email
    });
    setError(null); // Clear any existing errors
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      nickname: userData.nickname,
      email: userData.email
    });
    setError(null); // Clear any existing errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await updateUserProfile(formData);
      
      if (response.data.success) {
        setUserData(response.data.user);
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading && !userData) {
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
          {!isEditing && (
            <button className="edit-button" onClick={handleEdit}>
              Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {userData && (
          <div className="profile-details">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="nickname">Nickname</label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    required
                    maxLength="10"
                    pattern="^[a-zA-Z0-9_]+$"
                    title="Nickname can only contain letters, numbers, and underscores"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="save-button"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profilepage;