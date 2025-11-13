import React, { useState, useEffect, useCallback } from "react";
import "./Income.css";

const Income = () => {

  const [incomes, setIncomes] = useState([]);
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Logged-in user (correct)
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user ? user.email : null;

  // ❗ If no user, stop loading
  useEffect(() => {
    if (!userEmail) {
      setIncomes([]);
    }
  }, [userEmail]);

  // ✅ Fetch incomes from backend (CORRECT URL)
  const fetchIncomes = useCallback(async () => {
    if (!userEmail) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/incomes/user/${userEmail}`);
      if (!res.ok) throw new Error("Failed to fetch incomes");

      const data = await res.json();
      setIncomes(data);
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Unable to load incomes.");
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  // Load incomes on mount
  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  // ================================
  // 🚀 Add Income
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!source || !amount || !date) {
      setMessage("⚠️ Please fill all fields.");
      return;
    }

    const newIncome = {
      source,
      amount: Number(amount),
      date,
      userEmail, // ✔ IMPORTANT
    };

    try {
      const res = await fetch("http://localhost:8080/api/incomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIncome),
      });

      if (!res.ok) throw new Error("Failed to save income");

      const saved = await res.json();
      setIncomes((prev) => [...prev, saved]);

      setMessage(`✅ Added income: ${source} - ₹${amount}`);
      setSource("");
      setAmount("");
      setDate("");

    } catch (err) {
      console.error(err);
      setMessage("❌ Error saving income.");
    }
  };

  // ================================
  // 🗑 Delete Income
  // ================================
  const deleteIncome = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;

    try {
      await fetch(`http://localhost:8080/api/incomes/${id}`, {
        method: "DELETE",
      });

      setIncomes((prev) => prev.filter((i) => i.id !== id));
      setMessage("🗑 Income deleted.");
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Unable to delete income.");
    }
  };

  // Total income
  const totalIncome = incomes.reduce(
    (acc, inc) => acc + Number(inc.amount || 0),
    0
  );

  return (
    <div className="income-container">
      <h2>💰 Add Income</h2>

      {message && <div className="message">{message}</div>}
      {loading && <div className="loading">⏳ Loading...</div>}

      <form className="income-form" onSubmit={handleSubmit}>
        <label>Source</label>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
        />

        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <button type="submit">+ Add Income</button>
      </form>

      <div className="recent-incomes">
        <h3>Recent Incomes</h3>

        {incomes.length === 0 ? (
          <p>No incomes yet.</p>
        ) : (
          incomes.map((inc) => (
            <div key={inc.id} className="income-item">
              <span>{inc.source}</span>
              <span>₹{inc.amount}</span>
              <span>{inc.date}</span>

              <button className="delete-btn" onClick={() => deleteIncome(inc.id)}>
                ❌
              </button>
            </div>
          ))
        )}
      </div>

      {incomes.length > 0 && (
        <div className="total-income">
          💵 Total Income: <strong>₹{totalIncome}</strong>
        </div>
      )}
    </div>
  );
};

export default Income;
