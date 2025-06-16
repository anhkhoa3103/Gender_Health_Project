import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPasswordPage.css";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/api/auth/forgot-password", {
                email: email,
            });
            setMessage(res.data);
        } catch (err) {
            setMessage("Có lỗi xảy ra.");
        }
    };

    return (
        <div className="forgot-wrapper">
            <div className="forgot-card">
                <h2>Forgotten your password?</h2>
                <p>
                    There is nothing to worry about, we'll send you a message to help you reset your password.
                </p>
                <form onSubmit={handleSubmit}>
                    <label>Email Address/Username</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Send Reset Link</button>
                    <p className="login-link">
                        Đã có tài khoản? <span onClick={() => navigate("/")}>Quay lại đăng nhập</span>
                    </p>
                </form>
                {message && <p className="response-message">{message}</p>}
            </div>
        </div>
    );
}

export default ForgotPasswordPage;