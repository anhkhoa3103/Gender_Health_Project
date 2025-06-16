import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../style/Feedback.css"


const Feedback_consultation = () => {
  const navigate = useNavigate();

  return (
    <div className="feedback-container_consultation">
      <header className="feedback-header_consultation">
        <h1>Gender Healthcare System</h1>
        <p>for SWP Project</p>
      </header>

      <main className="feedback-content_consultation">
        <section className="feedback-thanks_consultation">
          <h2>Thanks for your Feedback!</h2>
          <p className="feedback-subtitle_consultation">Nice hearing from you!</p>
        </section>

        <div className="divider_consultation"></div>

        <section className="feedback-contact_consultation">
          <h3>Lets Get in Touch!</h3>
          <p className="contact-description_consultation">
            Are you satisfied or need support? Please send us your content via message or contact from below. 
            We look forward to supporting you.
          </p>
        </section>

        <div className="divider_consultation"></div>

        <section className="feedback-details_consultation">
          <div className="detail-item_consultation">
            <span className="detail-label_consultation">Service ID:</span>
            <span className="detail-value_consultation">1</span>
          </div>
          <div className="detail-item_consultation">
            <span className="detail-label_consultation">Service Name:</span>
            <span className="detail-value_consultation">General Check-up</span>
          </div>
          <div className="detail-item_consultation">
            <span className="detail-label_consultation">Consultant:</span>
            <span className="detail-value_consultation">Jock William</span>
          </div>
          <div className="detail-item_consultation message-box_consultation">
            <span className="detail-label_consultation">Message:</span>
            <textarea 
              className="feedback-textarea_consultation" 
              placeholder="Enter feedback here..."
            ></textarea>
          </div>
        </section>

        <div className="feedback-buttons_consultation">
          <button 
            className="cancel-btn_consultation"
            onClick={() => navigate(-1)} // Quay lại trang trước
          >
            Cancel
          </button>
          <button className="submit-btn_consultation">
            Submit
          </button>
        </div>

        <div className="divider_consultation"></div>

        <footer className="feedback-footer_consultation">
          <div className="office-info_consultation">
            <h4>Head Office:</h4>
            <p>+447473997191</p>
            <p>sybexdesigns@gmail.com</p>
            <p>2008 Boulevard Henri-Bourassa Est</p>
          </div>
          
          <div className="office-info_consultation">
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

export default Feedback_consultation;
