// src/Pages/Settings.js
import React, { useState, useEffect } from "react";
import "./Settings.css";

const themes = [
  { name: "light", symbol: "☀️" },
  { name: "dark", symbol: "🌙" },
  { name: "blue", symbol: "🔵" },
  { name: "purple", symbol: "🟣" },
  { name: "green", symbol: "🟢" },
  { name: "pink", symbol: "💖" },
  { name: "orange", symbol: "🟠" },
  { name: "aqua", symbol: "💧" },
  { name: "sunset", symbol: "🌅" },
  { name: "rainbow", symbol: "🌈" },
];

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState("light");

  // Load saved settings
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    if (savedTheme) setTheme(savedTheme);
    setDarkMode(savedDarkMode);
  }, []);

  // Save settings whenever changed
  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("darkMode", darkMode);
  }, [theme, darkMode]);

  return (
    <div className={`settings-container ${theme}-theme ${darkMode ? "dark" : ""}`}>
      <h2>⚙️ Settings</h2>

      <div className="settings-card">
        {/* Dark Mode */}
        <div className="setting-item">
          <span>Dark Mode</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Theme Selector */}
        <div className="setting-item">
          <span>Theme</span>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            {themes.map((t) => (
              <option key={t.name} value={t.name}>
                {t.symbol} {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          className="save-btn"
          onClick={() => alert("✅ Settings saved successfully!")}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
