import React, { useEffect, useState } from "react";
import axios from "axios";

const AppointmentsTab = () => {
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [statusOptions] = useState(["PENDING", "COMPLETED", "CANCELLED"]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filters, setFilters] = useState({
    consultant: "",
    customer: "",
    status: "",
  });

  const token = localStorage.getItem("managementToken");

  const fetchConsultations = () => {
    axios
      .get("http://localhost:8080/api/admin/consultation/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setConsultations(res.data);
        setFilteredConsultations(res.data);
      })
      .catch((err) => console.error("Error fetching consultations:", err));
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  useEffect(() => {
    const result = consultations.filter((c) =>
      (!filters.consultant || c.consultantName?.toLowerCase().includes(filters.consultant.toLowerCase())) &&
      (!filters.customer || c.customerName?.toLowerCase().includes(filters.customer.toLowerCase())) &&
      (!filters.status || c.status === filters.status)
    );
    setFilteredConsultations(result);
    setCurrentPage(1); // reset page when filter changes
  }, [filters, consultations]);

  const handleStatusChange = (id, newStatus) => {
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
      .then(() => fetchConsultations())
      .catch((err) => {
        console.error("Error updating status:", err);
        alert("Update failed!");
      });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentConsultations = filteredConsultations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredConsultations.length / itemsPerPage);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h2>🩺 Consultant Appointments</h2>

      <div style={{ marginBottom: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="text"
          name="consultant"
          placeholder="Search by Consultant Name"
          value={filters.consultant}
          onChange={handleFilterChange}
          style={{ padding: "6px", width: "220px" }}
        />
        <input
          type="text"
          name="customer"
          placeholder="Search by Customer Name"
          value={filters.customer}
          onChange={handleFilterChange}
          style={{ padding: "6px", width: "220px" }}
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          style={{ padding: "6px", width: "160px" }}
        >
          <option value="">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

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

      {/* Pagination */}
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </>
  );
};

export default AppointmentsTab;
