import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/LoginPage.css";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  /* -------------------- helpers -------------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* -------------------- login (email-pass) -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/auth/login",
        form
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem('userId', data.userId);
      navigate(`/`);  // ✅ Đúng field
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Login failed");
      }
    }

  };

  /* -------------------- login (Google) -------------------- */
  const handleGoogleLogin = async (cred) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/auth/oauth/google",
        { token: cred.credential }
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      navigate(`/home`);  // ✅ Đúng field
    } catch (err) {
      alert("Google login failed");
    }
  };


  /* -------------------- UI -------------------- */
  return (
    <div className="login-container">
      <div className="login-left"><div className="image-placeholder" /></div>

      <div className="login-right">
        <h2 className="system-title">Gender Health System</h2>
        <p className="subtitle">for SWP Project</p>

        <h3 className="login-title">Log In</h3>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email Address / Username</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <p className="password-tip">
            It must be at least 8 characters with letters, numbers & symbols.
          </p>

          <div className="form-options">
            <label><input type="checkbox" /> Remember me</label>
            <span
              className="forgot-link"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </span>
          </div>

          <button type="submit" className="login-button">Log In</button>
        </form>

        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert("Google Login Failed")}
          />
        </div>

        <hr />
        <p className="signup-link">
          No account yet?{" "}
          <span onClick={() => navigate("/register")}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
