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
} from "recharts";

const Reports = () => {
  const { expenses, budgets, incomes, savings, themeColor } = useContext(GlobalContext);

  // Totals
  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const totalIncome = incomes.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
  const totalSavings = savings.reduce((sum, s) => sum + parseFloat(s.savedAmount || 0), 0);
  const totalBudgets = budgets.reduce((sum, b) => sum + parseFloat(b.limit || 0), 0);

  // Colors for pie charts
  const COLORS = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#1A535C", "#FF9F1C", "#6A4C93"];

  return (
    <div className="reports-container">
      <h2>📊 Financial Reports</h2>
      <p className="subtitle">Summary of your finances</p>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card expenses-card">
          💸 Expenses: ₹{totalExpenses}
        </div>
        <div className="card income-card">
          💰 Income: ₹{totalIncome}
        </div>
        <div className="card budget-card">
          📋 Budgets: ₹{totalBudgets}
        </div>
        <div className="card savings-card">
          🏦 Savings: ₹{totalSavings}
        </div>
      </div>

      {/* Charts */}
      <div className="charts-section">
        <h3>📈 Charts</h3>
        <div className="charts-wrapper">
          {/* Expenses Pie Chart */}
          <ResponsiveContainer width="50%" height={250}>
            <PieChart>
              <Pie
                data={expenses}
                dataKey="amount"
                nameKey="title"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {expenses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Budgets vs Spent Bar Chart */}
          <ResponsiveContainer width="50%" height={250}>
            <BarChart data={budgets}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="limit" fill="#4ECDC4" name="Budget Limit" />
              <Bar dataKey="spent" fill={themeColor} name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="charts-wrapper">
          {/* Income Pie Chart */}
          <ResponsiveContainer width="50%" height={250}>
            <PieChart>
              <Pie
                data={incomes}
                dataKey="amount"
                nameKey="source"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {incomes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Savings Pie Chart */}
          <ResponsiveContainer width="50%" height={250}>
            <PieChart>
              <Pie
                data={savings}
                dataKey="savedAmount"
                nameKey="goal"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {savings.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
