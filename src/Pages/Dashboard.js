// src/Pages/Dashboard.js
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
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
import UserMenu from "../Pages/UserMenu";

const Dashboard = () => {
  // Centralized states
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]); // ✅ array, not number
  const [budgets, setBudgets] = useState([]);
  const [savings, setSavings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Helpers
  const addExpense = (expense) => {
    setExpenses((prev) => [...prev, expense]);
    setNotifications((prev) => [
      ...prev,
      {
        type: "warning",
        message: `Expense added: ${expense.category} (₹${expense.amount})`,
      },
    ]);
  };

  const addIncome = (newIncome) => {
    // ✅ expect {source, amount, date}
    setIncome((prev) => [...prev, newIncome]);
    setNotifications((prev) => [
      ...prev,
      {
        type: "success",
        message: `Income added: ${newIncome.source} (₹${newIncome.amount})`,
      },
    ]);
  };

  const addBudget = (budget) => {
    setBudgets((prev) => [...prev, budget]);
  };

  const addSaving = (saving) => {
    setSavings((prev) => [...prev, saving]);
    setNotifications((prev) => [
      ...prev,
      {
        type: "info",
        message: `Saving added: ${saving.goal} (₹${saving.amount})`,
      },
    ]);
  };

  // ✅ Calculate totals
  const totalIncome = income.reduce(
    (acc, inc) => acc + parseFloat(inc.amount || 0),
    0
  );
  const totalExpenses = expenses.reduce(
    (acc, exp) => acc + parseFloat(exp.amount || 0),
    0
  );
  const balance = totalIncome - totalExpenses;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">💰 ExpenseTracker</h2>
        <nav>
          <Link to="/dashboard" className="sidebar-link">
            <FiHome /> Dashboard
          </Link>
          <Link to="/add-expense" className="sidebar-link">
            <FiPlusCircle /> Add Expense
          </Link>
          <Link to="/income" className="sidebar-link">
            <FiDollarSign /> Income
          </Link>
          <Link to="/budgets" className="sidebar-link">
            <FiClipboard /> Budgets
          </Link>
          <Link to="/savings" className="sidebar-link">
            <FiDollarSign /> Savings
          </Link>
          <Link to="/reports" className="sidebar-link">
            <FiBarChart2 /> Reports
          </Link>
          <Link to="/notifications" className="sidebar-link">
            <FiBell /> Notifications
          </Link>
          <Link to="/settings" className="sidebar-link">
            <FiSettings /> Settings
          </Link>
          <Link to="/login" className="sidebar-link logout">
            <FiLogOut /> Logout
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="navbar">
          <div className="navbar-left">
            <h3>Welcome back, Uday! 👋</h3>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
          <div className="navbar-right">
            <UserMenu />
          </div>
        </header>

        {/* ✅ Summary Section */}
        <section className="summary-cards">
          <div className="card">
            <h4>Total Income</h4>
            <p>₹{totalIncome}</p>
          </div>
          <div className="card">
            <h4>Total Expenses</h4>
            <p>₹{totalExpenses}</p>
          </div>
          <div className="card">
            <h4>Balance</h4>
            <p>₹{balance}</p>
          </div>
        </section>

        {/* Outlet with context */}
        <Outlet
          context={{
            expenses,
            setExpenses,
            addExpense,
            income,
            setIncome,
            addIncome,
            budgets,
            setBudgets,
            addBudget,
            savings,
            setSavings,
            addSaving,
            notifications,
            setNotifications,
          }}
        />
      </main>
    </div>
  );
};

export default Dashboard;
