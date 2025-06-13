import React from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Router, Route } from "react-router-dom";
import Header from "../../components/Header.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import LoginPromptModal from "../../components/LoginPromptModal";


const Homepage = () => {

  const navigate = useNavigate();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleClickMenstrual = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setShowLoginPrompt(true);
    } else {
      navigate(`/menstrual/${userId}`);
    }
  };

  const handleClickConsultation = () => {
  navigate("/consultation");
};

  return (
    <>
      <Header activePage="service" />

      <div className="homepage-container">


        <main className="main-content">
          <h2 className="main-title">
            Our <span className="highlight">Main Services</span> Categories
          </h2>

          <div className="service-cards">
            <div
  className="service-card"
  onClick={handleClickConsultation}
  style={{ cursor: "pointer" }}
>
              <div className="icon consultation-icon" />
              <h3>Consultation Booking</h3>
              <p>
                You can connect directly, quickly and easily, and there is no
                need to doubt the quality of the consultation and treatment
                offered.
              </p>
            </div>

            <div className="service-card sti-card">
              <div className="icon sti-icon"/>
              <h3>STI Testing</h3>
              <p>
                Quick, confidential STI testing with clear results and guidance
                — take control of your sexual health.
              </p>
            </div>

            <div
              className="service-card"
              onClick={handleClickMenstrual}
              style={{ cursor: "pointer" }}
            >
              <div className="icon menstrual-icon" />
              <h3>Menstrual Tracking</h3>
              <p>
                Track your cycle, mood, and flow — get smart insights to
                understand your body better.
              </p>
            </div>
          </div>
        </main>
      </div>
      {showLoginPrompt && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}
    </>
  );
};

export default Homepage;
