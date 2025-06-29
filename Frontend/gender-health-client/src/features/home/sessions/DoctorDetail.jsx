import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "../styles/DoctorDetail.css";

const DoctorDetail = () => {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return (
            <div className="no-data">
                <h2>No doctor data found for ID {id}</h2>
                <p>Please go back and select a doctor again.</p>
                <button className="back-button" onClick={() => navigate("/")}>
                    ← Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="doctor-detail-container">
            <button className="back-button" onClick={() => navigate("/")}>
                ← Back to Home
            </button>

            <div className="doctor-card">
                <img src={state.img} alt={state.name} className="doctor-image" />
                <div className="doctor-content">
                    <h2 className="doctor-name">{state.name}</h2>
                    <h4 className="doctor-role">{state.role}</h4>
                    <p className="doctor-desc">{state.desc}</p>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetail;