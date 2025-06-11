import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import "./styles/Header.css";

const Header = ({ activePage }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    // Token hết hạn
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                } else {
                    setIsLoggedIn(true);
                }
            } catch {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleLogoutClick = () => {
        navigate("/logout");
    };

    return (
        <>
            <header className="header-container">
                <div className="header-title-group">
                    <h1 className="header-title">Gender Healthcare System</h1>
                    <p className="header-subtitle">for SWP Project</p>
                </div>


                <button
                    className="login-button-header"
                    onClick={isLoggedIn ? handleLogoutClick : handleLoginClick}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="login-icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        width={20}
                        height={20}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                    </svg>
                    {isLoggedIn ? "Log Out" : "Log In"}
                </button>


            </header>

            <nav className="header-nav">
                <ul className="nav-list">
                    <li className={`nav-item ${activePage === "home" ? "active" : ""}`}>
                        <Link to="/">Home</Link>
                    </li>
                    <li className={`nav-item ${activePage === "about" ? "active" : ""}`}>
                        <Link to="/about">About Us</Link>
                    </li>
                    <li className={`nav-item ${activePage === "service" ? "active" : ""}`}>
                        <Link to="/service">Service</Link>
                    </li>
                    <li className={`nav-item ${activePage === "blog" ? "active" : ""}`}>
                        <Link to="/blog">Blog</Link>
                    </li>
                    <li className={`nav-item ${activePage === "contact" ? "active" : ""}`}>
                        <Link to="/contact">Contact Us</Link>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Header;
