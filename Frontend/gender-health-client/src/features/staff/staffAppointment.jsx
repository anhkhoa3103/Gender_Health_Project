import React, { useEffect, useState } from "react";
import { getAllAppointments, updateAppointmentStatus } from "../../api/stiAppointment";
import "./styles/staffAppointments.css";
import Sidebar from "../components/sidebar";

// --- Toast for alerts ---
function Toast({ open, message, onClose, type }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        bottom: 26,
        left: "50%",
        transform: "translateX(-50%)",
        background: type === "error" ? "#ef4444" : "#2563eb",
        color: "#fff",
        padding: "13px 30px",
        borderRadius: 9,
        zIndex: 9999,
        fontSize: 17,
        minWidth: 240,
        boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
        textAlign: "center",
        cursor: "pointer",
        fontWeight: 500,
        letterSpacing: 0.5
      }}
    >
      {message}
    </div>
  );
}

// --- Main table spinner ---
function MainListSpinner() {
  return <span className="mainlist-spinner_staffappointments" />;
}

// --- Change status button spinner ---
function ChangeStatusSpinner() {
  return (
    <span className="change-status-spinner_staffappointments" />
  );
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdates, setStatusUpdates] = useState({});
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("info");
  const [changingStatusId, setChangingStatusId] = useState(null); // <-- for button loading

  const managementToken = localStorage.getItem("managementToken");
  const staffId = localStorage.getItem("userId");

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${managementToken}`,
    },
  };

  const [filterStatus, setFilterStatus] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await getAllAppointments(authHeaders);
        const data = Array.isArray(response.data) ? response.data : response;
        setAppointments(data);
        setFilteredAppointments(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load appointments");
        setLoading(false);
        setToastType("error");
        setToastMsg("Failed to load appointments.");
        setToastOpen(true);
        setTimeout(() => setToastOpen(false), 2200);
      }
    };
    fetchAppointments();
    // eslint-disable-next-line
  }, []);

  // Search by all fields
  useEffect(() => {
    let filtered = appointments;

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((item) => {
        const allFields = [
          item.appointmentId,
          item.customerName,
          item.customerPhone,
          item.status,
          item.amount,
        ]
          .map((v) => (v === undefined || v === null ? "" : String(v)))
          .join(" ")
          .toLowerCase();
        return allFields.includes(s);
      });
    }

    if (filterStatus) {
      filtered = filtered.filter((item) => item.status?.toLowerCase() === filterStatus.toLowerCase());
    }

    if (minAmount) {
      filtered = filtered.filter((item) => Number(item.amount) >= Number(minAmount));
    }

    if (maxAmount) {
      filtered = filtered.filter((item) => Number(item.amount) <= Number(maxAmount));
    }

    setFilteredAppointments(filtered);
  }, [search, appointments, filterStatus, minAmount, maxAmount]);

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
      setToastType("error");
      setToastMsg("Staff are not allowed to set status to 'Completed'.");
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 2200);
      return;
    }
    setChangingStatusId(appointmentId);
    try {
      await updateAppointmentStatus(appointmentId, newStatus, staffId, authHeaders);
      setAppointments((prev) =>
        prev.map((a) =>
          a.appointmentId === appointmentId
            ? { ...a, status: newStatus }
            : a
        )
      );
      setToastType("info");
      setToastMsg("Status updated!");
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 2200);
    } catch (err) {
      setToastType("error");
      setToastMsg("Failed to update status.");
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 2200);
    }
    setChangingStatusId(null);
  };

  return (
    <>
      <Sidebar />
      <div className="appointment-container_staffappointments">
        <h2 className="appointment-title_staffappointments">All Appointments</h2>

        <div className="filter-bar_staffappointments">
          <input
            className="appointment-search-input_staffappointments"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="filter-select_staffappointments"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="sampling">Sampling</option>
            <option value="sampled">Sampled</option>
            <option value="canceled">Canceled</option>
          </select>
          <select
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="filter-select_staffappointments"
          >
            <option value="">Min Amount</option>
            <option value="100000">100000</option>
            <option value="200000">200000</option>
            <option value="400000">400000</option>
            <option value="800000">800000</option>
            <option value="1200000">1200000</option>
            <option value="1600000">1600000</option>
            <option value="2000000">2000000</option>
          </select>

          <select
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="filter-select_staffappointments"
          >
            <option value="">Max Amount</option>
            <option value="100000">100000</option>
            <option value="200000">200000</option>
            <option value="400000">400000</option>
            <option value="800000">800000</option>
            <option value="1200000">1200000</option>
            <option value="1600000">1600000</option>
            <option value="2000000">2000000</option>
          </select>
        </div>

        {error && <div className="error_staffappointments">{error}</div>}
        {loading ? (
          <div>
            <MainListSpinner />
            <div style={{ textAlign: "center", marginTop: 14, color: "#888" }}>
              Loading appointments...
            </div>
          </div>
        ) : (
          <table className="appointment-table_staffappointments">
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Customer Name</th>
                <th>Customer Phone</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((item) => (
                <tr key={item.appointmentId}>
                  <td>{item.appointmentId}</td>
                  <td>{item.customerName ?? "N/A"}</td>
                  <td>{item.customerPhone ?? "N/A"}</td>
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
                      disabled={changingStatusId === item.appointmentId}
                    >
                      <option value="pending">Pending</option>
                      <option value="sampling">Sampling</option>
                      <option value="sampled">Sampled</option>
                      <option value="canceled">Canceled</option>
                    </select>
                    <button
                      onClick={() => handleUpdateClick(item.appointmentId)}
                      className="change-status-btn_staffappointments"
                      disabled={changingStatusId === item.appointmentId}
                      style={{ minWidth: 80 }}
                    >
                      {changingStatusId === item.appointmentId ? (
                        <>
                          <ChangeStatusSpinner />
                          <span style={{ marginLeft: 7, fontWeight: 500 }}>Saving...</span>
                        </>
                      ) : (
                        "Change"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Toast
          open={toastOpen}
          message={toastMsg}
          type={toastType}
          onClose={() => setToastOpen(false)}
        />
      </div>
    </>
  );
}