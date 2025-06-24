// src/pages/LoginManagement.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginManagement } from "../../../api/auth";
import "../styles/LoginManagement.css"; // nếu bạn có file CSS riêng

const LoginManagement = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/api/auth/login/management", {
                email,
                password,
            });

            const { token, role, userId } = res.data;

            localStorage.setItem("managementToken", token);
            localStorage.setItem("managementRole", role);
            localStorage.setItem("userId", userId);

            if (role === "admin") {
                navigate("/admin/dashboard");
            } else if (role === "staff") {
                navigate("/staff/dashboard");
            } else if (role === "consultant") {
                navigate("/consultant/workslots");
            } else {
                setError("Không xác định được vai trò.");
            }

        } catch (err) {
            if (err.response?.status === 403) {
                setError("Bạn không có quyền truy cập trang quản lý.");
            } else {
                setError("Email hoặc mật khẩu không đúng.");
            }
        }
    };

    return (
        <div className="login-container_management">
            <h2>Managerment Sign In</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Đăng nhập</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default LoginManagement;
