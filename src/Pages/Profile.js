import React from "react";
import "./Profile.css";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Uday",
    email: "uday@example.com",
  };

  return (
    <div className="profile-container">
      <h2>👤 User Profile</h2>
      <div className="profile-card">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> Admin</p>
      </div>
    </div>
  );
};

export default Profile;
