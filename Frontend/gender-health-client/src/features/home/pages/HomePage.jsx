import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";

const Homepage = () => {
  return (
    <div className="homepage-container">
      <header className="header">
        <h1 className="header-title">Gender Healthcare System</h1>
        <p className="header-subtitle">for SWP Project</p>
      </header>

      <nav className="nav-bar">
        <ul className="nav-list">
          <li className="nav-item">Home</li>
          <li className="nav-item">About Us</li>
          <li className="nav-item active">Service</li>
          <li className="nav-item">Blog</li>
          <li className="nav-item">Contact Us</li>
        </ul>
      </nav>


      <main className="main-content">
        <h2 className="main-title">
          Our <span className="highlight">Main Services</span> Categories
        </h2>

        <div className="service-cards">
          <div className="service-card">
            <div className="icon consultation-icon" />
            <h3>Consultation Booking</h3>
            <p>
              You can connect directly, quickly and easily, and there is no
              need to doubt the quality of the consultation and treatment
              offered.
            </p>
          </div>

          <div className="service-card sti-card">
            <div className="icon sti-icon" />
            <h3>STI Testing</h3>
            <p>
              Quick, confidential STI testing with clear results and guidance
              — take control of your sexual health.
            </p>
          </div>

          {/* Wrap menstrual card with Link */}
          <Link to="/menstrual/:userId" className="service-card-link">
            <div className="service-card">
              <div className="icon menstrual-icon" />
              <h3>Menstrual Tracking</h3>
              <p>
                Track your cycle, mood, and flow — get smart insights to
                understand your body better.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
