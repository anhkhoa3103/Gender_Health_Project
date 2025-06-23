import React, { useEffect, useState, useContext } from 'react';
import { getUserAppointments, cancelAppointment, getAllSlot } from '../../../api/consultationApi';
import { getFeedbackByConsultationId } from '../../../api/feedbackApi';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "../style/Appoinments.css";
import HeaderSession from "../../components/Header";
import FeedbackForm from './Feedback';

const Appointments = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = user?.id;

  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [showFeedbackId, setShowFeedbackId] = useState(null);
  const [feedbackMap, setFeedbackMap] = useState({});

  const fetchAppointments = async () => {
    try {
      const res = await getUserAppointments(userId);

      // 🔽 Sắp xếp theo ngày và giờ
      const sorted = [...res.data].sort((a, b) => {
        const dateA = new Date(`${a.appointmentDate}T${a.timeRange?.split(' - ')[0] || '00:00'}`);
        const dateB = new Date(`${b.appointmentDate}T${b.timeRange?.split(' - ')[0] || '00:00'}`);
        return dateB - dateA;
      });

      setAppointments(sorted);

      // Load feedback
      const feedbackPromises = sorted.map(async (a) => {
        try {
          const feedbackRes = await getFeedbackByConsultationId(a.consultationId);
          return { consultationId: a.consultationId, feedback: feedbackRes.data };
        } catch (error) {
          console.error(`Error fetching feedback for consultation ${a.consultationId}:`, error);
          return { consultationId: a.consultationId, feedback: null };
        }
      });


      const allFeedbacks = await Promise.allSettled(feedbackPromises);
      const map = {};
      allFeedbacks.forEach(res => {
        if (res.status === "fulfilled") {
          const { consultationId, feedback } = res.value;
          if (feedback) map[consultationId] = feedback;
        }
      });
      setFeedbackMap(map);
    } catch (err) {
      console.error("Error loading appointments or feedbacks:", err);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchAppointments();
    fetchSlots();
  }, [userId]);


  const fetchSlots = async () => {
    try {
      const res = await getAllSlot();
      setSlots(res.data);
    } catch (err) {
      console.error("Error loading slots:", err);
    }
  };

  const handleCancel = async (appointmentId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmed) return;

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

  const toggleFeedback = (consultationId) => {
    if (showFeedbackId === consultationId) {
      setShowFeedbackId(null);
    } else {
      setShowFeedbackId(consultationId);
    }
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
                  <th>Consultant</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Meet Link</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a, index) => {
                  const feedback = feedbackMap[a.consultationId];
                  return (
                    <tr key={a.consultationId}>
                      <td>{index + 1}</td>
                      <td>{a.name}</td>
                      <td>{a.consultantName || 'N/A'}</td>
                      <td>{a.appointmentDate}</td>
                      <td>{a.timeRange || getSlotTime(a.workslotId)}</td>
                      <td className="meet-link_consultation">
                        {a.meetLink ? (
                          <a href={a.meetLink} target="_blank" rel="noopener noreferrer">Join</a>
                        ) : (
                          <span style={{ color: 'gray' }}>N/A</span>
                        )}
                      </td>
                      <td className={`status_hisconsultation ${a.status.toLowerCase()}`}>
                        {a.status}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {a.status === "PENDING" ? (
                          <button
                            onClick={() => handleCancel(a.consultationId)}
                            className="cancel-appointment-btn_hisconsultation"
                          >
                            Cancel
                          </button>
                        ) : a.status === "DONE" ? (
                          <button
                            onClick={() => toggleFeedback(a.consultationId)}
                            className="feedback-btn_hisconsultation"
                          >
                            {feedback ? 'View Feedback' : 'Feedback'}
                          </button>
                        ) : (
                          <span style={{ color: 'gray' }}>N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Feedback Form */}
            {showFeedbackId && userId && (
              <div className="feedback-section">
                <h3 style={{ marginTop: "20px" }}>
                  {feedbackMap[showFeedbackId] ? 'Edit/View Your Feedback' : 'Give Feedback'}
                </h3>
                <FeedbackForm
                  customerId={user.id}
                  consultantId={appointments.find(a => a.consultationId === showFeedbackId)?.consultantId}
                  consultationId={showFeedbackId}
                  initialFeedback={feedbackMap[showFeedbackId] || null}
                  onSuccess={() => {
                    setShowFeedbackId(null);
                    fetchAppointments(); // load lại để cập nhật feedbackMap
                  }}
                />
              </div>
            )}
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
