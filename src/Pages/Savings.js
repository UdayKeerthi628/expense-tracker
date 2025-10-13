// src/Pages/Savings.js
import React, { useState } from "react";
import "./Savings.css";

const Savings = () => {
  const [savings, setSavings] = useState([]);
  const [goal, setGoal] = useState("");
  const [amount, setAmount] = useState("");

  const addSaving = (e) => {
    e.preventDefault();
    if (!goal || !amount) return;

    const newSaving = {
      id: Date.now(),
      goal,
      amount: parseFloat(amount),
    };

    setSavings((prev) => [...prev, newSaving]);
    setGoal("");
    setAmount("");
  };

  return (
    <div className="savings-container">
      <h2>💰 Savings</h2>

      <form className="savings-form" onSubmit={addSaving}>
        <input
          type="text"
          placeholder="Enter goal (e.g., New Bike)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Add Saving</button>
      </form>

      <div className="savings-list">
        {savings.length === 0 ? (
          <p>No savings added yet.</p>
        ) : (
          <ul>
            {savings.map((s) => (
              <li key={s.id}>
                <strong>{s.goal}</strong> — ₹{s.amount}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Savings;
