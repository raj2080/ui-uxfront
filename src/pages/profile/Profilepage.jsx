import React from 'react';

const ProfilePage = ({ user }) => {
  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h2>Profile</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <img src={user.avatar} alt="Profile" className="img-fluid rounded-circle" />
            </div>
            <div className="col-md-8">
              <h3>{user.name}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Bio:</strong> {user.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;