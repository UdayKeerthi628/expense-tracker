import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiTrendingUp,
  FiPieChart,
  FiShield,
  FiDollarSign,
} from "react-icons/fi";
import "./Home.css";

const Home = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      title: "Track Expenses",
      icon: <FiDollarSign />,
      description:
        "Our expense tracker lets you quickly add expenses, categorize them, and view summaries so you never lose track of your money.",
      color: "#43cea2",
    },
    {
      title: "Visual Reports",
      icon: <FiPieChart />,
      description:
        "Beautiful interactive charts and graphs give you a clear picture of your spending habits and help you manage money smarter.",
      color: "#185a9d",
    },
    {
      title: "Smart Insights",
      icon: <FiTrendingUp />,
      description:
        "Get AI-powered recommendations on where to cut costs and how to save more, tailored just for your lifestyle.",
      color: "#ff6ec7",
    },
    {
      title: "Secure & Private",
      icon: <FiShield />,
      description:
        "Your data is encrypted and secured with top-level security measures. You’re the only one who controls your finances.",
      color: "#ffb347",
    },
  ];

  const openModal = (feature) => {
    setSelectedFeature(feature);
  };

  const closeModal = () => {
    setSelectedFeature(null);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero">
        <h1 className="hero-title">Expense Tracker</h1>
        <p className="hero-subtitle">
          Take control of your money. Track, analyze, and save smarter with ease.
        </p>
        <p className="hero-quote">
          “A budget is telling your money where to go instead of wondering where
          it went.”
        </p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn-primary">
            Get Started
          </Link>
          <Link to="/login" className="btn-secondary">
            Login
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <div
              className="feature-card"
              key={index}
              onClick={() => openModal(feature)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description.substring(0, 60)}...</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedFeature && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal"
            style={{ borderTop: `6px solid ${selectedFeature.color}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-icon"
              style={{ color: selectedFeature.color }}
            >
              {selectedFeature.icon}
            </div>
            <h2>{selectedFeature.title}</h2>
            <p>{selectedFeature.description}</p>
            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
{/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
        <p className="made-with">Made with ❤️ Expense Tracker</p>
      </footer>
    </div>
  );
};

export default Home;
