import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../style/BookingSuccess.css";
import { CheckCircle } from 'react-feather';

const BookingSuccess = () => {
  const navigate = useNavigate();

  // Dummy data - bạn có thể thay bằng dữ liệu từ state hoặc API
  const bookingData = {
    id: 1,
    name: "John Cena",
    service: "STI Testing",
    date: "2025/27/05",
    time: "9:30 AM",
    status: "Done"
  };

  return (
    <div className="booking-success-container">
      <header className="success-header">
        <h1>Gender Healthcare System</h1>
        <p>for SMP Project</p>
        <nav className="nav-menu">
          <a href="#">Name</a>
          <a href="#">About Us</a>
          <a href="#">Services</a>
          <a href="#">Blog</a>
          <a href="#">Contact Us</a>
        </nav>
      </header>

      <div className="success-content">
        <div className="success-message">
          <CheckCircle size={48} className="success-icon" />
          <h2>Booking Successful</h2>
        </div>

        <div className="booking-details">
          <table className="booking-table">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>Name</th>
                <th>Service Type</th>
                <th>Timing</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{bookingData.id}</td>
                <td>{bookingData.name}</td>
                <td>{bookingData.service}</td>
                <td>{bookingData.date} {bookingData.time}</td>
                <td className={`status ${bookingData.status.toLowerCase()}`}>
                  {bookingData.status}
                </td>
                <td style={{ textAlign: 'center', backgroundColor: 'red', borderRadius: '15px' }}>
                    <button style={{ backgroundColor: 'red', color: 'white', borderRadius: '15px' }}
                        onClick={() => navigate('/consultation')}
                        className="book-again-btn"
                    >
                       Cancel
                    </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button 
          onClick={() => navigate('/appointments')}
          className="view-appointment-btn"
        >
          View your appointment
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess;