import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/ConsultationHistory.css"; // bạn có thể tạo file này để style

const ConsultationHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy userId từ localStorage sau khi đăng nhập
  const consultantId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/consultants/appointments`, {
          params: { consultantId },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử cuộc hẹn:", error);
      } finally {
        setLoading(false);
      }
    };

    if (consultantId) {
      fetchAppointments();
    }
  }, [consultantId]);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="history-container_consultant">
      <h2>Lịch sử các cuộc hẹn</h2>
      {appointments.length === 0 ? (
        <p>Không có cuộc hẹn nào.</p>
      ) : (
        <table className="history-table_consultant">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Ghi chú</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.consultationId}>
                <td>{a.name}</td>
                <td>{a.appointmentDate}</td>
                <td>{a.timeRange || "Chưa rõ"}</td>
                <td>{a.note}</td>
                <td>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ConsultationHistory;
