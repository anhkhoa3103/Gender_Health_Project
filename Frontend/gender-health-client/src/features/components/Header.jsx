import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // đường dẫn điều chỉnh theo project
import "./styles/Header.css";

const Header = ({ activePage }) => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(window.pageYOffset);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginClick = () => navigate("/login");
  const handleLogoutClick = () => {
    logout();
    navigate("/login");
  };

  const handleNavClick = (id) => {
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/");
    }
  };

  return (
    <div className={`header-wrapper ${showHeader ? "visible" : "hidden"}`}>
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
          <li className="nav-item" onClick={() => handleNavClick("home")}>
            Home
          </li>
          <li className="nav-item" onClick={() => handleNavClick("about")}>
            About Us
          </li>
          <li className="nav-item" onClick={() => handleNavClick("service")}>
            Service
          </li>
          <li className="nav-item" onClick={() => handleNavClick("blog")}>
            Blog
          </li>
          <li className="nav-item" onClick={() => handleNavClick("contact")}>
            Contact Us
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
