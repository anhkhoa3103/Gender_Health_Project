import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/ConsultationHistory.css"; // bạn có thể tạo file này để style
import Sidebar from "../../features/components/sidebar"; // Giả sử bạn có HeaderManagement

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
        const sortedData = response.data.sort((a, b) => {
          const dateA = new Date(`${a.appointmentDate} ${a.timeRange?.split(" - ")[0] || "00:00"}`);
          const dateB = new Date(`${b.appointmentDate} ${b.timeRange?.split(" - ")[0] || "00:00"}`);
          return dateB - dateA;
        });
        setAppointments(sortedData);
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

  const handleComplete = async (appointmentId) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn đánh dấu cuộc hẹn này là 'Hoàn thành'?");

    if (!confirm) return;

    try {
      await axios.put(
        `http://localhost:8080/api/consultants/appointments/${appointmentId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("managementToken")}`
          }
        }
      );


      setAppointments(prev =>
        prev.map(a =>
          a.consultationId === appointmentId ? { ...a, status: "DONE" } : a
        )
      );
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
      alert("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    }
  };



  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="history-container_consultant">
      <Sidebar />
      <div className="history-content_consultant">
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
                <th>Hoàn thành</th>
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
                  <td>
                    <input
                      type="checkbox"
                      disabled={a.status === "DONE"}
                      checked={a.status === "DONE"}
                      onChange={() => handleComplete(a.consultationId)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ConsultationHistory;
