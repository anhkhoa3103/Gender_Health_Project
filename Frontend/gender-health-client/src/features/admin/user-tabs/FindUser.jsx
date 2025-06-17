import React, { useState } from "react";
import UserTable from "./UserTable";

const FindUser = ({ allUsers }) => {
  const [filters, setFilters] = useState({ fullName: "", email: "", phone: "", userId: "", role: "" });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredUsers = allUsers.filter((u) =>
    (!filters.fullName || u.fullName?.toLowerCase().includes(filters.fullName.toLowerCase())) &&
    (!filters.email || u.email?.includes(filters.email)) &&
    (!filters.phone || u.phone?.includes(filters.phone)) &&
    (!filters.userId || u.userId?.toString() === filters.userId) &&
    (!filters.role || u.role === filters.role)
  );


  return (
    <>
      <div className="filter-box_admindashboard">
        <div className="filter-grid_admindashboard">
          <input type="text" placeholder="Name" name="fullName" value={filters.fullName} onChange={handleChange} />
          <input type="text" placeholder="Email address" name="email" value={filters.email} onChange={handleChange} />
          <input type="text" placeholder="User ID" name="userId" value={filters.userId} onChange={handleChange} />
          <select name="role" value={filters.role} onChange={handleChange}>
            <option value="">Any</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="consultant">Consultant</option>
            <option value="customer">Customer</option>
          </select>
          <input type="text" placeholder="Phone number" name="phone" value={filters.phone} onChange={handleChange} />
        </div>
      </div>

      <UserTable users={filteredUsers} />
    </>
  );
};

export default FindUser;
