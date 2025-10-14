// src/pages/Budgets.js
import React, { useState, useContext } from "react";
import { GlobalContext } from "./GlobalContext";
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
  const { budgets, setBudgets, expenses, themeColor, setThemeColor } =
    useContext(GlobalContext);

  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#B620E0",
    "#FF4D6D",
  ];

  const addBudget = (e) => {
    e.preventDefault();
    if (!category || !limit) return;

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

    setCategory("");
    setLimit("");
  };

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

  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overSpent = budgets.filter((b) => b.spent > b.limit);

  // ===== Theme Picker =====
  const availableThemes = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#B620E0",
    "#FF4D6D",
    "#2E8B57",
    "#FF6347",
    "#FFD700",
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

      {/* Theme Selector */}
      <div className="theme-selector">
        <h4>🎨 Pick Chart Theme:</h4>
        {availableThemes.map((color, idx) => (
          <span
            key={idx}
            className="color-swatch"
            style={{
              backgroundColor: color,
              border: themeColor === color ? "3px solid black" : "1px solid #ccc",
            }}
            onClick={() => setThemeColor(color)}
          ></span>
        ))}
      </div>

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
              <div
                key={budget.id}
                className={`budget-item`}
                style={{ borderColor: themeColor }}
              >
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
                    className={`progress-fill ${isOverBudget ? "over" : "under"}`}
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: themeColor,
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

      {/* Total Budget + Spent */}
      {budgets.length > 0 && (
        <div className="total-budget">
          <p>
            📝 Total Planned:{" "}
            <span>
              ₹{budgets.reduce((total, b) => total + b.limit, 0)}
            </span>
          </p>
          <p>
            💸 Total Spent: <span>₹{totalSpent}</span>
          </p>
        </div>
      )}

      {/* Alert if over budget */}
      {overSpent.length > 0 && (
        <div className="alert-box">
          🚨 Warning: {overSpent.length} budget(s) exceeded!
        </div>
      )}

      {/* Charts */}
      {budgets.length > 0 && (
        <div className="charts-section">
          <h3>📈 Visual Reports</h3>
          <div className="charts-wrapper">
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
                      fill={themeColor || COLORS[index % COLORS.length]}
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
                <Bar
                  dataKey="limit"
                  fill={themeColor || "#0088FE"}
                  name="Budget Limit"
                />
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
