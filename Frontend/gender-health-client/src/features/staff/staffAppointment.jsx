import React, { useEffect, useState } from "react";
import { getAllAppointments, updateAppointmentStatus } from "../../api/stiAppointment";
import "./styles/staffAppointments.css";
import Sidebar from "../components/sidebar";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdates, setStatusUpdates] = useState({});

  const managementToken = localStorage.getItem("managementToken");
  const staffId = localStorage.getItem("userId");

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${managementToken}`,
    },
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAllAppointments(authHeaders);
        const data = Array.isArray(response.data) ? response.data : response;
        setAppointments(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load appointments");
        setLoading(false);
      }
    };
    fetchAppointments();
    // eslint-disable-next-line
  }, []);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-badge_staffappointments status-pending_staffappointments";
      case "completed":
        return "status-badge_staffappointments status-completed_staffappointments";
      case "canceled":
        return "status-badge_staffappointments status-canceled_staffappointments";
      case "sampled":
        return "status-badge_staffappointments status-sampled_staffappointments";
      case "sampling":
        return "status-badge_staffappointments status-sampling_staffappointments";
      default:
        return "status-badge_staffappointments";
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setStatusUpdates((prev) => ({ ...prev, [id]: newStatus }));
  };

  const handleUpdateClick = async (appointmentId) => {
    const newStatus = statusUpdates[appointmentId];
    if (!newStatus) return;
    if (newStatus === "completed") {
      alert("Staff are not allowed to set status to 'Completed'.");
      return;
    }
    try {
      await updateAppointmentStatus(appointmentId, newStatus, staffId, authHeaders);
      setAppointments((prev) =>
        prev.map((a) =>
          a.appointmentId === appointmentId
            ? { ...a, status: newStatus }
            : a
        )
      );
      alert("Status updated!");
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <>
      <Sidebar />
      <div className="appointment-container_staffappointments">
        <h2 className="appointment-title_staffappointments">All Appointments</h2>

        {error && <div className="error_staffappointments">{error}</div>}
        {loading && <div className="loading_staffappointments">Loading...</div>}

        {!loading && !error && (
          <table className="appointment-table_staffappointments">
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Customer Name</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr key={item.appointmentId}>
                  <td>{item.appointmentId}</td>
                  <td>{item.customerName ?? "N/A"}</td>
                  <td>
                    <span className={getStatusClass(item.status)}>
                      {item.status || "N/A"}
                    </span>
                  </td>
                  <td>
                    {typeof item.amount === "number"
                      ? item.amount.toLocaleString()
                      : item.amount}
                  </td>
                  <td>
                    <select
                      value={statusUpdates[item.appointmentId] || item.status}
                      onChange={(e) =>
                        handleStatusChange(item.appointmentId, e.target.value)
                      }
                      className="status-select_staffappointments"
                    >
                      <option value="pending">Pending</option>
                      <option value="sampling">Sampling</option>
                      <option value="sampled">Sampled</option>
                      <option value="canceled">Canceled</option>
                    </select>
                    <button
                      onClick={() => handleUpdateClick(item.appointmentId)}
                      className="change-status-btn_staffappointments"
                    >
                      Change
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
