import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../features/components/sidebar";
import "./styles/ConsultantProfile.css";

const ConsultantProfile = () => {
  const token = localStorage.getItem("managementToken");
  const consultantId = localStorage.getItem("userId");

  const [consultant, setConsultant] = useState(null);
  const [formData, setFormData] = useState({
    specialization: "",
    qualification: "",
    experiencedYears: "",
    googleMeetLinks: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchConsultantInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/consultants/${consultantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConsultant(res.data);
        setFormData({
          specialization: res.data.specialization || "",
          qualification: res.data.qualification || "",
          experiencedYears: res.data.experiencedYears || "",
          googleMeetLinks: res.data.googleMeetLinks || "",
        });
      } catch (error) {
        console.error("❌ Không thể lấy thông tin consultant:", error);
      }
    };

    if (consultantId) {
      fetchConsultantInfo();
    }
  }, [consultantId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitRequest = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/consultants/update-request",
        { consultantId: parseInt(consultantId), ...formData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("✅ " + res.data);
    } catch (error) {
      console.error("❌ Gửi yêu cầu thất bại:", error);
      setMessage("❌ " + (error.response?.data || "Lỗi không xác định"));
    }
  };

  return (
    <div className="profile-container_consultant">
      <Sidebar />
      <div className="profile-content_consultant">
        <h2 className="profile-title">Trang cá nhân của bạn</h2>
        {consultant ? (
          <div className="profile-card_consultant">
            <div className="profile-left">
              <img
                src={consultant.avatar}
                alt="Avatar"
                className="profile-avatar"
              />
              <h3 className="profile-name">{consultant.fullName}</h3>
            </div>
            <div className="profile-right">
              <div className="profile-form_consultant">
                <label>Chuyên môn:</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                />

                <label>Trình độ:</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                />

                <label>Số năm kinh nghiệm:</label>
                <input
                  type="number"
                  name="experiencedYears"
                  value={formData.experiencedYears}
                  onChange={handleChange}
                />

                <label>Google Meet Link:</label>
                <input
                  type="text"
                  name="googleMeetLinks"
                  value={formData.googleMeetLinks}
                  onChange={handleChange}
                />

                <button className="submit-btn_consultant" onClick={handleSubmitRequest}>
                  Gửi yêu cầu cập nhật
                </button>

                {message && <p className="status-message">{message}</p>}
              </div>
            </div>
          </div>
        ) : (
          <p>Đang tải thông tin...</p>
        )}
      </div>
    </div>
  );
};

export default ConsultantProfile;
