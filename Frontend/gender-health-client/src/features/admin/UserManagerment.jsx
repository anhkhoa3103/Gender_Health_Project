import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/HeaderManagement";
import axios from "axios";
import AllUsers from "./user-tabs/AllUsers";
import FindUser from "./user-tabs/FindUser";
import UpdateUserTab from "./user-tabs/UpdateUserTab";
import "./styles/UserManagement.css";
import MainListSpinner from "../components/MainListSpinner";

const UserManagement = () => {
    const [tab, setTab] = useState("all");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const token = localStorage.getItem("managementToken");
        axios
            .get("http://localhost:8080/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setUsers(res.data))
            .catch((err) => console.error("Error loading users:", err));
    }, []);
    console.log(localStorage.getItem("managementToken"));
    console.log(localStorage.getItem("userId"));
    console.log(localStorage.getItem("managementRole"));

    return (
        <div className="container_admindashboard">
            <Sidebar />
            <div className="main_admindashboard">
                <div className="user-management_admindashboard">
                    {/* Tabs */}
                    <div className="tab-buttons_admindashboard">
                        <button onClick={() => setTab("find")} className={tab === "find" ? "active_admindashboard" : ""}>🔍 Find user</button>
                        <button onClick={() => setTab("all")} className={tab === "all" ? "active_admindashboard" : ""}>👥 All users</button>
                        <button onClick={() => setTab("update")} className={tab === "update" ? "active_admindashboard" : ""}>✏️ Update user</button>
                    </div>

                    {tab === "all" &&
                        <AllUsers users={users} onUpdate={(user) => {
                            setSelectedUser(user);
                            setTab("update");
                        }} />
                    }
                    {tab === "find" && <FindUser allUsers={users} />}
                    {tab === "update" && <UpdateUserTab user={selectedUser} onUpdated={() => setTab("all")} />}
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
