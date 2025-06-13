import React from 'react';
import "../style/BookAppointment.css";

const BookAppointment = () => {
  return (
    <div className="book-appointment-container">
      <h1 className="book-appointment-title">Book your appointment now</h1>
      <p className="book-appointment-subtitle">So our team can reach out to you on time</p>
      
      <div className="book-appointment-form">
        <div className="form-row">
          <div className="form-column">
            <label>Full Name</label>
            <input type="text" className="form-input" />
          </div>
          <div className="form-column">
            <label>Available Date</label>
            <input type="date" className="form-input" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <label>Email</label>
            <input type="email" className="form-input" />
          </div>
          <div className="form-column">
            <label>Select</label>
            <select className="form-input">
              <option value="">Choose an option</option>
              {/* Thêm các option khác nếu cần */}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <label>Phone Number</label>
            <div className="phone-input-container">
              <span className="phone-prefix">+971</span>
              <input type="tel" className="form-input phone-input" />
            </div>
          </div>
          <div className="form-column">
            <label>Note</label>
            <input type="text" className="form-input" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-column full-width">
            <label>Message</label>
            <textarea className="form-textarea"></textarea>
          </div>
        </div>

        <button className="book-now-button">
          Book Now →
        </button>
      </div>
    </div>
  );
};

export default BookAppointment;