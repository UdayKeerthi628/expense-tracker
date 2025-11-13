// ✅ src/GlobalContext.js
import React, { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // --------------------------
  // 🔹 Core states
  // --------------------------
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savings, setSavings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [themeColor, setThemeColor] = useState("#0088FE");

  // --------------------------
  // 🔹 User state (persisted in localStorage)
  // --------------------------
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ✅ Persist user data changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // --------------------------
  // 🔹 Clear old data when a different user logs in
  // --------------------------
  useEffect(() => {
    const lastUser = localStorage.getItem("lastUser");
    const currentUser =
      user?.email || user?.username || user?.name || user?.id || null;

    if (currentUser && lastUser && lastUser !== currentUser) {
      // 🧹 New user logged in → clear all user-specific data
      setExpenses([]);
      setIncomes([]);
      setBudgets([]);
      setSavings([]);

      localStorage.removeItem("expenses");
      localStorage.removeItem("incomes");
      localStorage.removeItem("budgets");
      localStorage.removeItem("savings");

      setNotifications([
        { type: "info", message: `👋 Welcome ${user.username || "User"}!` },
      ]);
    }

    if (currentUser) {
      localStorage.setItem("lastUser", currentUser);
    }
  }, [user]);

  // --------------------------
  // 🔹 Load user data from backend after login
  // --------------------------
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      const userId = user.id || user.email || user.username;

      try {
        const [expRes, incRes, budRes, savRes] = await Promise.all([
          fetch(`http://localhost:8080/api/expenses?userId=${userId}`),
          fetch(`http://localhost:8080/api/incomes?userId=${userId}`),
          fetch(`http://localhost:8080/api/budgets?userId=${userId}`),
          fetch(`http://localhost:8080/api/savings?userId=${userId}`),
        ]);

        if (!expRes.ok || !incRes.ok || !budRes.ok || !savRes.ok) {
          console.warn("⚠️ Some backend data not available yet");
          return;
        }

        const [expData, incData, budData, savData] = await Promise.all([
          expRes.json(),
          incRes.json(),
          budRes.json(),
          savRes.json(),
        ]);

        setExpenses(Array.isArray(expData) ? expData : []);
        setIncomes(Array.isArray(incData) ? incData : []);
        setBudgets(Array.isArray(budData) ? budData : []);
        setSavings(Array.isArray(savData) ? savData : []);
      } catch (err) {
        console.error("❌ Error loading user data:", err);
      }
    };

    loadData();
  }, [user]);

  // --------------------------
  // 🔹 Expense / Income / Budget / Savings logic
  // --------------------------
  const addExpense = (expense) => {
    const newExpense = { ...expense, id: Date.now() };
    setExpenses((prev) => [...prev, newExpense]);

    setNotifications((prev) => [
      ...prev.slice(-4),
      {
        type: "expense",
        message: `✅ Expense added: ${expense.category} (₹${expense.amount})`,
      },
    ]);
  };

  const addIncome = (income) => {
    const newIncome = { ...income, id: Date.now() };
    setIncomes((prev) => [...prev, newIncome]);

    setNotifications((prev) => [
      ...prev.slice(-4),
      {
        type: "success",
        message: `💰 Income added: ${income.source} (₹${income.amount})`,
      },
    ]);
  };

  const addBudget = (budget) => {
    const newBudget = { ...budget, id: Date.now(), spent: 0 };
    setBudgets((prev) => [...prev, newBudget]);
  };

  const addSaving = (saving) => {
    const newSaving = {
      id: saving.id || Date.now(),
      goal: saving.goal,
      targetAmount: parseFloat(saving.targetAmount || 0),
      savedAmount: parseFloat(saving.savedAmount || 0),
    };

    setSavings((prev) => [...prev, newSaving]);
    setNotifications((prev) => [
      ...prev.slice(-4),
      {
        type: "info",
        message: `💎 Saving added: ${saving.goal} (₹${newSaving.savedAmount} / ₹${newSaving.targetAmount})`,
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
      ...prev.slice(-4),
      { type: "success", message: `💵 Added ₹${amount} to savings.` },
    ]);
  };

  // --------------------------
  // 🔹 Theme persistence (optional)
  // --------------------------
  useEffect(() => {
    const savedColor = localStorage.getItem("themeColor");
    if (savedColor) setThemeColor(savedColor);
  }, []);

  useEffect(() => {
    localStorage.setItem("themeColor", themeColor);
  }, [themeColor]);

  // --------------------------
  // 🔹 Provide all states & actions globally
  // --------------------------
  return (
    <GlobalContext.Provider
      value={{
        // Expense
        expenses,
        setExpenses,
        addExpense,

        // Income
        incomes,
        setIncomes,
        addIncome,

        // Budget
        budgets,
        setBudgets,
        addBudget,

        // Savings
        savings,
        setSavings,
        addSaving,
        addMoneyToSaving,

        // UI / Theme
        themeColor,
        setThemeColor,

        // Notifications
        notifications,
        setNotifications,

        // User
        user,
        setUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
