import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../style/Feedback.css";

const Feedback = () => {
  const navigate = useNavigate();

  return (
    <div className="feedback-container">
      <header className="feedback-header">
        <h1>Gender Healthcare System</h1>
        <p>for SWP Project</p>
      </header>

      <main className="feedback-content">
        <section className="feedback-thanks">
          <h2>Thanks for your Feedback!</h2>
          <p className="feedback-subtitle">Nice hearing from you!</p>
        </section>

        <div className="divider"></div>

        <section className="feedback-contact">
          <h3>Lets Get in Touch!</h3>
          <p className="contact-description">
            Are you satisfied or need support? Please send us your content via message or contact from below. 
            We look forward to supporting you.
          </p>
        </section>

        <div className="divider"></div>

        <section className="feedback-details">
          <div className="detail-item">
            <span className="detail-label">Service ID:</span>
            <span className="detail-value">1</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Service Name:</span>
            <span className="detail-value">General Check-up</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Consultant:</span>
            <span className="detail-value">Jock William</span>
          </div>
          <div className="detail-item message-box">
            <span className="detail-label">Message:</span>
            <textarea 
              className="feedback-textarea" 
              placeholder="Enter feedback here..."
            ></textarea>
          </div>
        </section>

        <div className="feedback-buttons">
          <button 
            className="cancel-btn"
            onClick={() => navigate(-1)} // Quay lại trang trước
          >
            Cancel
          </button>
          <button className="submit-btn">
            Submit
          </button>
        </div>

        <div className="divider"></div>

        <footer className="feedback-footer">
          <div className="office-info">
            <h4>Head Office:</h4>
            <p>+447473997191</p>
            <p>sybexdesigns@gmail.com</p>
            <p>2008 Boulevard Henri-Bourassa Est</p>
          </div>
          
          <div className="office-info">
            <h4>Branch Office:</h4>
            <p>+447473997191</p>
            <p>sybexdesigns@gmail.com</p>
            <p>2008 Boulevard Henri-Bourassa Est</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Feedback;