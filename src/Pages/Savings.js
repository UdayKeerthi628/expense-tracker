// src/Pages/Savings.js
import React, { useState, useContext } from "react";
import { GlobalContext } from "./GlobalContext";
import "./Savings.css";

const Savings = () => {
  const { savings, setSavings, addSaving, addMoneyToSaving, setNotifications } =
    useContext(GlobalContext);

  const [goal, setGoal] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [addMoneyValue, setAddMoneyValue] = useState({}); // for add money inputs

  // Add or update saving
  const addOrUpdateSaving = (e) => {
    e.preventDefault();
    if (!goal || !targetAmount) return;

    const savingData = {
      id: isEditing ? editId : Date.now(),
      goal,
      targetAmount: parseFloat(targetAmount),
      savedAmount: 0, // start with 0 saved
    };

    if (isEditing) {
      setSavings((prev) =>
        prev.map((s) => (s.id === editId ? { ...s, ...savingData } : s))
      );
      setNotifications((prev) => [
        ...prev,
        { type: "info", message: `✏️ Updated saving: ${goal}` },
      ]);
    } else {
      addSaving(savingData);
    }

    resetForm();
  };

  // Delete saving
  const deleteSaving = (id) => {
    setSavings((prev) => prev.filter((s) => s.id !== id));
    setNotifications((prev) => [
      ...prev,
      { type: "warning", message: "🗑️ Saving goal deleted!" },
    ]);
  };

  // Edit saving
  const editSaving = (s) => {
    setGoal(s.goal);
    setTargetAmount(s.targetAmount);
    setIsEditing(true);
    setEditId(s.id);
  };

  // Reset form
  const resetForm = () => {
    setGoal("");
    setTargetAmount("");
    setIsEditing(false);
    setEditId(null);
  };

  // Add money
  const addMoney = (id, amount) => {
    if (!amount) return;
    addMoneyToSaving(id, parseFloat(amount));
    setAddMoneyValue((prev) => ({ ...prev, [id]: "" }));
  };

  // Summary
  const totalTarget = savings.reduce((sum, s) => sum + (s.targetAmount || 0), 0);
  const totalSaved = savings.reduce((sum, s) => sum + (s.savedAmount || 0), 0);
  const overallProgress = totalTarget ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;

  return (
    <div className="savings-page">
      <div className="savings-container">
        <h2>💰 Your Savings Goals</h2>

        {/* Summary */}
        <div className="savings-summary">
          Total Saved: ₹{totalSaved.toLocaleString()} / ₹{totalTarget.toLocaleString()} (
          {overallProgress.toFixed(1)}%)
        </div>

        {/* Form */}
        <form className="savings-form" onSubmit={addOrUpdateSaving}>
          <input
            type="text"
            placeholder="Enter goal (e.g., New Bike)"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <input
            type="number"
            placeholder="Target amount (₹)"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />
          <div className="button-row">
            <button type="submit">{isEditing ? "Update Saving" : "Add Saving"}</button>
            {isEditing && (
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Savings List */}
        <div className="savings-list">
          {savings.length === 0 ? (
            <p>No savings added yet.</p>
          ) : (
            <ul>
              {savings.map((s) => {
                const progress = s.targetAmount
                  ? Math.min((s.savedAmount / s.targetAmount) * 100, 100)
                  : 0;
                let color = progress < 40 ? "#ff4d6d" : progress < 80 ? "#f9ca24" : "#43cea2";

                return (
                  <li key={s.id} className="saving-item">
                    <div className="saving-info">
                      <div>
                        <strong>{s.goal}</strong>
                        <span>
                          — ₹{s.savedAmount} / ₹{s.targetAmount}{" "}
                          {s.savedAmount >= s.targetAmount && "✅ Goal Achieved!"}
                        </span>
                      </div>
                      <span>{progress.toFixed(1)}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%`, background: color }}></div>
                    </div>

                    {/* Actions */}
                    <div className="saving-actions">
                      <button onClick={() => editSaving(s)}>Edit</button>
                      <button onClick={() => deleteSaving(s.id)}>Delete</button>
                      <input
                        type="number"
                        placeholder="Add ₹"
                        value={addMoneyValue[s.id] || ""}
                        onChange={(e) =>
                          setAddMoneyValue((prev) => ({ ...prev, [s.id]: e.target.value }))
                        }
                      />
                      <button onClick={() => addMoney(s.id, addMoneyValue[s.id])}>Add Money</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Savings;
