import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
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
  const { budgets, setBudgets, expenses, user } = useContext(GlobalContext);

  const userEmail = user?.email;

  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [loading, setLoading] = useState(true);

  // ============================================================
  // 🔥 LOAD BUDGETS + RECALCULATE SPENT EVERY TIME EXPENSES CHANGE
  // ============================================================
  useEffect(() => {
    const loadBudgets = async () => {
      if (!userEmail) return;

      try {
        const res = await axios.get(
          `http://localhost:8080/api/budgets/user/${encodeURIComponent(
            userEmail
          )}`
        );

        // 🔥 Normalize categories by trimming + lowercase
        const updated = res.data.map((b) => {
          const spent = expenses
            .filter(
              (exp) =>
                exp.category?.trim().toLowerCase() ===
                b.category?.trim().toLowerCase()
            )
            .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

          return { ...b, spent };
        });

        setBudgets(updated);
      } catch (err) {
        console.error("❌ Error loading budgets:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBudgets();
  }, [userEmail, expenses, setBudgets]); 
  // 👆 IMPORTANT: this makes budget update instantly

  // ============================================================
  // 🔥 ADD NEW BUDGET
  // ============================================================
  const addBudget = async (e) => {
    e.preventDefault();
    if (!category || !limit || !userEmail) return;

    try {
      const res = await axios.post("http://localhost:8080/api/budgets", {
        category: category.trim(),
        limitAmount: parseFloat(limit),
        userEmail,
      });

      // calculate spent instantly
      const spent = expenses
        .filter(
          (exp) =>
            exp.category?.trim().toLowerCase() ===
            category.trim().toLowerCase()
        )
        .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

      setBudgets([...budgets, { ...res.data, spent }]);

      setCategory("");
      setLimit("");
    } catch (err) {
      console.error("❌ Error adding budget:", err);
    }
  };

  return (
    <div className="budget-container">
      <h2>💰 Set Your Budget</h2>

      {/* ========== ADD BUDGET FORM ========== */}
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

      {/* ========== BUDGET LIST ========== */}
      <div className="recent-budgets">
        <h3>Your Budgets</h3>

        {loading ? (
          <p>Loading budgets...</p>
        ) : budgets.length === 0 ? (
          <p>No budgets added yet.</p>
        ) : (
          budgets.map((b) => {
            // FIX: detect limit regardless of DB key
            const limitValue =
              b.limitAmount ?? b.limit ?? b.amount ?? 0;

            const spent = b.spent ?? 0;

            const pct =
              limitValue > 0
                ? Math.min((spent / limitValue) * 100, 100)
                : 0;

            const over = spent > limitValue;

            return (
              <div key={b.id} className="budget-item">
                <div className="budget-info">
                  <span style={{ textTransform: "capitalize" }}>
                    {b.category?.trim()}
                  </span>

                  <span>
                    ₹{spent} / <b>₹{limitValue}</b>
                  </span>
                </div>

                <div className="progress-bar">
                  <div
                    className={`progress-fill ${over ? "over" : "under"}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <span
                  className={`percentage ${
                    over ? "over-text" : "under-text"
                  }`}
                >
                  {over
                    ? `⚠ Over by ₹${spent - limitValue}`
                    : `${Math.round(pct)}% used`}
                </span>

                <span
                  className={`remaining ${
                    over ? "remaining-over" : "remaining-ok"
                  }`}
                >
                  {over
                    ? `Exceeded by ₹${spent - limitValue}`
                    : `Remaining ₹${limitValue - spent}`}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* ========== CHARTS ========== */}
      {budgets.length > 0 && (
        <div className="charts-section">
          <h3>📈 Reports</h3>

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
                >
                  {budgets.map((_, index) => (
                    <Cell
                      key={index}
                      fill={[
                        "#FF5722",
                        "#4CAF50",
                        "#FFC107",
                        "#03A9F4",
                        "#9C27B0",
                      ][index % 5]}
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
                <Bar dataKey="limitAmount" fill="#FF9800" name="Limit" />
                <Bar dataKey="spent" fill="#E53935" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
