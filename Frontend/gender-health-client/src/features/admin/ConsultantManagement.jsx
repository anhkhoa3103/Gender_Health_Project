import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/HeaderManagement";
import axios from "axios";
import "./styles/UserManagement.css";

const ConsultantManagement = () => {
  const [consultations, setConsultations] = useState([]);
  const [statusOptions] = useState(["PENDING", "COMPLETED", "CANCELLED"]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Lấy danh sách consultations từ server
  const fetchConsultations = () => {
    const token = localStorage.getItem("managementToken");
    axios
      .get("http://localhost:8080/api/admin/consultation/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setConsultations(res.data))
      .catch((err) => console.error("Error fetching consultations:", err));
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  // Cập nhật trạng thái thông qua API
  const handleStatusChange = (id, newStatus) => {
    const token = localStorage.getItem("managementToken");
    axios
      .post(
        `http://localhost:8080/api/admin/consultation/override-status/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        // Sau khi cập nhật, reload lại trang
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        alert("Update failed!");
      });
  };

  // Tính toán danh sách cần hiển thị theo trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentConsultations = consultations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(consultations.length / itemsPerPage);

  // Điều hướng trang
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container_admindashboard">
      <Sidebar />
      <div className="main_admindashboard">
        <Header />
        <div className="user-management_admindashboard">
          <h2>🩺 Consultant Appointments</h2>
          <table className="user-table_admindashboard">
            <thead>
              <tr>
                <th>ID</th>
                <th>Consultant</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Slot</th>
                <th>Google Meet</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {currentConsultations.map((item) => (
                <tr key={item.consultationId}>
                  <td>{item.consultationId}</td>
                  <td>{item.consultantName}</td>
                  <td>{item.customerName}</td>
                  <td>{new Date(item.appointmentDate).toLocaleString()}</td>
                  <td>{item.status}</td>
                  <td>{item.slotDescription}</td>
                  <td>
                    <a href={item.googleMeetLink} target="_blank" rel="noreferrer">
                      Join
                    </a>
                  </td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.consultationId, e.target.value)
                      }
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {currentConsultations.length === 0 && (
                <tr>
                  <td colSpan="8">No consultations found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Phân trang */}
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantManagement;