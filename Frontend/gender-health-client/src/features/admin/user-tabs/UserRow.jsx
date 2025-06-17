import React, { useState } from "react";
import axios from "axios";

const UserRow = ({ user, onUpdated }) => {
  const [formData, setFormData] = useState({ ...user });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("managementToken");
      await axios.put(`http://localhost:8080/api/admin/users/${user.userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdated(); // để reload lại danh sách nếu cần
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr>
      <td>{user.userId}</td>
      <td><input name="fullName" value={formData.fullName} onChange={handleChange} /></td>
      <td><input name="email" value={formData.email} onChange={handleChange} /></td>
      <td><input name="phone" value={formData.phone} onChange={handleChange} /></td>
      <td>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="ADMIN">ADMIN</option>
          <option value="STAFF">STAFF</option>
          <option value="CONSULTANT">CONSULTANT</option>
          <option value="CUSTOMER">CUSTOMER</option>
        </select>
      </td>
      <td>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </td>
      <td>{user.createdAt}</td>
      <td><img src={formData.avatar} alt="avatar" className="avatar_admindashboard" /></td>
      <td>
        <button onClick={handleUpdate} disabled={loading}>
          {loading ? "Saving..." : "UPDATE"}
        </button>
      </td>
    </tr>
  );
};

export default UserRow;
