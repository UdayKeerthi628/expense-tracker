import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "./GlobalContext";
import "./AddExpense.css";

const AddExpense = () => {
  const { expenses, setExpenses, addExpense, setNotifications, user } =
    useContext(GlobalContext);

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

  // ✅ Load user's expenses from backend when component mounts
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const userId = user?.id || "test-user"; // fallback for testing
        const response = await fetch(
          `http://localhost:8080/api/expenses?userId=${userId}`
        );

        if (!response.ok) throw new Error("Failed to load expenses");

        const data = await response.json();
        setExpenses(data);
        console.log("✅ Loaded expenses from backend:", data);
      } catch (error) {
        console.error("❌ Error loading expenses:", error);
      }
    };

    fetchExpenses();
  }, [user, setExpenses]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Save new expense to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.amount ||
      !formData.category ||
      !formData.date
    ) {
      setNotifications((prev) => [
        ...prev,
        { type: "error", message: "⚠️ Please fill all fields." },
      ]);
      return;
    }

    try {
      const userId = user?.id || "test-user"; // temporary static ID for now

      const response = await fetch("http://localhost:8080/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          amount: Number(formData.amount),
          category: formData.category,
          date: formData.date,
          userId,
        }),
      });

      if (!response.ok) throw new Error("Failed to save expense");

      const saved = await response.json();
      console.log("✅ Saved to backend:", saved);

      addExpense(saved);

      setNotifications((prev) => [
        ...prev,
        {
          type: "success",
          message: `✅ Added: ${saved.title} - ₹${saved.amount}`,
        },
      ]);

      setFormData({
        title: "",
        amount: "",
        category: "",
        date: "",
      });
    } catch (error) {
      console.error("❌ Error saving expense:", error);
      setNotifications((prev) => [
        ...prev,
        { type: "error", message: "❌ Failed to save expense." },
      ]);
    }
  };

  const totalSpent = expenses.reduce(
    (acc, exp) => acc + Number(exp.amount || 0),
    0
  );

  const categoryTotals = categories.map((cat) => {
    const total = expenses
      .filter((exp) => exp.category === cat.value)
      .reduce((acc, exp) => acc + Number(exp.amount || 0), 0);
    return { ...cat, total };
  });

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

      {expenses.length > 0 && (
        <div className="total-spent">
          💰 Total Spent: <span>₹{totalSpent}</span>
        </div>
      )}

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
