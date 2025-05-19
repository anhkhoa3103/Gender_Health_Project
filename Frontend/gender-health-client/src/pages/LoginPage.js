import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      alert(res.data); // Hiển thị thông báo từ server
      // Bạn có thể lưu JWT nếu dùng sau này
    } catch (err) {
      alert("Đăng nhập thất bại");
    }
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleLogin}>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Sign In</button>
      </form>
      <p>Chưa có tài khoản?</p>
      <button onClick={() => navigate("/register")}>Sign Up</button>
    </div>
  );
}

export default LoginPage;
