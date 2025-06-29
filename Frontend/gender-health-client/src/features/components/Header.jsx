import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./styles/Header.css";

const Header = ({ activePage }) => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [showHeader, setShowHeader] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const lastScrollY = useRef(window.pageYOffset);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
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

  const handleLogoutClick = () => {
    logout();
    navigate("/login");
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <div className={`header-wrapper ${showHeader ? "visible" : "hidden"}`}>
      <header className="header-container">
        <div className="header-title-group">
          <h1 className="header-title">Gender Healthcare System</h1>
          <p className="header-subtitle">for SWP Project</p>
        </div>

        {isLoggedIn ? (
          <div className="user-menu">
            <div className="user-icon" onClick={toggleDropdown}>
              <img
                src={user?.avatar || "https://ui-avatars.com/api/?name=User"}
                alt="avatar"
                className="avatar-img"
              />
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <img
                    src={user?.avatar || "https://ui-avatars.com/api/?name=User"}
                    alt="avatar"
                    className="dropdown-avatar"
                  />
                  <div className="dropdown-username">{user?.name || "User"}</div>
                </div>
                <div onClick={() => navigate("/customer-info")}>Thông tin tài khoản</div>
                <div onClick={() => navigate("/appointments")}>Lịch sử cuộc hẹn</div>
                <div onClick={() => navigate("/customer-invoices")}>Lịch sử thanh toán</div>
                <div onClick={() => navigate("/customer-results")}>Kết quả xét nghiệm</div>
                <div onClick={handleLogoutClick} className="logout-btn">Đăng xuất</div>
              </div>
            )}
          </div>
        ) : (
          <button className="login-button-header" onClick={() => navigate("/login")}>
            Đăng nhập
          </button>
        )}
      </header>

      <nav className="header-nav">
        <ul className="nav-list">
          <li className="nav-item" onClick={() => handleNavClick("home")}>Home</li>
          <li className="nav-item" onClick={() => handleNavClick("about")}>About Us</li>
          <li className="nav-item" onClick={() => handleNavClick("blog")}>Blog</li>
          <li className="nav-item" onClick={() => handleNavClick("service")}>Service</li>
          <li className="nav-item" onClick={() => handleNavClick("contact")}>Contact Us</li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
