// src/Pages/Reports.js
import React, { useContext } from "react";
import "./Reports.css";
import { GlobalContext } from "./GlobalContext";
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
  LabelList,
} from "recharts";

const Reports = () => {
  const { expenses, budgets, incomes, savings, themeColor } =
    useContext(GlobalContext);

  // Helper: Safe number parsing
  const safe = (v) => (isNaN(parseFloat(v)) ? 0 : parseFloat(v));

  // --------------------------
  // ✅ TOTALS
  // --------------------------
  const totalExpenses = expenses.reduce((sum, e) => sum + safe(e.amount), 0);
  const totalIncome = incomes.reduce((sum, i) => sum + safe(i.amount), 0);
  const totalSavings = savings.reduce(
    (sum, s) => sum + safe(s.savedAmount),
    0
  );

  // IMPORTANT:
  // Budgets use backend field "limitAmount" NOT "limit"
  const totalBudgets = budgets.reduce(
    (sum, b) => sum + safe(b.limitAmount),
    0
  );

  // --------------------------
  // 🎯 BUDGET PERCENT SPENT
  // --------------------------
  const budgetsWithPercent = budgets.map((b) => ({
    ...b,
    limit: safe(b.limitAmount),
    spent: safe(b.spent),
    percentSpent: b.limitAmount
      ? Math.min(((safe(b.spent) / safe(b.limitAmount)) * 100).toFixed(1), 100)
      : 0,
  }));

  // --------------------------
  // 🎨 COLORS
  // --------------------------
  const COLORS = [
    "#FF6B6B",
    "#4ECDC4",
    "#FFD93D",
    "#1A535C",
    "#FF9F1C",
    "#6A4C93",
  ];

  // To avoid chart crash on empty data
  const empty = [{ name: "No Data", value: 1 }];

  // --------------------------
  // 🎯 DATA PREP FOR CHARTS
  // --------------------------
  const expensesData =
    expenses.length > 0
      ? expenses.map((e) => ({ ...e, value: safe(e.amount) }))
      : empty;

  const incomesData =
    incomes.length > 0
      ? incomes.map((i) => ({ ...i, value: safe(i.amount) }))
      : empty;

  const savingsData =
    savings.length > 0
      ? savings.map((s) => ({ ...s, value: safe(s.savedAmount) }))
      : empty;

  return (
    <div className="reports-container">
      <h2>📊 Financial Reports</h2>
      <p className="subtitle">Summary of your finances</p>

      {/* ==========================
          SUMMARY CARDS
      ========================== */}
      <div className="summary-cards">
        <div className="card expenses-card">💸 Expenses: ₹{totalExpenses}</div>
        <div className="card income-card">💰 Income: ₹{totalIncome}</div>
        <div className="card budget-card">📋 Budgets: ₹{totalBudgets}</div>
        <div className="card savings-card">🏦 Savings: ₹{totalSavings}</div>
      </div>

      {/* ==========================
          CHARTS
      ========================== */}
      <div className="charts-section">
        <h3>📈 Charts</h3>

        <div className="charts-wrapper">
          {/* EXPENSE PIE */}
          <ResponsiveContainer width="50%" height={250}>
            <PieChart>
              <Pie
                data={expensesData}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              >
                {expensesData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
            </PieChart>
          </ResponsiveContainer>

          {/* BUDGET BAR */}
          <ResponsiveContainer width="50%" height={250}>
            <BarChart
              data={
                budgetsWithPercent.length > 0
                  ? budgetsWithPercent
                  : [{ category: "No Data", limit: 0, spent: 0 }]
              }
            >
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(v) => `₹${v}`} />
              <Legend />
              <Bar dataKey="limit" fill="#4ECDC4" name="Budget Limit" />
              <Bar dataKey="spent" fill={themeColor} name="Spent">
                <LabelList
                  dataKey="percentSpent"
                  position="top"
                  formatter={(v) => `${v}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="charts-wrapper">
          {/* INCOME PIE */}
          <ResponsiveContainer width="50%" height={250}>
            <PieChart>
              <Pie
                data={incomesData}
                dataKey="value"
                nameKey="source"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              >
                {incomesData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
            </PieChart>
          </ResponsiveContainer>

          {/* SAVINGS PIE */}
          <ResponsiveContainer width="50%" height={250}>
            <PieChart>
              <Pie
                data={savingsData}
                dataKey="value"
                nameKey="goal"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              >
                {savingsData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
