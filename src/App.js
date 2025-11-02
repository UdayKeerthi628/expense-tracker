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
import Profile from "./Pages/Profile";   // ✅

import { GlobalProvider } from "./Pages/GlobalContext";

// ✅ Protected Route
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("loggedInUser");
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

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path="add-expense" element={<AddExpense />} />
            <Route path="income" element={<Income />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="savings" element={<Savings />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />

            {/* ✅ ADD THIS */}
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
