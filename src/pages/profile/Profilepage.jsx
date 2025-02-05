import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile, changePassword, getUserConfessions, deleteConfession } from '../../apis/Api';
import { useNavigate } from 'react-router-dom';
import './Profilepage.css';
import { toast } from 'react-toastify'; // Assuming you are using react-toastify for notifications

const Profilepage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [activeView, setActiveView] = useState('profile');
  const [formData, setFormData] = useState({
    nickname: '',
    email: ''
  });

  // Password change states
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Confessions states
  const [confessions, setConfessions] = useState([]);
  const [confessionsLoading, setConfessionsLoading] = useState(false);
  
  const navigate = useNavigate();

  // Fetch confessions function
  const fetchConfessions = async () => {
    try {
      setConfessionsLoading(true);
      const response = await getUserConfessions(); // Using your existing API function
      if (response.data?.success) {
        setConfessions(response.data.confessions);
      }
    } catch (error) {
      console.error('Failed to fetch confessions:', error);
    } finally {
      setConfessionsLoading(false);
    }
  };

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

    // Update datetime in exact format: YYYY-MM-DD HH:MM:SS
    const updateDateTime = () => {
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, '0');
      const day = String(now.getUTCDate()).padStart(2, '0');
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      
      setCurrentDateTime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  // Your existing handlers...
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

  const handleDeleteClick = async (confessionId) => {
    try {
      await deleteConfession(confessionId);
      setConfessions(confessions.filter(confession => confession._id !== confessionId));
      toast.success('Confession deleted successfully.');
    } catch (error) {
      console.error('Failed to delete confession:', error);
      toast.error('Failed to delete confession.');
    }
  };

  const handleEditClick = (confession) => {
    navigate(`/edit-confession/${confession._id}`, { state: { confession } });
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
      <div className="main-layout">
        <div className="main-content">
          {activeView === 'profile' ? (
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
          ) : (
            <div className="profile-container">
              <div className="profile-header">
                <div className="header-content">
                  <h1>Your Confessions</h1>
                  <div className="current-info">
                    <p className="current-user">Current User's Login: {userData?.nickname}</p>
                    <p className="current-datetime">Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {currentDateTime}</p>
                  </div>
                </div>
              </div>
        
              <div className="confessions-list">
                {confessions && confessions.length > 0 ? (
                  confessions.map((confession) => (
                    <div key={confession._id} className="confession-card">
                      {confession.imageUrl && (
                        <img 
                          src={`http://localhost:5000/${confession.imageUrl.replace(/^C:\\uiux development\\backend\\/, '')}`} 
                          alt="Confession" 
                          className="confession-image" 
                        />
                      )}
                      <div className="confession-divider"></div>
                      <h3 className="confession-title">{confession.title}</h3>
                      <p className="confession-text">{confession.content}</p>
                      <div className="confession-meta">
                        <span className="confession-category">Category: {confession.category}</span>
                        <span className="confession-date">
                          Posted: {new Date(confession.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="confession-actions">
                        <button
                          onClick={() => handleEditClick(confession)}
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(confession._id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-confessions">No confessions yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="right-sidebar">
          <button
            className={`sidebar-button ${activeView === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveView('profile')}
          >
            Profile Info
          </button>
          <button
            className={`sidebar-button ${activeView === 'posts' ? 'active' : ''}`}
            onClick={() => {
              setActiveView('posts');
              fetchConfessions();
            }}
          >
            Your Confessions
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profilepage;