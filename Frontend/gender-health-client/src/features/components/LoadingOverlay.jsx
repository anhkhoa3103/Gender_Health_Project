import React from "react";
import "./styles/LoadingOverlay.css";

const LoadingOverlay = ({ show, text = "Loading..." }) => {
  if (!show) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner" />
      <div className="loading-text">{text}</div>
    </div>
  );
};

export default LoadingOverlay;
