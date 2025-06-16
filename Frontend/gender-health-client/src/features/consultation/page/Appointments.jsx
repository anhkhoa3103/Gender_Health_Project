import React, { useEffect, useState, useContext } from 'react';
import { getUserAppointments, cancelAppointment, getAllSlot } from '../../../api/consultationApi';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "../style/Appoinments.css";
import HeaderSession from "../../components/Header";

const Appointments = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = user?.id;

  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchAppointments();
      fetchSlots();
    }
  }, [userId]);

  const fetchAppointments = async () => {
    try {
      const res = await getUserAppointments(userId);
      setAppointments(res.data);
    } catch (err) {
      console.error("Error loading appointments:", err);
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await getAllSlot();
      setSlots(res.data);
    } catch (err) {
      console.error("Error loading slots:", err);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await cancelAppointment(appointmentId);
      fetchAppointments();
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  const getSlotTime = (slotId) => {
    const slot = slots.find(s => s.slotId === slotId);
    if (!slot) return "Unknown";
    const start = slot.startTime?.slice(0, 5);
    const end = slot.endTime?.slice(0, 5);
    return `${start} - ${end}`;
  };

  return (
    <>
      <div className="header-section">
        <HeaderSession />
      </div>
      <div className="booking-success-container_hisconsultation">
        <div className="success-content_hisconsultation">
          <h2>Your Appointments</h2>
          <div className="booking-details_hisconsultation">
            <table className="booking-table_hisconsultation">
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a, index) => (
                  <tr key={a.id}>
                    <td>{index + 1}</td>
                    <td>{a.name}</td>
                    <td>{a.appointmentDate}</td>
                    <td>{getSlotTime(a.workslotId)}</td>
                    <td className={`status_hisconsultation ${a.status.toLowerCase()}`}>
                      {a.status}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {a.status === "PENDING" ? (
                        <button
                          onClick={() => handleCancel(a.id)}
                          className="cancel-appointment-btn_hisconsultation"
                        >
                          Cancel
                        </button>
                      ) : a.status === "DONE" ? (
                        <button
                          onClick={() => alert("Redirect to feedback form...")}
                          className="feedback-btn_hisconsultation"
                        >
                          Feedback
                        </button>
                      ) : (
                        <span style={{ color: 'gray' }}>N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => navigate('/consultation')}
            className="view-appointment-btn_hisconsultation"
          >
            Book New Appointment
          </button>
        </div>
      </div>
    </>
  );
};

export default Appointments;
