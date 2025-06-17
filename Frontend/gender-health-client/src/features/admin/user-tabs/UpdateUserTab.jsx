import React, { useState, useEffect } from "react";
import "../styles/UpdateUserTab.css"; // CSS đã chỉnh style row

const UpdateUserTab = ({ user, onUpdated }) => {
    const [form, setForm] = useState(user || {});

    useEffect(() => {
        setForm(user);
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("managementToken");
        const adminid = localStorage.getItem("userId");
        const role = localStorage.getItem("managementRole");
        console.log("Admin ID:", adminid);
        console.log("Role:", role);
        // Tách dữ liệu cần gửi (không gửi userId nếu không cần)
        const { userId, ...payload } = form;

        try {
            const response = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload), // Gửi phần payload không có userId
            });

            if (response.ok) {
                alert("Cập nhật thành công!");
                onUpdated && onUpdated(); // Chuyển tab hoặc reload
            } else {
                const error = await response.text();
                alert("Lỗi khi cập nhật: " + error);
            }
        } catch (err) {
            alert("Lỗi kết nối máy chủ!");
        }
    };

    if (!user) return <p>Chọn user để cập nhật</p>;

    return (
        <form onSubmit={handleSubmit} className="update-form_admindashboard">
            <h3>Cập nhật thông tin</h3>

            <div className="row_admindashboard">
                <div className="column_admindashboard">
                    <label>User ID (không sửa):</label>
                    <input value={form.userId} disabled />
                </div>
                <div className="column_admindashboard">
                    <label>Vai trò:</label>
                    <select name="role" value={form.role || ""} onChange={handleChange}>
                        <option value="ADMIN">Admin</option>
                        <option value="STAFF">Staff</option>
                        <option value="CONSULTANT">Consultant</option>
                        <option value="CUSTOMER">Customer</option>
                    </select>
                </div>
            </div>

            <label>Họ tên:</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required />

            <label>Email:</label>
            <input name="email" value={form.email} onChange={handleChange} required />

            <label>Số điện thoại:</label>
            <input name="phone" value={form.phone || ""} onChange={handleChange} />

            <label>Trạng thái:</label>
            <select name="status" value={form.status || ""} onChange={handleChange}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
            </select>

            <button type="submit" style={{ marginTop: "20px" }}>Cập nhật</button>
        </form>
    );
};

export default UpdateUserTab;
