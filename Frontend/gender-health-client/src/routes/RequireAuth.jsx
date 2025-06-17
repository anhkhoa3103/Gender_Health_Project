import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("managementToken");
  const role = localStorage.getItem("managementRole");

  if (!token) return <Navigate to="/loginmanagement" replace />;

  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;

  return children;
};


export default RequireAuth;
