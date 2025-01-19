import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile, changePassword } from '../../apis/Api';
import { useNavigate } from 'react-router-dom';
import './Profilepage.css';

const Profilepage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [formData, setFormData] = useState({
    nickname: '',
    email: ''
  });

  // Add password change states
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
          throw new Error('User data not found');
        }

        const response = await getUserProfile();
        if (response.data?.success && response.data?.data) {
          const profileData = response.data.data;
          setUserData(profileData);
          setFormData({
            nickname: profileData.nickname,
            email: profileData.email
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

    const updateDateTime = () => {
      const now = new Date();
      const formattedDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
      setCurrentDateTime(formattedDateTime);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
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
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      nickname: userData.nickname,
      email: userData.email
    });
    setError(null);
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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    try {
      setPasswordLoading(true);
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.data.success) {
        setPasswordSuccess('Password changed successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Hide password section after success
        setTimeout(() => {
          setShowPasswordSection(false);
          setPasswordSuccess('');
        }, 2000);
      }
    } catch (error) {
      setPasswordError(error.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
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
          <div className="header-content">
            <h1>My Profile</h1>
            <div className="current-info">
              <p className="current-user">Current User's Login: {userData?.nickname}</p>
              <p className="current-datetime">Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {currentDateTime}</p>
            </div>
          </div>
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
          <>
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

            {/* Password Change Section */}
            <div className="password-section">
              <div className="section-header">
                <h2>Password Settings</h2>
                <button 
                  className="toggle-password-button"
                  onClick={() => setShowPasswordSection(!showPasswordSection)}
                >
                  {showPasswordSection ? 'Hide' : 'Change Password'}
                </button>
              </div>

              {showPasswordSection && (
                <form onSubmit={handlePasswordSubmit} className="password-form">
                  {passwordError && (
                    <div className="error-message">
                      <p>{passwordError}</p>
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="success-message">
                      <p>{passwordSuccess}</p>
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      disabled={passwordLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength="6"
                      disabled={passwordLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength="6"
                      disabled={passwordLoading}
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="save-button"
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? 'Updating Password...' : 'Update Password'}
                    </button>
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={() => {
                        setShowPasswordSection(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                        setPasswordError('');
                      }}
                      disabled={passwordLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profilepage;