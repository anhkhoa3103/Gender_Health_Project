import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/HeaderManagement";
import AppointmentsTab from "./consultant-tabs/AppointmentsTab";
import PerformanceTab from "./consultant-tabs/PerformanceTab";
import "./styles/UserManagement.css";

const ConsultantManagement = () => {
  const [tab, setTab] = useState("appointments");

  return (
    <div className="container_admindashboard">
      <Sidebar />
      <div className="main_admindashboard">
        <Header />
        <div className="user-management_admindashboard">
          <div className="tab-buttons_admindashboard">
            <button className={tab === "appointments" ? "active_admindashboard" : ""} onClick={() => setTab("appointments")}>📅 Appointments</button>
            <button className={tab === "performance" ? "active_admindashboard" : ""} onClick={() => setTab("performance")}>📊 Consultant Performance</button>
          </div>

          {tab === "appointments" && <AppointmentsTab />}
          {tab === "performance" && <PerformanceTab />}
        </div>
      </div>
    </div>
  );
};

export default ConsultantManagement;
