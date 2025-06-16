import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'react-feather';
import "../style/BookingSuccess.css"

const BookingSuccess_consultation = () => {
  const navigate = useNavigate();

  const bookingData = {
    id: 1,
    name: "John Cena",
    service: "STI Testing",
    date: "2025/27/05",
    time: "9:30 AM",
    status: "Done"
  };

  return (
    <div className="booking-success-container_consultation">
      <div className="success-content_consultation">
        <div className="success-message_consultation">
          <CheckCircle size={48} className="success-icon_consultation" />
          <h2>Booking Successful</h2>
        </div>

        <div className="booking-details_consultation">
          <table className="booking-table_consultation">
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
                <td className={`status_consultation ${bookingData.status.toLowerCase()}`}>
                  {bookingData.status}
                </td>
                <td style={{ textAlign: 'center', backgroundColor: 'red', borderRadius: '15px' }}>
                  <button 
                    style={{ backgroundColor: 'red', color: 'white', borderRadius: '15px' }}
                    onClick={() => navigate('/consultation')}
                    className="book-again-btn_consultation"
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
          className="view-appointment-btn_consultation"
        >
          View your appointment
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess_consultation;
