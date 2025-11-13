// src/Pages/Dashboard.js
import React, { useContext, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiPlusCircle,
  FiBarChart2,
  FiLogOut,
  FiDollarSign,
  FiClipboard,
  FiBell,
  FiSettings,
} from "react-icons/fi";
import "./Dashboard.css";
import UserMenu from "./UserMenu";
import { GlobalContext } from "./GlobalContext";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(GlobalContext);

  // ✅ Load user info from localStorage when page refreshes
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser]);

  // Active link check
  const isActive = (path) => location.pathname === path;

  // ✅ Properly format name
  const formattedName = user?.username
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : "Guest";

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">
          💰 <span>Expense</span>Tracker
        </h2>
        <nav>
          <Link
            to="/dashboard"
            className={`sidebar-link ${isActive("/dashboard") ? "active" : ""}`}
          >
            <FiHome /> Dashboard
          </Link>
          <Link
            to="/dashboard/add-expense"
            className={`sidebar-link ${
              isActive("/dashboard/add-expense") ? "active" : ""
            }`}
          >
            <FiPlusCircle /> Add Expense
          </Link>
          <Link
            to="/dashboard/income"
            className={`sidebar-link ${
              isActive("/dashboard/income") ? "active" : ""
            }`}
          >
            <FiDollarSign /> Income
          </Link>
          <Link
            to="/dashboard/budgets"
            className={`sidebar-link ${
              isActive("/dashboard/budgets") ? "active" : ""
            }`}
          >
            <FiClipboard /> Budgets
          </Link>
          <Link
            to="/dashboard/savings"
            className={`sidebar-link ${
              isActive("/dashboard/savings") ? "active" : ""
            }`}
          >
            <FiDollarSign /> Savings
          </Link>
          <Link
            to="/dashboard/reports"
            className={`sidebar-link ${
              isActive("/dashboard/reports") ? "active" : ""
            }`}
          >
            <FiBarChart2 /> Reports
          </Link>
          <Link
            to="/dashboard/notifications"
            className={`sidebar-link ${
              isActive("/dashboard/notifications") ? "active" : ""
            }`}
          >
            <FiBell /> Notifications
          </Link>
          <Link
            to="/dashboard/settings"
            className={`sidebar-link ${
              isActive("/dashboard/settings") ? "active" : ""
            }`}
          >
            <FiSettings /> Settings
          </Link>
          <button onClick={handleLogout} className="sidebar-link logout">
            <FiLogOut /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="navbar">
          <div className="navbar-left">
            <h3>
              Welcome back, <span className="username">{formattedName}</span> 👋
            </h3>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
          <div className="navbar-right">
            <UserMenu />
          </div>
        </header>

        {/* Show Welcome Section only on /dashboard */}
        {location.pathname === "/dashboard" ? (
          <div className="dashboard-welcome">
            <h2 className="welcome-title">Track. Save. Grow. 🚀</h2>
            <p className="welcome-subtitle">
              Your all-in-one personal finance assistant to track expenses,
              manage income, set budgets, grow savings, and analyze reports.
            </p>

            {/* Quick Actions */}
            <div className="quick-actions">
              <Link to="/dashboard/add-expense" className="action-btn primary">
                ➕ Add Expense
              </Link>
              <Link to="/dashboard/reports" className="action-btn secondary">
                📊 View Reports
              </Link>
            </div>

            {/* Cards Section */}
            <div className="dashboard-cards">
              <div className="card animate">
                <h3>💸 Expenses</h3>
                <p>Stay on top of your spending habits and avoid overspending.</p>
              </div>
              <div className="card animate">
                <h3>💰 Income</h3>
                <p>Record your income sources and keep track of your monthly flow.</p>
              </div>
              <div className="card animate">
                <h3>📊 Budgets</h3>
                <p>Set smart budgets and achieve your financial goals faster.</p>
              </div>
              <div className="card animate">
                <h3>🏦 Savings</h3>
                <p>Build your savings steadily and secure your future.</p>
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Dashboard;