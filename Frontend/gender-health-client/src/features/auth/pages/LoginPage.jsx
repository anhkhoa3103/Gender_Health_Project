import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";  // chắc bạn đã có file này config axios
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../../../context/AuthContext"; // context quản lý auth
import "../styles/LoginPage.css";
import bgcontact from "../../img/bgcontact.jpg"

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  /* -------------------- helpers -------------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* -------------------- login (email-pass) -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      const token = res.data.token;
      const userInfo = {
        fullName: res.data.fullName,
        phoneNumber: res.data.phoneNumber,
        email: res.data.email,
        avatar: res.data.avatar,
      };

      login(token, userInfo);
      navigate("/");
    } catch (err) {
      alert("Login failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  /* -------------------- login (Google) -------------------- */
  const handleGoogleLogin = async (cred) => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/oauth/google", {
        token: cred.credential,
      });

      const token = data.token;
      const userInfo = {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        avatar: data.avatar,
      };

      login(token, userInfo);
      navigate("/");
    } catch (err) {
      alert("Google login failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  /* -------------------- UI -------------------- */
  return (
    <div className="login-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
        </div>
      )}

      <div className="login-left">
        <div className="image-placeholder">
          <img src={bgcontact} />
        </div>
      </div>

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
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <span
              className="forgot-link"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </span>
          </div>

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert("Google Login Failed")}
            useOneTap={false}
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
