import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "../styles/RegisterPage.css";

function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    avatar: "",
    role: "customer"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", form);
      alert(res.data);
      navigate("/login");
    } catch (err) {
      alert("Đăng ký thất bại");
    }
  };

  const handleGoogleRegister = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const res = await axios.post("http://localhost:8080/api/auth/oauth/google", { token });
      alert("Đăng ký bằng Google thành công");
      navigate("/");
    } catch (err) {
      alert("Google đăng ký thất bại");
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="image-placeholder" />
      </div>
      <div className="register-right">
        <h2 className="system-title">Gender Health System</h2>
        <p className="subtitle">for SWP Project</p>
        <h3 className="register-title">Sign Up</h3>
        <form className="register-form" onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input name="fullName" onChange={handleChange} required />

          <label>Email</label>
          <input name="email" type="email" onChange={handleChange} required />

          <label>Phone</label>
          <input name="phone" onChange={handleChange} />

          <label>Password</label>
          <input name="password" type="password" onChange={handleChange} required />

          <label>Confirm Password</label>
          <input name="confirmPassword" type="password" onChange={handleChange} required />

          <button type="submit" className="register-button">Đăng ký</button>
        </form>

        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleRegister}
            onError={() => alert("Google đăng ký thất bại")}
          />
        </div>

        <hr />
        <p className="login-link">
          Đã có tài khoản? <span onClick={() => navigate("/login")}>Quay lại đăng nhập</span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;