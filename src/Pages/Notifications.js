import React, { useContext } from "react";
import { GlobalContext } from "./GlobalContext";
import "./Notifications.css";

const Notifications = () => {
  const { notifications, setNotifications } = useContext(GlobalContext);

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="notifications-container">
      <h2>🔔 Notifications</h2>

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
