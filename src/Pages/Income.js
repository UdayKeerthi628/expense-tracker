// src/Pages/Income.js
import React, { useState, useContext } from "react";
import { GlobalContext } from "./GlobalContext"; // ✅ updated import path
import "./Income.css";

const Income = () => {
  // ✅ Use GlobalContext instead of useOutletContext
  const { incomes, addIncome, setNotifications } = useContext(GlobalContext);

  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const addIncomeHandler = (e) => {
    e.preventDefault();
    if (!source || !amount || !date) {
      setNotifications((prev) => [
        ...prev,
        { type: "error", message: "⚠️ Please fill all fields before adding income." },
      ]);
      return;
    }

    const newIncome = { source, amount: Number(amount), date };
    addIncome(newIncome);

    setNotifications((prev) => [
      ...prev,
      { type: "income", message: `✅ Added income: ${source} - ₹${amount}` },
    ]);

    setSource("");
    setAmount("");
    setDate("");
  };

  const totalIncome = incomes.reduce(
    (acc, inc) => acc + Number(inc.amount || 0),
    0
  );

  const incomeBySource = incomes.reduce((acc, inc) => {
    acc[inc.source] = (acc[inc.source] || 0) + Number(inc.amount || 0);
    return acc;
  }, {});

  return (
    <div className="income-container">
      <h2>Add Income</h2>
      <form className="income-form" onSubmit={addIncomeHandler}>
        <label>Source</label>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />

        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button type="submit">+ Add Income</button>
      </form>

      <div className="recent-incomes">
        <h3>Recent Incomes</h3>
        {incomes.length === 0 ? (
          <p>No incomes yet.</p>
        ) : (
          incomes.map((inc) => (
            <div
              key={`${inc.source}-${inc.date}-${inc.amount}`}
              className={`income-item color-${Math.floor(Math.random() * 5)}`}
            >
              <span>{inc.source}</span>
              <span>₹{inc.amount}</span>
              <span>{inc.date}</span>
            </div>
          ))
        )}
      </div>

      {incomes.length > 0 && (
        <div className="total-income">💵 Total Income: ₹{totalIncome}</div>
      )}

      {incomes.length > 0 && (
        <div className="income-breakdown">
          <h3>By Source</h3>
          {Object.entries(incomeBySource).map(([src, total], idx) => (
            <div key={idx} className="income-progress">
              <span>
                {src}: ₹{total}
              </span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${totalIncome > 0 ? (total / totalIncome) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Income;
