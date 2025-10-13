// src/pages/Reports.js
import React, { useState } from "react";
import "./Reports.css"; // separate style for Reports
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Reports = () => {
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [spent, setSpent] = useState("");

  // ✅ Add new record
  const addBudget = (e) => {
    e.preventDefault();
    if (!category || !limit || !spent) return;

    const newBudget = {
      category,
      limit: parseFloat(limit),
      spent: parseFloat(spent),
    };

    setBudgets([...budgets, newBudget]);
    setCategory("");
    setLimit("");
    setSpent("");
  };

  // ✅ Emoji for categories
  const getCategoryEmoji = (cat) => {
    const map = {
      food: "🍔",
      travel: "✈️",
      shopping: "🛒",
      bills: "💡",
      entertainment: "🎉",
      rent: "🏠",
    };
    return map[cat.toLowerCase()] || "💰";
  };

  // ✅ Totals & warnings
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalPlanned = budgets.reduce((sum, b) => sum + b.limit, 0);
  const overSpent = budgets.filter((b) => b.spent > b.limit);

  // ✅ Different color palette for Reports
  const COLORS = [
    "#FF6B6B", // Coral Red
    "#4ECDC4", // Teal
    "#FFD93D", // Bright Yellow
    "#1A535C", // Dark Teal
    "#FF9F1C", // Orange
    "#6A4C93", // Purple
  ];

  return (
    <div className="reports-container">
      <h2>📊 Expense Reports</h2>
      <p className="subtitle">Track and analyze your spending patterns</p>

      {/* Add Record Form */}
      <form className="budget-form" onSubmit={addBudget}>
        <label>Category</label>
        <input
          type="text"
          placeholder="e.g., Food, Rent, Shopping"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <label>Budget Limit</label>
        <input
          type="number"
          placeholder="e.g., 5000"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />

        <label>Amount Spent</label>
        <input
          type="number"
          placeholder="e.g., 2500"
          value={spent}
          onChange={(e) => setSpent(e.target.value)}
        />

        <button type="submit" className="add-budget-btn">
          + Add Record
        </button>
      </form>

      {/* Records List */}
      <div className="recent-budgets">
        <h3>📌 Recent Records</h3>
        {budgets.length === 0 ? (
          <p>No records added yet.</p>
        ) : (
          budgets.map((budget, index) => {
            const percentage = Math.min(
              (budget.spent / budget.limit) * 100,
              100
            );
            const isOverBudget = budget.spent >= budget.limit;
            const remaining = budget.limit - budget.spent;

            return (
              <div key={index} className={`budget-item color-${index % 6}`}>
                <div className="budget-info">
                  <span className="budget-category">
                    {getCategoryEmoji(budget.category)} {budget.category}
                  </span>
                  <span className="budget-amount">
                    ₹{budget.spent} / ₹{budget.limit}
                  </span>
                </div>

                <div className="progress-bar">
                  <div
                    className={`progress-fill ${
                      isOverBudget ? "over" : "under"
                    }`}
                    style={{
                      width: `${percentage}%`,
                      transition: "width 0.6s ease",
                    }}
                  ></div>
                </div>

                <span
                  className={`percentage ${
                    isOverBudget ? "over-text" : "under-text"
                  }`}
                >
                  {isOverBudget
                    ? `⚠ Over Budget (${Math.round(percentage)}%)`
                    : `${Math.round(percentage)}% Used`}
                </span>

                <div
                  className={`remaining ${
                    isOverBudget ? "remaining-over" : "remaining-ok"
                  }`}
                >
                  {isOverBudget
                    ? `Exceeded by ₹${Math.abs(remaining)}`
                    : `Remaining: ₹${remaining}`}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Totals */}
      {budgets.length > 0 && (
        <div className="total-budget">
          <p>
            📝 Total Planned: <span>₹{totalPlanned}</span>
          </p>
          <p>
            💸 Total Spent: <span>₹{totalSpent}</span>
          </p>
        </div>
      )}

      {/* Alerts */}
      {overSpent.length > 0 && (
        <div className="alert-box">
          🚨 Warning: {overSpent.length} category(s) exceeded!
        </div>
      )}

      {/* Charts */}
      {budgets.length > 0 && (
        <div className="charts-section">
          <h3>📈 Visual Analysis</h3>
          <div className="charts-wrapper">
            <ResponsiveContainer width="50%" height={250}>
              <PieChart>
                <Pie
                  data={budgets}
                  dataKey="spent"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {budgets.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="50%" height={250}>
              <BarChart data={budgets}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="limit" fill="#4ECDC4" name="Budget Limit" />
                <Bar dataKey="spent" fill="#FF6B6B" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
