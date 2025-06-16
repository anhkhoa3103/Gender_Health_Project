import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'react-feather';
import { getUserAppointments, cancelAppointment, getAllSlot } from '../../../api/consultationApi';
import { AuthContext } from '../../../context/AuthContext';
import "../style/Appoinments.css";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const [slots, setSlots] = useState([]);
  const [latestAppointment, setLatestAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      getUserAppointments(userId)
        .then(res => {
          const sortedAppointments = res.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setLatestAppointment(sortedAppointments[0]);
        })
        .catch(err => console.error("Error fetching appointments:", err))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  useEffect(() => {
    getAllSlot()
      .then(res => setSlots(res.data))
      .catch(err => console.error("Failed to load slots:", err));
  }, []);

  const handleCancel = async () => {
    try {
      if (latestAppointment) {
        await cancelAppointment(latestAppointment.id);
        setLatestAppointment(prev => ({ ...prev, status: "CANCELLED" }));
      }
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Failed to cancel appointment");
    }
  };

  const getSlotTime = (slotId) => {
    const slot = slots.find(s => s.slotId === slotId);
    if (!slot) return "Unknown time";
    const start = slot.startTime?.slice(0, 5);
    const end = slot.endTime?.slice(0, 5);
    return `${start} - ${end}`;
  };

  return (
    <div className="booking-success-container_hisconsultation">
      <div className="success-content_hisconsultation">
        <div className="success-message_hisconsultation">
          <CheckCircle size={48} className="success-icon_hisconsultation" />
          <h2>Booking Successful</h2>
        </div>

        {loading ? (
          <p>Loading appointment...</p>
        ) : !latestAppointment ? (
          <p>No appointment found.</p>
        ) : (
          <div className="booking-details_hisconsultation">
            <table className="booking-table_hisconsultation">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Time</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{latestAppointment.id}</td>
                  <td>{latestAppointment.name}</td>
                  <td>{getSlotTime(latestAppointment.workslotId)}</td>
                  <td>{latestAppointment.appointmentDate}</td>
                  <td className={`status_hisconsultation ${latestAppointment.status.toLowerCase()}`}>
                    {latestAppointment.status}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {latestAppointment.status === "PENDING" ? (
                      <button
                        onClick={handleCancel}
                        className="cancel-appointment-btn_hisconsultation"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span style={{ color: 'gray' }}>N/A</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button
            onClick={() => navigate('/consultation')}
            className="view-appointment-btn_hisconsultation"
          >
            Book Another
          </button>
          <button
            onClick={() => navigate('/appointments')}
            className="view-appointment-btn_hisconsultation"
            style={{ backgroundColor: '#4a90e2' }}
          >
            View Appointment History
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
