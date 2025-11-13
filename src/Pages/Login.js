import React, { useState, useContext } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { GlobalContext } from "./GlobalContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(GlobalContext);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: identifier,
          password: password,
        }),
      });

      const text = await response.text();

      if (response.ok && text === "Login successful") {
        alert("Login successful ✅");

        // ✅ Create user object
        const username = identifier.split("@")[0];
        const userData = { username, email: identifier, id: identifier };

        // ✅ Save login info
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(userData));

        // ✅ Record last logged-in user (important for clearing old data)
        localStorage.setItem("lastUser", identifier);

        // ✅ Update context and navigate
        setUser(userData);
        navigate("/dashboard");
      } else {
        setError(text || "Invalid email or password ❌");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again later ❌");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-subtitle">Log in to continue tracking your expenses</p>

        {error && (
          <div className="error-message">
            {error}
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <span className="input-icon"><FiMail /></span>
            <input
              type="email"
              placeholder="Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-icon"><FiLock /></span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="signup-text">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
