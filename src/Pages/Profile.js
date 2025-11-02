// src/Pages/Profile.js
import React, { useState, useContext, useRef } from "react";
import { GlobalContext } from "./GlobalContext";
import "./Profile.css";
import { FiArrowLeft, FiCamera } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(GlobalContext);

  const storedUser = JSON.parse(localStorage.getItem("userData")) || {
    name: user?.username || "User",
    email: "example@email.com",
    phone: "",
    address: "",
    avatar: "",
  };

  const [formData, setFormData] = useState(storedUser);
  const [editing, setEditing] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const fileRef = useRef();

  // Save profile to localStorage
  const saveProfile = () => {
    localStorage.setItem("userData", JSON.stringify(formData));
    setUser({ username: formData.name });
    setEditing(false);
  };

  // Avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData({ ...formData, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // Save Password
  const handlePasswordSave = () => {
    if (passwords.new !== passwords.confirm) {
      alert("New password & confirm password must match!");
      return;
    }

    // ✅ Save or send to backend here
    console.log("Password updated:", passwords);

    setPasswords({ current: "", new: "", confirm: "" });
    setShowPasswordModal(false);
    alert("Password changed successfully!");
  };

  return (
    <div className="profile-container">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        <FiArrowLeft /> Back
      </button>

      <h2>👤 Profile</h2>

      <div className="profile-card">
        {/* Avatar */}
        <div className="profile-avatar-wrapper">
          <img
            src={
              formData.avatar ||
              `https://ui-avatars.com/api/?name=${formData.name}`
            }
            className="profile-avatar"
            alt="avatar"
          />

          <div className="edit-avatar" onClick={() => fileRef.current.click()}>
            <FiCamera />
          </div>

          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            onChange={handleAvatarUpload}
            style={{ display: "none" }}
          />
        </div>

        {/* FORM */}
        <div className="profile-fields">
          <label>Name</label>
          <input
            disabled={!editing}
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <label>Email</label>
          <input
            disabled={!editing}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <label>Phone</label>
          <input
            disabled={!editing}
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          <label>Address</label>
          <input
            disabled={!editing}
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        {/* Change Password */}
        <div className="password-section">
          <button
            className="outline-btn"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>
        </div>

        {/* Buttons */}
        {!editing ? (
          <button className="primary-btn" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        ) : (
          <button className="primary-btn" onClick={saveProfile}>
            Save
          </button>
        )}
      </div>

      {/* ✅ PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="password-modal-overlay">
          <div className="password-modal">
            <h3>Change Password</h3>

            <input
              type="password"
              placeholder="Current Password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
            />

            <div className="modal-btns">
              <button className="save-btn" onClick={handlePasswordSave}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
