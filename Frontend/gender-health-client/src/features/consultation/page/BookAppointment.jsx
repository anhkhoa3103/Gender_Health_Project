import api from '../../../api/axios';
import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createAppointment } from '../../../api/consultationApi';
import "../style/BookAppointment.css";
import { AuthContext } from '../../../context/AuthContext';


const BookAppointment_consultation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy data từ state khi chuyển qua trang này
  const { consultant, date, time, slotId, workslotId , year, month } = location.state || {};
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!consultant || !date || !time) {
    return <p>Error: Missing appointment data. Please start booking again.</p>;
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim()) {
      alert('Please fill in your full name and phone number.');
      return;
    }

    const appointmentDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    console.log('customerId:', userId);
    console.log('consultantId:', consultant.userId);
    console.log('workslotId:', slotId);

    if (!workslotId) {
      alert("Invalid timeslot selected. Please go back and choose again.");
      return;
    }
    const appointmentPayload = {
      customerId: String(userId),
      consultantId: String(consultant.userId),
      appointmentDate,
      status: "PENDING",
      workslotId: workslotId,
      name: fullName.trim(),
      phoneNumber: phone.trim(),
      note: note.trim(),
      message: message.trim(), // thêm message vào payload nếu backend hỗ trợ
    };

    setLoading(true);
    try {
      await createAppointment(appointmentPayload);
      alert('Booking successful!');
      navigate('/bookingsuccess');  // Chuyển về trang Home sau khi đặt lịch thành công
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-appointment-container_consultation">
      <h1 className="book-appointment-title_consultation">Book your appointment now</h1>
      <p className="book-appointment-subtitle_consultation">So our team can reach out to you on time</p>

      <div className="book-appointment-info_consultation" style={{ marginBottom: 20 }}>
        <p><strong>Customer ID:</strong> {userId || "Not logged in"}</p>
        <p><strong>Consultant:</strong> {consultant.fullName || consultant.name}</p>
        <p><strong>Date:</strong> {date} {monthNames[month]} {year}</p>
        <p><strong>Time:</strong> {time}</p>
        <p><strong>Workslot id:</strong> {workslotId}</p>
        <p><strong>Slot id:</strong> {slotId}</p>
      </div>

      <form className="book-appointment-form_consultation" onSubmit={handleSubmit}>
        <div className="form-row_consultation">
          <div className="form-column_consultation">
            <label>Full Name</label>
            <input
              type="text"
              className="form-input_consultation"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              placeholder="Your full name"
            />
          </div>
          <div className="form-column_consultation">
            <label>Phone Number</label>
            <div className="phone-input-container_consultation">
              <span className="phone-prefix_consultation">+84</span>
              <input
                type="tel"
                className="form-input_consultation phone-input_consultation"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                placeholder="Phone number"
              />
            </div>
          </div>
        </div>

        <div className="form-row_consultation">
          <div className="form-column_consultation full-width_consultation">
            <label>Note</label>
            <input
              type="text"
              className="form-input_consultation"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Additional notes (optional)"
            />
          </div>
        </div>

        <div className="form-row_consultation">
          <div className="form-column_consultation full-width_consultation">
            <label>Message</label>
            <textarea
              className="form-textarea_consultation"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Your message"
            />
          </div>
        </div>

        <button
          type="submit"
          className="book-now-button_consultation"
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Now →"}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment_consultation;
