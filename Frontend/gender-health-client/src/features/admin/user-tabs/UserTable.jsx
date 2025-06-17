import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserTable = ({ users, onUpdate }) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();

  // Sắp xếp theo ID
  const sortedUsers = [...users].sort((a, b) =>
    sortOrder === "asc" ? a.userId - b.userId : b.userId - a.userId
  );

  // Lấy dữ liệu theo trang
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handlePageClick = (page) => setCurrentPage(page);

  return (
    <div className="table-wrapper_admindashboard">
      <table className="user-table_admindashboard">
        <thead>
          <tr>
            <th onClick={toggleSort} style={{ cursor: "pointer" }}>
              ID {sortOrder === "asc" ? "▲" : "▼"}
            </th>
            <th>FULL NAME</th>
            <th>EMAIL</th>
            <th>PHONE</th>
            <th>ROLE</th>
            <th>STATUS</th>
            <th>CREATED AT</th>
            <th>AVATAR</th>
            <th>UPDATE</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length === 0 ? (
            <tr><td colSpan="9" style={{ textAlign: "center" }}>No users found.</td></tr>
          ) : (
            currentUsers.map((u) => (
              <tr key={u.userId}>
                <td>{u.userId}</td>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td>{u.createdAt}</td>
                <td>{u.avatar ? (
                  <img src={u.avatar} alt="avatar" className="avatar_admindashboard" />
                ) : (
                  <div className="no-avatar_admindashboard">No Avatar</div>
                )}
                </td>
                <td>
                  <button
                    className="btn-update_admindashboard"
                    onClick={() => onUpdate && onUpdate(u)}
                  >
                    UPDATE
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination_admindashboard">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`pagination-btn_admindashboard ${currentPage === i + 1 ? "active-page_admindashboard" : ""
              }`}
            onClick={() => handlePageClick(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserTable;
