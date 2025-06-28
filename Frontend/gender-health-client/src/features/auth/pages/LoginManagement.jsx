import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/LoginManagement.css";

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
        <div>
            <div className="login-container_management">
                <div className="login-box">
                    <h1>Gender Healthcare<br />Manager</h1>
                    <p className="subtitle">Intelligent Service</p>
                    <form onSubmit={handleLogin}>
                        <label>Email address</label>
                        <input
                            type="email"
                            placeholder="example@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">LOG IN</button>
                        {error && <p className="error">{error}</p>}
                        <a href="#" className="forgot-link">Forgot password?</a>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginManagement;
