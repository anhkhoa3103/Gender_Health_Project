import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/HeaderManagement";
import axios from "axios";
import "./styles/UserManagement.css";

const AdminStaffManagement = () => {
  const [stiAppointments, setStiAppointments] = useState([]);
  const [statusOptions] = useState(["ALL", "PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("ALL");
  const [searchAmount, setSearchAmount] = useState("");
  const [searchPackage, setSearchPackage] = useState("");

  const itemsPerPage = 9;

  const fetchStiAppointments = () => {
    const token = localStorage.getItem("managementToken");
    axios
      .get("http://localhost:8080/api/admin/staff/appointments/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStiAppointments(res.data))
      .catch((err) => console.error("Error fetching STI appointments:", err));
  };

  useEffect(() => {
    fetchStiAppointments();
  }, []);

  const handleStatusChange = (appointmentId, newStatus) => {
    const token = localStorage.getItem("managementToken");
    axios
      .post(
        `http://localhost:8080/api/admin/staff/appointments/override-status/${appointmentId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        fetchStiAppointments();
        alert("Status updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        alert("Update failed!");
      });
  };

  const filteredAppointments = stiAppointments.filter((item) => {
    const matchesName =
      item.customerName?.toLowerCase().includes(searchName.toLowerCase()) ||
      item.staffName?.toLowerCase().includes(searchName.toLowerCase());

    const matchesStatus =
      searchStatus === "ALL" || item.status?.toLowerCase() === searchStatus.toLowerCase();

    const matchesAmount =
      searchAmount === "" || String(item.amount).includes(searchAmount);

    const matchesPackage =
      searchPackage === "" ||
      item.testPackageName?.toLowerCase().includes(searchPackage.toLowerCase());

    return matchesName && matchesStatus && matchesAmount && matchesPackage;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const renderFilterSection = () => (
    <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
      <input
        type="text"
        placeholder="Search by customer/staff name"
        value={searchName}
        onChange={(e) => {
          setSearchName(e.target.value);
          setCurrentPage(1);
        }}
      />
      <select
        value={searchStatus}
        onChange={(e) => {
          setSearchStatus(e.target.value);
          setCurrentPage(1);
        }}
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Search by amount"
        value={searchAmount}
        onChange={(e) => {
          setSearchAmount(e.target.value);
          setCurrentPage(1);
        }}
      />
      <input
        type="text"
        placeholder="Search by test package"
        value={searchPackage}
        onChange={(e) => {
          setSearchPackage(e.target.value);
          setCurrentPage(1);
        }}
      />
    </div>
  );

  const renderAppointmentsTable = () => (
    <>
      {renderFilterSection()}
      <table className="user-table_admindashboard">
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>Customer</th>
            <th>Staff</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Test Package</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((appointment) => (
            <tr key={appointment.appointmentId}>
              <td>{appointment.appointmentId}</td>
              <td>{appointment.customerName}</td>
              <td>{appointment.staffName}</td>
              <td>
                <span className={`status-badge status-${appointment.status?.toLowerCase()}`}>
                  {appointment.status}
                </span>
              </td>
              <td>${appointment.amount?.toFixed(2) || "N/A"}</td>
              <td>{appointment.testPackageName || "N/A"}</td>
              <td>{appointment.createdDate ? new Date(appointment.createdDate).toLocaleDateString() : "N/A"}</td>
              <td>
                <select
                  value={appointment.status}
                  onChange={(e) => handleStatusChange(appointment.appointmentId, e.target.value)}
                  className="status-select"
                >
                  {statusOptions
                    .filter((s) => s !== "ALL")
                    .map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                </select>
              </td>
            </tr>
          ))}
          {currentItems.length === 0 && (
            <tr>
              <td colSpan="8">No STI appointments found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );

  return (
    <div className="container_admindashboard">
      <Sidebar />
      <div className="main_admindashboard">
        <div className="user-management_admindashboard">
          <h2>👩‍⚕️ STI Appointment Management</h2>

          {/* Appointments Table + Filters */}
          {renderAppointmentsTable()}

          {/* Pagination */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-btn">
              Previous
            </button>
            <span style={{ margin: "0 15px", fontWeight: "bold" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-btn">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStaffManagement;
