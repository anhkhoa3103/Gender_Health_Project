import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/ConsultationHistory.css";
import Sidebar from "../../features/components/sidebar";
import ResultModal from "./ResultModel";

const ConsultationHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedConsultationId, setSelectedConsultationId] = useState(null);
  const [resultMap, setResultMap] = useState({});

  const consultantId = localStorage.getItem("userId");
  const token = localStorage.getItem("managementToken");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/consultants/appointments`, {
          params: { consultantId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedData = response.data.sort((a, b) => {
          const dateA = new Date(`${a.appointmentDate} ${a.timeRange?.split(" - ")[0] || "00:00"}`);
          const dateB = new Date(`${b.appointmentDate} ${b.timeRange?.split(" - ")[0] || "00:00"}`);
          return dateB - dateA;
        });
        setAppointments(sortedData);
        const resultStatuses = {};
        await Promise.all(
          sortedData.map(async (appointment) => {
            try {
              const res = await axios.get(
                `http://localhost:8080/api/consultants/results/by-consultation/${appointment.consultationId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              if (res.data) resultStatuses[appointment.consultationId] = res.data;
            } catch (err) {
              // không có kết quả thì không làm gì
            }
          })
        );
        setResultMap(resultStatuses);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử cuộc hẹn:", error);
      } finally {
        setLoading(false);
      }
    };

    if (consultantId) {
      fetchAppointments();
    }
  }, [consultantId, token]);

  const handleDelete = async (appointmentId) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa lịch hẹn đã hủy này?");
    if (!confirm) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/consultants/appointments/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments((prev) => prev.filter((a) => a.consultationId !== appointmentId));
    } catch (error) {
      console.error("❌ Lỗi khi xóa lịch hẹn:", error);
      alert("Không thể xóa lịch hẹn. Vui lòng thử lại.");
    }
  };

  const handleComplete = async (appointmentId) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn đánh dấu cuộc hẹn này là 'Hoàn thành'?");
    if (!confirm) return;

    try {
      await axios.put(
        `http://localhost:8080/api/consultants/appointments/${appointmentId}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAppointments((prev) =>
        prev.map((a) =>
          a.consultationId === appointmentId ? { ...a, status: "DONE" } : a
        )
      );
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
      alert("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    }
  };

  const openResultModal = (consultationId) => {
    setSelectedConsultationId(consultationId);
  };

  const closeModal = () => {
    setSelectedConsultationId(null);
  };

  const reloadAfterSubmit = () => {
    window.location.reload(); // hoặc gọi lại useEffect fetchAppointments() nếu tách được
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
                <th>Kết quả</th>
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
                    {a.status === "CANCELLED" ? (
                      <button className="delete-btn" onClick={() => handleDelete(a.consultationId)}>Xóa</button>
                    ) : (
                      <input
                        type="checkbox"
                        disabled={a.status === "DONE"}
                        checked={a.status === "DONE"}
                        onChange={() => handleComplete(a.consultationId)}
                      />
                    )}
                  </td>
                  <td>
                    {a.status !== "DONE" ? (
                      <button className="result-btn disabled" disabled>Chờ hoàn thành</button>
                    ) : resultMap[a.consultationId] ? (
                      <button
                        className="result-btn btn-view"
                        onClick={() => openResultModal(a.consultationId)}
                      >
                        Xem kết quả
                      </button>
                    ) : (
                      <button
                        className="result-btn btn-submit"
                        onClick={() => openResultModal(a.consultationId)}
                      >
                        Nhập kết quả
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {selectedConsultationId && (
          <ResultModal
            consultationId={selectedConsultationId}
            onClose={closeModal}
            onSubmitted={reloadAfterSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default ConsultationHistory;
