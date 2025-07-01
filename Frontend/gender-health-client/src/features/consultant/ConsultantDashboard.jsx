import React, { useEffect, useState } from "react";
import "./styles/ConsultantDashboard.css";
import {
    getAppointmentsByConsultantId,
    getFeedbacksByConsultantId,
    getConsultantById,
} from "../../api/consultationApi";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from "recharts";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import LoadingOverlay from "../components/LoadingOverlay";

export default function ConsultantDashboard() {
    const [consultantId] = useState(localStorage.getItem("userId"));
    const [appointments, setAppointments] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [googleMeetLink, setGoogleMeetLink] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (!consultantId) return;

        getAppointmentsByConsultantId(consultantId).then((res) => {
            const data = res.data || [];
            console.log("Appointments:", data);

            data.forEach((a, i) => {
                console.log(`Appointment ${i}:`, a);
                console.log(`Parsed date:`, getDateFromAppointment(a));
            });

            setAppointments(data);
        });

        getFeedbacksByConsultantId(consultantId).then((res) => {
            if (Array.isArray(res.data)) {
                const sorted = res.data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setFeedbacks(sorted);
            } else {
                console.warn("Unexpected feedback format:", res.data);
                setFeedbacks([]);
            }
        });

        getConsultantById(consultantId).then((res) => {
            console.log("Consultant info: ", res.data);
            setGoogleMeetLink(res.data?.googleMeetLinks || null);
        });
    }, [consultantId]);

    const getDateFromAppointment = (a) => {
        if (a.scheduledTime) return new Date(a.scheduledTime);

        if (a.appointmentDate && a.timeRange) {
            const [startTime] = a.timeRange.split(" - ");
            if (!startTime || !a.appointmentDate) return null;

            const [hour, minute] = startTime.trim().split(":");
            if (!hour || !minute) return null;

            const date = new Date(`${a.appointmentDate}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`);
            return isNaN(date.getTime()) ? null : date;
        }

        return null;
    };

    const total = appointments.length;
    const done = appointments.filter((a) => a.status === "DONE").length;
    const pending = appointments.filter((a) => a.status === "PENDING").length;
    const cancelled = appointments.filter((a) => a.status === "CANCELLED").length;

    const avgRating =
        feedbacks.length > 0
            ? (
                feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0) / feedbacks.length
            ).toFixed(1)
            : "N/A";

    const appointmentStatusData = [
        { name: "Pending", count: pending },
        { name: "Done", count: done },
        { name: "Cancelled", count: cancelled }
    ];

    const feedbacksByDate = feedbacks.reduce((acc, fb) => {
        const date = new Date(fb.createdAt).toISOString().slice(0, 10); // ISO date
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const feedbackData = Object.entries(feedbacksByDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10)
        .sort((a, b) => new Date(a.date) - new Date(b.date));



    return (
        <>
            <LoadingOverlay show={loading} text="Đang tải Dashboard..." />
            <Sidebar />
            <div className="dashboard_consultantdashboard">
                <div className="grid_consultantdashboard">
                    <div className="card_consultantdashboard blue">
                        Total Appointments <span>{total}</span>
                        <button className="view-detail-btn" onClick={() => navigate("/consultant/appointments")}>View Detail</button>
                    </div>

                    <div className="card_consultantdashboard green">
                        Appointments Served <span>{done}</span>
                        <button className="view-detail-btn" onClick={() => navigate("/consultant/appointments?status=DONE")}>View Detail</button>
                    </div>

                    <div className="card_consultantdashboard orange">
                        Appointments Pending <span>{pending}</span>
                        <button className="view-detail-btn" onClick={() => navigate("/consultant/appointments?status=PENDING")}>View Detail</button>
                    </div>

                    <div className="card_consultantdashboard red">
                        Appointments Cancelled <span>{cancelled}</span>
                        <button className="view-detail-btn" onClick={() => navigate("/consultant/appointments?status=CANCELLED")}>View Detail</button>
                    </div>

                    <div className="card_consultantdashboard feedback-summary">
                        <div className="avg-rating-big">
                            ⭐ <span>{avgRating}</span> / 5
                        </div>
                        <h4 style={{ marginTop: "10px" }}>Recent Feedback</h4>
                        <ul>
                            {feedbacks.length === 0 ? (
                                <p>No feedback yet.</p>
                            ) : (
                                feedbacks.slice(0, 3).map((fb) => {
                                    const name = fb.customerName || "Anonymous";
                                    return (
                                        <li key={fb.feedbackId}>
                                            <strong>{name}</strong>:{" "}
                                            <span className="small-stars">
                                                {"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}
                                            </span>{" "}
                                            – "{fb.comment}"
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                        <button className="view-detail-btn" onClick={() => navigate("/consultant/feedback")}>View Detail</button>
                    </div>

                    <div className="card_consultantdashboard meet-upcoming">
                        <h3 className="upcoming-title">📅 Upcoming Appointments</h3>

                        {googleMeetLink && (
                            <div className="personal-meet">
                                <a
                                    href={googleMeetLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="meet-link"
                                >
                                    🔗 Join Personal Google Meet
                                </a>
                            </div>
                        )}

                        <ul className="meet-list">
                            {appointments
                                .filter((a) => {
                                    const start = getDateFromAppointment(a);
                                    return start && start > new Date();
                                })
                                .slice(0, 3)
                                .map((a, index) => (
                                    <li key={index} className="upcoming-item">
                                        <div className="appt-info">
                                            <strong>{a.name || "Anonymous"}</strong> –{" "}
                                            {getDateFromAppointment(a)?.toLocaleString("vi-VN") || "Chưa rõ"}
                                        </div>
                                    </li>
                                ))}
                            {appointments.filter((a) => {
                                const start = getDateFromAppointment(a);
                                return start && start > new Date();
                            }).length === 0 && <p>No upcoming appointments.</p>}
                        </ul>
                    </div>

                    <div className="card_consultantdashboard chart-card">
                        <h3 style={{ marginBottom: "10px" }}>Appointments by Status</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={appointmentStatusData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="card_consultantdashboard chart-card">
                        <h3 style={{ marginBottom: "10px" }}>Feedback Volume Over Time</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={feedbackData} margin={{ top: 10, right: 30, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={3} dot />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>
        </>
    );
}
