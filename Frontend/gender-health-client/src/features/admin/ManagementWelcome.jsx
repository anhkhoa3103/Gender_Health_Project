import React from "react";

const ManagementWelcome = () => {
  const role = localStorage.getItem("managementRole");

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>You signed in with <strong>{role}</strong> role</h2>
    </div>
  );
};

export default ManagementWelcome;
