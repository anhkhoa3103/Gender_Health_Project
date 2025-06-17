import React from "react";
import UserTable from "./UserTable";

const AllUsers = ({ users, onUpdate }) => {
  return (
    <>
      <h3 style={{ marginBottom: "15px" }}>All Users</h3>
      <UserTable users={users} onUpdate={onUpdate} />
    </>
  );
};

export default AllUsers;
