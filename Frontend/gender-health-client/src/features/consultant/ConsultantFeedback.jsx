import React, { useEffect, useState } from "react";
import { getFeedbacksByConsultantId } from "../../api/consultationApi";
import Sidebar from "../../features/components/sidebar";
import "./styles/ConsultantFeedback.css";
import MainListSpinner from "../components/MainListSpinner";

const ConsultantFeedback = () => {
    const [consultantId] = useState(localStorage.getItem("userId"));
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRating, setFilterRating] = useState(0);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await getFeedbacksByConsultantId(consultantId);
                if (Array.isArray(res.data)) {
                    setFeedbacks(res.data);
                } else {
                    console.error("Unexpected response:", res.data);
                    setFeedbacks([]);
                }
            } catch (err) {
                console.error("Error fetching feedbacks:", err);
                setFeedbacks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, [consultantId]);

    const averageRating =
        Array.isArray(feedbacks) && feedbacks.length > 0
            ? (
                feedbacks.reduce((sum, fb) => sum + fb.rating, 0) /
                feedbacks.length
            ).toFixed(1)
            : 0;

    const filteredFeedbacks =
        filterRating === 0
            ? feedbacks
            : feedbacks.filter((fb) => fb.rating === filterRating);

    return (
        <div className="cf-wrapper">
            <Sidebar />
            <div className="cf-main">
                <div className="cf-header">
                    <h2>Feedback History</h2>
                    {loading && (
                        <div>
                            <MainListSpinner />
                            <div style={{ textAlign: "center", marginTop: 14, color: "#888" }}>
                                Loading Feedbacks...
                            </div>
                        </div>
                    )}
                    <div className="cf-average">⭐ {averageRating} / 5</div>
                    <div className="cf-filter">
                        <label>Lọc theo số sao: </label>
                        <select
                            value={filterRating}
                            onChange={(e) => setFilterRating(Number(e.target.value))}
                        >
                            <option value={0}>Tất cả</option>
                            <option value={5}>5 sao</option>
                            <option value={4}>4 sao</option>
                            <option value={3}>3 sao</option>
                            <option value={2}>2 sao</option>
                            <option value={1}>1 sao</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <p>Đang tải feedback...</p>
                ) : filteredFeedbacks.length === 0 ? (
                    <p>Không có feedback phù hợp.</p>
                ) : (
                    <ul className="cf-feedback-list">
                        {filteredFeedbacks.map((fb) => {
                            const name = fb.customerName || "Ẩn danh";
                            const initials = name
                                .split(" ")
                                .map((part) => part.charAt(0))
                                .join("")
                                .substring(0, 2)
                                .toUpperCase();

                            return (
                                <li key={fb.feedbackId} className="cf-card">
                                    <div className="cf-avatar">{initials}</div>
                                    <div className="cf-info">
                                        <div className="cf-top">
                                            <span className="cf-name">{name}</span>
                                            <span className="cf-time">
                                                {new Date(fb.createdAt).toLocaleTimeString("vi-VN", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                            <span className="cf-stars">
                                                {"★".repeat(fb.rating)}
                                                {"☆".repeat(5 - fb.rating)}
                                            </span>
                                        </div>
                                        <div className="cf-comment">{fb.comment}</div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ConsultantFeedback;
