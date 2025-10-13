// src/Pages/AddExpense.js
import React, { useState, useContext } from "react";
import { GlobalContext } from "./GlobalContext"; // ✅ use global context
import "./AddExpense.css";

const AddExpense = () => {
  // ✅ Get global states & helpers from GlobalContext
  const { expenses, addExpense } = useContext(GlobalContext);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  const categories = [
    { label: "🍔 Food", value: "food" },
    { label: "✈️ Travel", value: "travel" },
    { label: "🛒 Shopping", value: "shopping" },
    { label: "💡 Bills", value: "bills" },
    { label: "🎉 Entertainment", value: "entertainment" },
    { label: "🏠 Rent", value: "rent" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.category || !formData.date) {
      alert("Please fill all fields");
      return;
    }

    // ✅ Save to global state
    addExpense({
      id: Date.now(),
      ...formData,
      amount: Number(formData.amount),
    });

    // ✅ Reset form
    setFormData({ title: "", amount: "", category: "", date: "" });
  };

  // ✅ Calculate total spent overall
  const totalSpent = expenses.reduce(
    (acc, exp) => acc + parseFloat(exp.amount || 0),
    0
  );

  // ✅ Calculate per-category totals
  const categoryTotals = categories.map((cat) => {
    const total = expenses
      .filter((exp) => exp.category === cat.value)
      .reduce((acc, exp) => acc + parseFloat(exp.amount || 0), 0);
    return { ...cat, total };
  });

  // ✅ Get emoji for category
  const getCategoryEmoji = (value) => {
    const category = categories.find((cat) => cat.value === value);
    return category ? category.label.split(" ")[0] : "";
  };

  return (
    <div className="add-expense-container">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit} className="expense-form">
        <input
          type="text"
          name="title"
          placeholder="e.g., Grocery Shopping"
          value={formData.title}
          onChange={handleChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="e.g., 50"
          value={formData.amount}
          onChange={handleChange}
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        <button type="submit">+ Add Expense</button>
      </form>

      {/* ✅ Recent Expenses */}
      <div className="recent-expenses">
        <h3>Recent Expenses</h3>
        {expenses.length === 0 ? (
          <p>No expenses added yet.</p>
        ) : (
          <ul>
            {expenses.map((exp) => (
              <li key={exp.id} className="expense-item">
                <div>
                  <strong>
                    {getCategoryEmoji(exp.category)} {exp.title}
                  </strong>{" "}
                  — ₹{exp.amount} on {exp.date}
                </div>
                <span className={`category-badge category-${exp.category}`}>
                  {exp.category}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ✅ Total Spent */}
      {expenses.length > 0 && (
        <div className="total-spent">
          💰 Total Spent: <span>₹{totalSpent}</span>
        </div>
      )}

      {/* ✅ Category Breakdown */}
      {expenses.length > 0 && (
        <div className="category-breakdown">
          <h3>Spending by Category</h3>
          {categoryTotals.map(
            (cat) =>
              cat.total > 0 && (
                <div key={cat.value} className="category-progress">
                  <span>
                    {cat.label}: ₹{cat.total}
                  </span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(cat.total / totalSpent) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default AddExpense;
