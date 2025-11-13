// ✅ src/GlobalContext.js
import React, { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savings, setSavings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [themeColor, setThemeColor] = useState("#0088FE");

  // --------------------------
  // 🔹 User Persistence
  // --------------------------
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // --------------------------
  // 🔹 Clear data ONLY when a DIFFERENT user logs in
  // --------------------------
  useEffect(() => {
    const lastUser = localStorage.getItem("lastUser");
    const currentUser = user?.email;

    if (currentUser && lastUser && lastUser !== currentUser) {
      setExpenses([]);
      setIncomes([]);
      setBudgets([]);
      setSavings([]);
    }

    if (currentUser) localStorage.setItem("lastUser", currentUser);
  }, [user]);

  // --------------------------
  // 🔥 Load data correctly (MATCHES BACKEND)
  // --------------------------
  useEffect(() => {
    if (!user?.email) return;

    const email = user.email;

    const loadData = async () => {
      try {
        const [expR, incR, budR, savR] = await Promise.all([
          fetch(`http://localhost:8080/api/expenses/user/${email}`),
          fetch(`http://localhost:8080/api/incomes/user/${email}`),
          fetch(`http://localhost:8080/api/budgets/user/${email}`),
          fetch(`http://localhost:8080/api/savings/user/${email}`)
        ]);

        const [exp, inc, bud, sav] = await Promise.all([
          expR.json(),
          incR.json(),
          budR.json(),
          savR.json()
        ]);

        setExpenses(Array.isArray(exp) ? exp : []);
        setIncomes(Array.isArray(inc) ? inc : []);
        setBudgets(Array.isArray(bud) ? bud : []);
        setSavings(Array.isArray(sav) ? sav : []);
      } catch (err) {
        console.error("❌ Error loading data:", err);
      }
    };

    loadData();
  }, [user]);

  // --------------------------
  // 🔥 Add functions
  // --------------------------
  const addExpense = (expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  const addIncome = (income) => {
    setIncomes((prev) => [...prev, income]);
  };

  const addBudget = (budget) => {
    setBudgets((prev) => [...prev, budget]);
  };

  const addSaving = (saving) => {
    setSavings((prev) => [...prev, saving]);
  };

  const addMoneyToSaving = (id, amount) => {
    setSavings((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, savedAmount: s.savedAmount + parseFloat(amount) }
          : s
      )
    );
  };

  // --------------------------
  // 🔹 Theme
  // --------------------------
  useEffect(() => {
    const saved = localStorage.getItem("themeColor");
    if (saved) setThemeColor(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("themeColor", themeColor);
  }, [themeColor]);

  return (
    <GlobalContext.Provider
      value={{
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

        user,
        setUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
