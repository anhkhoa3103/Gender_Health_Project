import React, { useEffect, useState } from "react";
import { getAllAppointments, updateAppointmentStatus } from "../../../api/stiAppointment";
import "../styles/appointment-list.css";

// Remove the useContext/AuthContext part, use localStorage instead

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdates, setStatusUpdates] = useState({});

  // Get management info from localStorage
  const managementToken = localStorage.getItem("managementToken");
  const staffId = localStorage.getItem("userId"); // management staff's userId

  // Helper to attach token to all requests
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${managementToken}`,
    },
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Pass headers if your API requires token for this endpoint (often it does for staff)
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
        return "status-badge status-pending";
      case "completed":
        return "status-badge status-completed";
      case "canceled":
        return "status-badge status-canceled";
      case "sampled":
        return "status-badge status-sampled";
      default:
        return "status-badge";
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setStatusUpdates((prev) => ({ ...prev, [id]: newStatus }));
  };

  // UPDATE: Use staffId and management token
  const handleUpdateClick = async (appointmentId) => {
    const newStatus = statusUpdates[appointmentId];
    if (!newStatus) return;
    try {
      await updateAppointmentStatus(
        appointmentId,
        newStatus,
        staffId,
        authHeaders // Pass headers for authentication
      );
      setAppointments((prev) =>
        prev.map((a) =>
          a.appointmentId === appointmentId
            ? {
                ...a,
                status: newStatus,
                // You could set staffName, etc, if you want
              }
            : a
        )
      );
      alert("Status updated!");
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (error)
    return (
      <div className="appointment-container">
        <h2 className="appointment-title">All Appointments</h2>
        <div style={{ color: "#e02424" }}>{error}</div>
      </div>
    );
  if (loading)
    return (
      <div className="appointment-container">
        <h2 className="appointment-title">All Appointments</h2>
        <div>Loading...</div>
      </div>
    );
  if (!Array.isArray(appointments))
    return (
      <div className="appointment-container">
        <h2 className="appointment-title">All Appointments</h2>
        <div style={{ color: "#e02424" }}>Appointments data error: Not an array.</div>
      </div>
    );

  return (
    <div className="appointment-container">
      <h2 className="appointment-title">All Appointments</h2>
      <table className="appointment-table">
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>Customer Name</th>
            <th>Staff Name</th>
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
              <td>{item.staffName ?? "N/A"}</td>
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
                  onChange={(e) => handleStatusChange(item.appointmentId, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="sampling">Sampling</option>
                  <option value="sampled">Sampled</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
                <button
                  style={{
                    marginLeft: "8px",
                    padding: "6px 14px",
                    borderRadius: "5px",
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                  onClick={() => handleUpdateClick(item.appointmentId)}
                >
                  Change
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
