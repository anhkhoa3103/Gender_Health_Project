import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header.jsx";
import "../styles/HomePage.css";
import LoginPromptModal from "../../components/LoginPromptModal";
import HomeSession from "../sessions/HomeSession.jsx";
import AboutSession from "../sessions/AboutSession.jsx";
import BlogSession from "../sessions/BlogSession.jsx";
import ContactSession from "../sessions/ContactSession.jsx";
import FooterSession from "../sessions/FooterSession.jsx";
import { AuthContext } from "../../../context/AuthContext";

// ✅ Import icon từ react-icons
import { FaStethoscope, FaVial, FaCalendarAlt } from "react-icons/fa";

const Homepage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const userId = user?.id || null;

  const handleClickMenstrual = () => {
    if (!userId) {
      setShowLoginPrompt(true);
    } else {
      navigate(`/menstrual/${userId}`);
    }
  };

  const handleClickConsultation = () => {
    if (!userId) {
      setShowLoginPrompt(true);
    } else {
      navigate("/consultation");
    }
  };

  const handleClickSTI = () => {
    if (!userId) {
      setShowLoginPrompt(true);
    } else {
      navigate("/package");
    }
  };

  return (
    <>
      <div className="header-section">
        <Header activePage="home" />
      </div>

      <div className="home-session" id="home">
        <HomeSession />
      </div>

      <div className="homepage-container">
        <section className="about-session" id="about">
          <AboutSession />
        </section>

        <section className="blog-session" id="blog">
          <BlogSession />
        </section>

        <main className="main-content">
          <div className="service-session" id="service">
            <h2 className="main-title">
              Our <span className="highlight">Main Services</span> Categories
            </h2>

            <div className="service-cards">
              <div
                className="service-card"
                onClick={handleClickConsultation}
                style={{ cursor: "pointer" }}
              >
                <div className="icon-wrapper">
                  <div className="icon-circle">
                    <FaStethoscope />
                  </div>
                </div>
                <h3>Consultation Booking</h3>
                <p>
                  You can connect directly, quickly and easily, and there is no
                  need to doubt the quality of the consultation and treatment
                  offered.
                </p>
              </div>

              <div
                className="service-card sti-card"
                onClick={handleClickSTI}
                style={{ cursor: "pointer" }}
              >
                <div className="icon-wrapper">
                  <div className="icon-circle">
                    <FaVial />
                  </div>
                </div>
                <h3>STI Testing</h3>
                <p>
                  Quick, confidential STI testing with clear results and
                  guidance — take control of your sexual health.
                </p>
              </div>

              <div
                className="service-card"
                onClick={handleClickMenstrual}
                style={{ cursor: "pointer" }}
              >
                <div className="icon-wrapper">
                  <div className="icon-circle">
                    <FaCalendarAlt />
                  </div>
                </div>
                <h3>Menstrual Tracking</h3>
                <p>
                  Track your cycle, mood, and flow — get smart insights to
                  understand your body better.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <section className="contact-session-home" id="contact">
        <ContactSession />
      </section>

      <FooterSession />

      {showLoginPrompt && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}
    </>
  );
};

export default Homepage;
