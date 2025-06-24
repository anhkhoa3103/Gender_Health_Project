import React, { useEffect, useState } from "react";
import axios from "axios";

const PerformanceTab = () => {
  const [consultantStats, setConsultantStats] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedConsultantId, setSelectedConsultantId] = useState(null);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("managementToken");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/admin/consultation/consultant-performance", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setConsultantStats(res.data))
      .catch((err) => console.error("Error fetching consultant stats:", err));
  }, []);

  const fetchConsultantFeedback = (consultantId) => {
    axios
      .get(`http://localhost:8080/api/admin/consultation/consultant-feedback/${consultantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFeedbackList(res.data))
      .catch((err) => {
        console.error("Error fetching feedback:", err);
        setFeedbackList([]);
      });
  };

  const filteredStats = consultantStats.filter((c) =>
    c.consultant_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h2>📈 Consultant Performance</h2>

      <input
        type="text"
        placeholder="Search by consultant name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px", padding: "6px", width: "300px" }}
      />

      <table className="user-table_admindashboard">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Total Appointments</th>
            <th>Completed</th>
            <th>Cancelled</th>
            <th>Total Feedback</th>
            <th>Avg. Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStats.map((c) => (
            <React.Fragment key={c.consultant_id}>
              <tr>
                <td>{c.consultant_id}</td>
                <td>{c.consultant_name}</td>
                <td>{c.total_appointments}</td>
                <td>{c.completed_appointments}</td>
                <td>{c.cancelled_appointments}</td>
                <td>{c.total_feedback}</td>
                <td>{parseFloat(c.average_rating).toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => {
                      if (selectedConsultantId === c.consultant_id) {
                        setSelectedConsultantId(null);
                        setFeedbackList([]);
                      } else {
                        setSelectedConsultantId(c.consultant_id);
                        fetchConsultantFeedback(c.consultant_id);
                      }
                    }}
                  >
                    🔍 View Details
                  </button>
                </td>
              </tr>
              {selectedConsultantId === c.consultant_id && (
                <tr>
                  <td colSpan="8" style={{ backgroundColor: "#f9f9f9" }}>
                    <div style={{ padding: "10px" }}>
                      <h4>👤 Consultant Info</h4>
                      <p><strong>Name:</strong> {c.consultant_name}</p>
                      <p><strong>Total Appointments:</strong> {c.total_appointments}</p>
                      <p><strong>Completed:</strong> {c.completed_appointments}</p>
                      <p><strong>Cancelled:</strong> {c.cancelled_appointments}</p>
                      <p><strong>Average Rating:</strong> {parseFloat(c.average_rating).toFixed(2)}</p>

                      <h4>💬 Feedback</h4>
                      {feedbackList.length > 0 ? (
                        <ul>
                          {feedbackList.map((fb, idx) => (
                            <li key={idx}>
                              <strong>{fb.customerName}</strong>: {fb.comment} – ⭐ {fb.rating}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No feedback available.</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {filteredStats.length === 0 && (
            <tr>
              <td colSpan="8">No consultant performance data.</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default PerformanceTab;
