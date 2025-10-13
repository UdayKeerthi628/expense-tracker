// src/GlobalContext.js
import React, { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]); // ✅ renamed
  const [budgets, setBudgets] = useState([]);
  const [savings, setSavings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const addExpense = (expense) => {
    setExpenses((prev) => [...prev, expense]);
    setNotifications((prev) => [
      ...prev,
      {
        type: "warning",
        message: `Expense added: ${expense.category} (₹${expense.amount})`,
      },
    ]);
  };

  const addIncome = (newIncome) => {
    setIncomes((prev) => [...prev, newIncome]); // ✅ updated
    setNotifications((prev) => [
      ...prev,
      {
        type: "success",
        message: `Income added: ${newIncome.source} (₹${newIncome.amount})`,
      },
    ]);
  };

  const addBudget = (budget) => {
    setBudgets((prev) => [...prev, budget]);
  };

  const addSaving = (saving) => {
    setSavings((prev) => [...prev, saving]);
    setNotifications((prev) => [
      ...prev,
      {
        type: "info",
        message: `Saving added: ${saving.goal} (₹${saving.amount})`,
      },
    ]);
  };

  return (
    <GlobalContext.Provider
      value={{
        expenses,
        setExpenses,
        addExpense,
        incomes,    // ✅ now correct
        setIncomes,
        addIncome,
        budgets,
        setBudgets,
        addBudget,
        savings,
        setSavings,
        addSaving,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
