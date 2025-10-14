// src/GlobalContext.js
import React, { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // --------------------------
  // Core states
  // --------------------------
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savings, setSavings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [themeColor, setThemeColor] = useState("#0088FE");

  // --------------------------
  // User state
  // --------------------------
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    return savedUser ? { username: savedUser } : null;
  });

  // ✅ Sync user state with localStorage
  useEffect(() => {
    if (user?.username) {
      localStorage.setItem("loggedInUser", user.username);
    } else {
      localStorage.removeItem("loggedInUser");
    }
  }, [user]);

  // --------------------------
  // Expense Management
  // --------------------------
  const addExpense = (expense) => {
    setExpenses((prev) => [...prev, { ...expense, id: Date.now() }]);

    const relatedBudget = budgets.find(
      (b) => b.category.toLowerCase() === expense.category.toLowerCase()
    );

    if (relatedBudget) {
      const newSpent = relatedBudget.spent + parseFloat(expense.amount || 0);
      if (newSpent > relatedBudget.limit) {
        setNotifications((prev) => [
          ...prev,
          {
            type: "error",
            message: `⚠ Over Budget! ${expense.category} exceeded its limit.`,
          },
        ]);
      }

      setBudgets((prev) =>
        prev.map((b) =>
          b.id === relatedBudget.id ? { ...b, spent: newSpent } : b
        )
      );
    }

    setNotifications((prev) => [
      ...prev,
      {
        type: "expense",
        message: `Expense added: ${expense.category} (₹${expense.amount})`,
      },
    ]);
  };

  // --------------------------
  // Income Management
  // --------------------------
  const addIncome = (newIncome) => {
    setIncomes((prev) => [...prev, { ...newIncome, id: Date.now() }]);
    setNotifications((prev) => [
      ...prev,
      {
        type: "success",
        message: `Income added: ${newIncome.source} (₹${newIncome.amount})`,
      },
    ]);
  };

  // --------------------------
  // Budget Management
  // --------------------------
  const addBudget = (budget) => {
    setBudgets((prev) => [...prev, { ...budget, id: Date.now(), spent: 0 }]);
  };

  // --------------------------
  // Savings Management
  // --------------------------
  const addSaving = (saving) => {
    const newSaving = {
      id: saving.id || Date.now(),
      goal: saving.goal,
      targetAmount: parseFloat(saving.targetAmount || 0),
      savedAmount: parseFloat(saving.savedAmount || 0),
    };

    setSavings((prev) => [...prev, newSaving]);

    setNotifications((prev) => [
      ...prev,
      {
        type: "info",
        message: `Saving added: ${saving.goal} (₹${newSaving.savedAmount} / ₹${newSaving.targetAmount})`,
      },
    ]);
  };

  const addMoneyToSaving = (id, amount) => {
    if (!amount) return;
    setSavings((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, savedAmount: s.savedAmount + parseFloat(amount) }
          : s
      )
    );

    setNotifications((prev) => [
      ...prev,
      { type: "success", message: `💵 Added ₹${amount} to savings` },
    ]);
  };

  // --------------------------
  // GlobalContext Provider
  // --------------------------
  return (
    <GlobalContext.Provider
      value={{
        // Core States
        expenses,
        setExpenses,
        addExpense,

        incomes,
        setIncomes,
        addIncome,

        budgets,
        setBudgets,
        addBudget,

        savings,
        setSavings,
        addSaving,
        addMoneyToSaving,

        notifications,
        setNotifications,

        themeColor,
        setThemeColor,

        // ✅ User State
        user,
        setUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
