import React from "react";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="homepage-container">
      <nav className="navbar">
        <div className="logo">Gender Health System <span>for SWP Project</span></div>
        <ul className="nav-links">
          <li className="active">Home</li>
          <li>Service</li>
          <li>Menstrual</li>
          <li>About us</li>
          <li>Contact</li>
        </ul>
        <button className="nav-login" onClick={() => navigate("/")}>Login</button>
      </nav>

      <div className="main-content">
        <aside className="sidebar">
          <h3>Gender Health System</h3>
          <p>Introduction</p>
          <ul>
            <li>...........................</li>
            <li>...........................</li>
            <li>...........................</li>
            <li>...........................</li>
          </ul>
          <h4>New Blog</h4>
          <ul className="blog-list">
            {Array.from({ length: 10 }, (_, i) => (
              <li key={i}>Blog {i + 1}</li>
            ))}
          </ul>
          <button className="sidebar-login" onClick={() => navigate("/")}>Login</button>
          <div className="contact-banner">Contact Trigger Banner</div>
        </aside>

        <section className="blog-section">
          {[1, 2, 3, 4].map((blog, i) => (
            <div className="blog-card" key={i}>
              <div className="image-placeholder"></div>
              <p className="topic">Topic</p>
              <h3 className="title">Title</h3>
              <p className="description">...............................</p>
              <div className="meta">
                <span className="author-icon"></span>
                <span className="author-date">Name<br />20 Jan 2022</span>
              </div>
            </div>
          ))}
        </section>

        <div className="right-section">
          <div className="menstrual-circle">
            <div className="analysis-button">GET DETAILED ANALYSIS ABOUT YOUR CYCLE</div>
          </div>
          <div className="calendar">
            <h4>May 2025</h4>
            {/* Giả lập lịch — phần này có thể thay bằng component thư viện sau */}
            <table>
              <thead>
                <tr>
                  <th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th><th>Su</th>
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan="7">Calendar Data</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
