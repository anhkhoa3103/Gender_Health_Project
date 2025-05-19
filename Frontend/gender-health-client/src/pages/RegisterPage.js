import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";

function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
    avatar: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form);
      alert(res.data);
      navigate("/"); // tự động chuyển về login sau khi đăng ký
    } catch (err) {
      alert("Đăng ký thất bại");
    }
  };

  return (
    <div>
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <input name="fullName" placeholder="Full Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="avatar" placeholder="Avatar URL" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>

      <p>Đã có tài khoản?</p>
      <button onClick={() => navigate("/")}>Back to Login</button>
    </div>
  );
}

export default RegisterPage;
