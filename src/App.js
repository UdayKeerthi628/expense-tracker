// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Income from "./Pages/Income";
import AddExpense from "./Pages/AddExpense";
import Budgets from "./Pages/Budgets";
import Savings from "./Pages/Savings";
import Reports from "./Pages/Reports";
import Notifications from "./Pages/Notifications";
import Settings from "./Pages/Settings";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

import { GlobalProvider } from "./Pages/GlobalContext";

// ✅ Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ✅ Protected Routes under Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            {/* Nested routes rendered inside Dashboard's <Outlet /> */}
            <Route path="add-expense" element={<AddExpense />} />
            <Route path="income" element={<Income />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="savings" element={<Savings />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
