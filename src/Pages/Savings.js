// src/Pages/Savings.js
import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "./GlobalContext";
import "./Savings.css";

const Savings = () => {
  const { savings, setSavings } = useContext(GlobalContext);

  const [goal, setGoal] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [addMoneyValue, setAddMoneyValue] = useState({});

  // Load existing savings from backend on mount
  useEffect(() => {
    fetch("http://localhost:8080/api/savings")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch savings");
        return res.json();
      })
      .then((data) => setSavings(data))
      .catch((err) => {
        console.error("Error fetching savings:", err);
        // keep local state if backend unreachable
      });
  }, [setSavings]);

  // Add or Update (sends to backend)
  const addOrUpdateSaving = async (e) => {
    e.preventDefault();
    if (!goal || !targetAmount) return;

    const savingData = {
      goal,
      targetAmount: parseFloat(targetAmount),
      savedAmount: 0,
    };

    try {
      let res;
      if (isEditing) {
        res = await fetch(`http://localhost:8080/api/savings/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(savingData),
        });
      } else {
        res = await fetch("http://localhost:8080/api/savings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(savingData),
        });
      }

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Save failed: ${res.status} ${txt}`);
      }

      const saved = await res.json();

      if (isEditing) {
        setSavings((prev) => prev.map((s) => (s.id === editId ? saved : s)));
      } else {
        setSavings((prev) => [...prev, saved]);
      }

      resetForm();
    } catch (err) {
      console.error("Error saving:", err);
      alert("Error saving: " + err.message);
    }
  };

  // Delete -> backend
  const deleteSaving = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/savings/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setSavings((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Error deleting: " + err.message);
    }
  };

  // Add money -> backend (updates savedAmount)
  const addMoney = async (id, amount) => {
    if (!amount) return;
    try {
      const saving = savings.find((s) => s.id === id);
      if (!saving) throw new Error("Saving not found");

      const updated = { ...saving, savedAmount: (saving.savedAmount || 0) + parseFloat(amount) };

      const res = await fetch(`http://localhost:8080/api/savings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Update failed: ${res.status} ${txt}`);
      }

      const updatedData = await res.json();
      setSavings((prev) => prev.map((s) => (s.id === id ? updatedData : s)));
      setAddMoneyValue((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Error updating saving:", err);
      alert("Error updating saving: " + err.message);
    }
  };

  const editSaving = (s) => {
    setGoal(s.goal);
    setTargetAmount(s.targetAmount);
    setIsEditing(true);
    setEditId(s.id);
  };

  const resetForm = () => {
    setGoal("");
    setTargetAmount("");
    setIsEditing(false);
    setEditId(null);
  };

  const totalTarget = savings.reduce((sum, s) => sum + (s.targetAmount || 0), 0);
  const totalSaved = savings.reduce((sum, s) => sum + (s.savedAmount || 0), 0);
  const overallProgress = totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;

  return (
    <div className="savings-page">
      <div className="savings-container">
        <h2>💰 Your Savings Goals</h2>

        <div className="savings-summary">
          Total Saved: ₹{totalSaved.toLocaleString()} / ₹{totalTarget.toLocaleString()} (
          {overallProgress.toFixed(1)}%)
        </div>

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

        <div className="savings-list">
          {savings.length === 0 ? (
            <p>No savings added yet.</p>
          ) : (
            <ul>
              {savings.map((s) => {
                const progress = s.targetAmount ? Math.min((s.savedAmount / s.targetAmount) * 100, 100) : 0;
                const color = progress < 40 ? "#ff4d6d" : progress < 80 ? "#f9ca24" : "#43cea2";

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

                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%`, background: color }}></div>
                    </div>

                    <div className="saving-actions">
                      <button onClick={() => editSaving(s)}>Edit</button>
                      <button onClick={() => deleteSaving(s.id)}>Delete</button>
                      <input
                        type="number"
                        placeholder="Add ₹"
                        value={addMoneyValue[s.id] || ""}
                        onChange={(e) => setAddMoneyValue((prev) => ({ ...prev, [s.id]: e.target.value }))}
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
