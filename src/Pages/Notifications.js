import React, { useState } from "react";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { type: "success", message: "Income added successfully!" },
    { type: "warning", message: "You are nearing your Food budget limit." },
    { type: "error", message: "Overspent on Shopping category!" },
    { type: "info", message: "New report is available for download." },
  ]);

  const addNotification = (type, message) => {
    setNotifications([{ type, message }, ...notifications]);
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="notifications-container">
      <h2>🔔 Notifications</h2>

      {/* Add new notification buttons */}
      <div className="notif-buttons">
        <button onClick={() => addNotification("success", "Income saved!")}>
          + Success
        </button>
        <button onClick={() => addNotification("warning", "Budget running low!")}>
          + Warning
        </button>
        <button onClick={() => addNotification("error", "Overspent detected!")}>
          + Error
        </button>
        <button onClick={() => addNotification("info", "New update available.")}>
          + Info
        </button>
      </div>

      {/* Notifications List */}
      <div className="notif-list">
        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          notifications.map((notif, index) => (
            <div key={index} className={`notif-card ${notif.type}`}>
              <span className="notif-icon">
                {notif.type === "success" && "✅"}
                {notif.type === "warning" && "⚠️"}
                {notif.type === "error" && "❌"}
                {notif.type === "info" && "ℹ️"}
              </span>
              <span className="notif-text">{notif.message}</span>
              <span className="notif-badge">New</span>
            </div>
          ))
        )}
      </div>

      {/* Clear All Button */}
      {notifications.length > 0 && (
        <button className="clear-btn" onClick={clearAll}>
          🗑 Clear All
        </button>
      )}
    </div>
  );
};

export default Notifications;
