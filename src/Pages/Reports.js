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
  const { expenses, budgets, incomes, savings, themeColor } = useContext(GlobalContext);

  // Helper to ensure numeric values
  const safeNumber = (val) => (isNaN(parseFloat(val)) ? 0 : parseFloat(val));

  // Totals
  const totalExpenses = expenses.reduce((sum, e) => sum + safeNumber(e.amount), 0);
  const totalIncome = incomes.reduce((sum, i) => sum + safeNumber(i.amount), 0);
  const totalSavings = savings.reduce((sum, s) => sum + safeNumber(s.savedAmount), 0);
  const totalBudgets = budgets.reduce((sum, b) => sum + safeNumber(b.limit), 0);

  // Colors
  const COLORS = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#1A535C", "#FF9F1C", "#6A4C93"];

  // Handle empty datasets
  const emptyData = [{ name: "No Data", value: 1 }];

  // Calculate percentage spent for each budget
  const budgetsWithPercent = budgets.map((b) => ({
    ...b,
    percentSpent: b.limit ? Math.min(((b.spent / b.limit) * 100).toFixed(1), 100) : 0,
  }));

  // Add `total` to Pie data for percentage calculation
  const expensesData = expenses.length > 0 ? expenses.map(e => ({ ...e, total: totalExpenses })) : emptyData;
  const incomesData = incomes.length > 0 ? incomes.map(i => ({ ...i, total: totalIncome })) : emptyData;
  const savingsData = savings.length > 0 ? savings.map(s => ({ ...s, total: totalSavings })) : emptyData;

  return (
    <div className="reports-container">
      <h2>📊 Financial Reports</h2>
      <p className="subtitle">Summary of your finances</p>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card expenses-card">💸 Expenses: ₹{totalExpenses}</div>
        <div className="card income-card">💰 Income: ₹{totalIncome}</div>
        <div className="card budget-card">📋 Budgets: ₹{totalBudgets}</div>
        <div className="card savings-card">🏦 Savings: ₹{totalSavings}</div>
      </div>

      {/* Charts */}
      <div className="charts-section">
        <h3>📈 Charts</h3>

        <div className="charts-wrapper">
          {/* Expenses Pie Chart */}
          <ResponsiveContainer width="50%" height={250}>
            <PieChart>
              <Pie
                data={expensesData}
                dataKey="amount"
                nameKey="title"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              >
                {expensesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
            </PieChart>
          </ResponsiveContainer>

          {/* Budgets vs Spent Bar Chart */}
          <ResponsiveContainer width="50%" height={250}>
            <BarChart
              data={
                budgetsWithPercent.length > 0
                  ? budgetsWithPercent
                  : [{ category: "No Data", limit: 0, spent: 0, percentSpent: 0 }]
              }
            >
              <XAxis dataKey={(b) => b.category || b.name || "Budget"} />
              <YAxis />
              <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
              <Legend />
              <Bar dataKey="limit" fill="#4ECDC4" name="Budget Limit" />
              <Bar dataKey="spent" fill={themeColor} name="Spent">
                <LabelList dataKey="percentSpent" position="top" formatter={(val) => `${val}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="charts-wrapper">
          {/* Income Pie Chart */}
          <ResponsiveContainer width="50%" height={250}>
            <PieChart>
              <Pie
                data={incomesData}
                dataKey="amount"
                nameKey="source"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              >
                {incomesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
            </PieChart>
          </ResponsiveContainer>

          {/* Savings Pie Chart */}
          <ResponsiveContainer width="50%" height={250}>
            <PieChart>
              <Pie
                data={savingsData}
                dataKey="savedAmount"
                nameKey="goal"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              >
                {savingsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
