import React, { useEffect, useState } from "react";
import axios from "axios";

const PerformanceTab = () => {
  const [consultantStats, setConsultantStats] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [updateRequests, setUpdateRequests] = useState([]);
  const [selectedConsultantId, setSelectedConsultantId] = useState(null);
  const [selectedConsultantInfo, setSelectedConsultantInfo] = useState(null);
  const [selectedUpdateRequest, setSelectedUpdateRequest] = useState(null);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("managementToken");

  useEffect(() => {
    fetchStats();
    fetchUpdateRequests();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/consultation/consultant-performance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConsultantStats(res.data);
    } catch (err) {
      console.error("Error fetching consultant stats:", err);
    }
  };

  const fetchUpdateRequests = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/consultation/consultant-update-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUpdateRequests(res.data);
    } catch (err) {
      console.error("Error fetching update requests:", err);
    }
  };

  const fetchConsultantFeedback = async (consultantId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/admin/consultation/consultant-feedback/${consultantId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbackList(res.data);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setFeedbackList([]);
    }
  };

  const fetchConsultantInfo = async (consultantId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/admin/consultation/consultant-info/${consultantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedConsultantInfo(res.data);
    } catch (err) {
      console.error("Error fetching consultant info:", err);
      setSelectedConsultantInfo(null);
    }
  };

  const handleReview = async (id, action) => {
    const reason = action === "reject" ? prompt("Lý do từ chối:") : null;
    try {
      await axios.put(
        `http://localhost:8080/api/admin/consultation/consultant-update-requests/${id}/review`,
        { action, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Đã xử lý yêu cầu.");
      setSelectedUpdateRequest(null);
      fetchUpdateRequests();
    } catch (err) {
      console.error("Error reviewing update request:", err);
      alert("Lỗi khi xử lý yêu cầu.");
    }
  };

  const getRequestByConsultantId = (id) =>
    updateRequests.find((r) => r.consultantId === id && r.status === "pending");

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

      <table className="user-table_adminconsultant">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Total</th>
            <th>Done</th>
            <th>Cancelled</th>
            <th>Feedback</th>
            <th>Rating</th>
            <th>Details</th>
            <th>Update Request</th>
          </tr>
        </thead>
        <tbody>
          {filteredStats.map((c) => {
            const updateReq = getRequestByConsultantId(c.consultant_id);
            return (
              <React.Fragment key={c.consultant_id}>
                <tr>
                  <td>{c.consultant_id}</td>
                  <td>{c.consultant_name}</td>
                  <td>{c.total_appointments}</td>
                  <td>{c.completed_appointments}</td>
                  <td>{c.cancelled_appointments}</td>
                  <td>{c.total_feedback}</td>
                  <td>
                    {parseFloat(c.average_rating).toFixed(2)}{" "}
                    {c.total_feedback > 0 && (
                      <button
                        className="rating-view-btn"
                        title="Xem đánh giá"
                        onClick={() => {
                          fetchConsultantFeedback(c.consultant_id);
                          setSelectedConsultantId(c.consultant_id); // để feedback hiện bên dưới
                        }}
                      >
                        🔎
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      className="info-view-btn"
                      onClick={() => {
                        if (selectedConsultantId === c.consultant_id && selectedConsultantInfo) {
                          setSelectedConsultantId(null);
                          setSelectedConsultantInfo(null);
                        } else {
                          fetchConsultantInfo(c.consultant_id);
                          setSelectedConsultantId(c.consultant_id);
                        }
                      }}
                    >
                      👁️ Xem thông tin
                    </button>
                  </td>
                  <td>
                    {updateReq ? (
                      <button onClick={() => setSelectedUpdateRequest(updateReq)}>
                        📝 View Request
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>

                {selectedConsultantId === c.consultant_id && (
                  <tr>
                    <td colSpan="9" style={{ backgroundColor: "#f9f9f9" }}>
                      <div style={{ display: "flex", gap: "30px", padding: "10px" }}>
                        {selectedConsultantInfo && (
                          <div className="consultant-info_adminconsultant">
                            <div className="consultant-avatar_adminconsultant">
                              <img
                                src={selectedConsultantInfo.avatar}
                                alt="avatar"
                                className="avatar-image_adminconsultant"
                              />
                              <h4 className="consultant-name_adminconsultant">{selectedConsultantInfo.fullName}</h4>
                            </div>
                            <div className="consultant-details_adminconsultant">
                              <p><strong>Chuyên môn:</strong> {selectedConsultantInfo.specialization}</p>
                              <p><strong>Trình độ:</strong> {selectedConsultantInfo.qualification}</p>
                              <p><strong>Kinh nghiệm:</strong> {selectedConsultantInfo.experiencedYears} năm</p>
                              <p><strong>Google Meet:</strong> <a href={selectedConsultantInfo.googleMeetLinks} target="_blank" rel="noreferrer">Tham gia</a></p>
                            </div>
                          </div>
                        )}

                        {/* Feedback nếu có */}
                        {feedbackList.length > 0 && (
                          <div>
                            <h4>💬 Feedback</h4>
                            <ul>
                              {feedbackList.map((fb, idx) => (
                                <li key={idx}>
                                  <strong>{fb.customerName}</strong>: {fb.comment} – ⭐ {fb.rating}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {/* Overlay Modal for Update Request */}
      {selectedUpdateRequest && (
        <div className="overlay_updateRequest">
          <div className="modal_updateRequest">
            <h3>📝 Consultant Update Request</h3>
            <p><strong>Specialization:</strong> {selectedUpdateRequest.specialization}</p>
            <p><strong>Qualification:</strong> {selectedUpdateRequest.qualification}</p>
            <p><strong>Experience (Years):</strong> {selectedUpdateRequest.experiencedYears}</p>
            <p><strong>Google Meet Link:</strong> {selectedUpdateRequest.googleMeetLinks}</p>

            <div className="modal-actions">
              <button onClick={() => handleReview(selectedUpdateRequest.id, "approve")}>
                ✅ Approve
              </button>
              <button onClick={() => handleReview(selectedUpdateRequest.id, "reject")}>
                ❌ Reject
              </button>
              <button onClick={() => setSelectedUpdateRequest(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PerformanceTab;
