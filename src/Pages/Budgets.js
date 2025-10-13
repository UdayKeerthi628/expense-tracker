// src/pages/Budgets.js
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom"; // ✅ Import global context
import "./Budgets.css";
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

const Budgets = () => {
  // ✅ Access global state
  const { budgets, setBudgets, expenses, settings, addNotification } =
    useOutletContext();

  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  const addBudget = (e) => {
    e.preventDefault();
    if (!category || !limit) return;

    // ✅ Calculate spent dynamically from expenses
    const spent = expenses
      .filter((exp) => exp.category.toLowerCase() === category.toLowerCase())
      .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

    const newBudget = {
      id: Date.now(),
      category,
      limit: parseFloat(limit),
      spent,
    };

    setBudgets([...budgets, newBudget]);

    // ✅ Trigger notification if already over budget
    if (spent > parseFloat(limit)) {
      addNotification(
        `⚠ ${category} budget exceeded by ${
          settings.currency
        }${spent - parseFloat(limit)}`
      );
    }

    setCategory("");
    setLimit("");
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

  // ✅ Total spent across all budgets
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  // ✅ Find overspending category
  const overSpent = budgets.filter((b) => b.spent > b.limit);

  // ✅ Chart Colors
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#B620E0",
    "#FF4D6D",
  ];

  return (
    <div className="budget-container">
      <h2>💰 Set Your Budget</h2>
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

        <button type="submit" className="add-budget-btn">
          + Add Budget
        </button>
      </form>

      {/* Recent Budgets */}
      <div className="recent-budgets">
        <h3>📊 Recent Budgets</h3>
        {budgets.length === 0 ? (
          <p>No budgets added yet.</p>
        ) : (
          budgets.map((budget, index) => {
            const percentage = Math.min(
              (budget.spent / budget.limit) * 100,
              100
            );
            const isOverBudget = budget.spent >= budget.limit;
            const remaining = budget.limit - budget.spent;

            return (
              <div key={budget.id} className={`budget-item color-${index % 5}`}>
                <div className="budget-info">
                  <span className="budget-category">
                    {getCategoryEmoji(budget.category)} {budget.category}
                  </span>
                  <span className="budget-amount">
                    {settings.currency}
                    {budget.spent} / {settings.currency}
                    {budget.limit}
                  </span>
                </div>

                {/* Progress Bar (animated) */}
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

                {/* Percentage + Warning */}
                <span
                  className={`percentage ${
                    isOverBudget ? "over-text" : "under-text"
                  }`}
                >
                  {isOverBudget
                    ? `⚠ Over Budget (${Math.round(percentage)}%)`
                    : `${Math.round(percentage)}% Used`}
                </span>

                {/* Remaining Balance */}
                <div
                  className={`remaining ${
                    isOverBudget ? "remaining-over" : "remaining-ok"
                  }`}
                >
                  {isOverBudget
                    ? `Exceeded by ${settings.currency}${Math.abs(remaining)}`
                    : `Remaining: ${settings.currency}${remaining}`}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Total Budget + Spent */}
      {budgets.length > 0 && (
        <div className="total-budget">
          <p>
            📝 Total Planned:{" "}
            <span>
              {settings.currency}
              {budgets.reduce((total, b) => total + b.limit, 0)}
            </span>
          </p>
          <p>
            💸 Total Spent: <span>{settings.currency}{totalSpent}</span>
          </p>
        </div>
      )}

      {/* ⚠ Alert if any over budget */}
      {overSpent.length > 0 && (
        <div className="alert-box">
          🚨 Warning: {overSpent.length} budget(s) exceeded!
        </div>
      )}

      {/* ================== Charts ================== */}
      {budgets.length > 0 && (
        <div className="charts-section">
          <h3>📈 Visual Reports</h3>
          <div className="charts-wrapper">
            {/* Pie Chart - Spending Share */}
            <ResponsiveContainer width="50%" height={250}>
              <PieChart>
                <Pie
                  data={budgets}
                  dataKey="spent"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
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

            {/* Bar Chart - Limit vs Spent */}
            <ResponsiveContainer width="50%" height={250}>
              <BarChart data={budgets}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="limit" fill="#0088FE" name="Budget Limit" />
                <Bar dataKey="spent" fill="#FF4D6D" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
