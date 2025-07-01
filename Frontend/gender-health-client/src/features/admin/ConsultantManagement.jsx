import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/HeaderManagement";
import AppointmentsTab from "./consultant-tabs/AppointmentsTab";
import PerformanceTab from "./consultant-tabs/PerformanceTab";
import "./styles/AdminConsultant.css";

const ConsultantManagement = () => {
  const [tab, setTab] = useState("appointments");

  return (
    <div className="container_adminconsultant">
      <Sidebar />
      <div className="main_adminconsultant">
        <div className="user-management_adminconsultant">
          <div className="tab-buttons_adminconsultant">
            <button className={tab === "appointments" ? "active_adminconsultant" : ""} onClick={() => setTab("appointments")}>📅 Appointments</button>
            <button className={tab === "performance" ? "active_adminconsultant" : ""} onClick={() => setTab("performance")}>📊 Consultant Performance</button>
          </div>

          {tab === "appointments" && <AppointmentsTab />}
          {tab === "performance" && <PerformanceTab />}
        </div>
      </div>
    </div>
  );
};

export default ConsultantManagement;
