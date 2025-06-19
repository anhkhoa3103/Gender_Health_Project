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
          console.log("Appointments:", res.data);
          const sortedAppointments = res.data.sort(
            (a, b) => b.consultationId - a.consultationId
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

  const handleCancel = async (appointmentId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmed) return;

    try {
      await cancelAppointment(appointmentId);
      navigate('/consultation');
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  const getSlotTime = (workslotId) => {
    const slot = slots.find(s => s.slotId === workslotId);
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
                  <th>Customer</th>
                  <th>Consultant</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Meet</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{latestAppointment.consultationId}</td>
                  <td>{latestAppointment.name}</td>
                  <td>{latestAppointment.consultantName || "N/A"}</td>
                  <td>{latestAppointment.appointmentDate}</td>
                  <td>{latestAppointment.timeRange || getSlotTime(latestAppointment.workslotId)}</td>
                  <td className={`status_hisconsultation ${latestAppointment.status.toLowerCase()}`}>
                    {latestAppointment.status}
                  </td>
                  <td>
                    {latestAppointment.meetLink ? (
                      <a href={latestAppointment.meetLink} target="_blank" rel="noopener noreferrer">Join</a>
                    ) : "N/A"}
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
