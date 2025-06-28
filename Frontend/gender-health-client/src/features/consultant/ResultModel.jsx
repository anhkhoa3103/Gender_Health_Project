import React, { useState, useEffect } from "react";
import "./styles/ResultModel.css";

const ResultModal = ({ consultationId, onClose, onSubmitted }) => {
    const [result, setResult] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState(false); // true nếu đã có kết quả rồi

    useEffect(() => {
        if (!consultationId) return;

        const fetchExistingResult = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/consultants/results/by-consultation/${consultationId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("managementToken")}`,
                        },
                    }
                );

                if (res.ok) {
                    const data = await res.json();
                    if (data?.result) {
                        setResult(data.result);
                        setNotes(data.notes);
                        setViewMode(true);
                    }
                }
            } catch (error) {
                console.error("❌ Lỗi khi lấy kết quả cũ:", error);
            }
        };

        fetchExistingResult();
    }, [consultationId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!result || !notes) {
            alert("Vui lòng điền đầy đủ.");
            return;
        }

        try {
            setLoading(true);
            console.log("📤 Sending result:", { consultationId, result, notes });
            const response = await fetch("http://localhost:8080/api/consultants/results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("managementToken")}`,
                },
                body: JSON.stringify({ consultationId, result, notes }),
            });

            if (!response.ok) throw new Error("Lỗi khi lưu kết quả");

            alert("✅ Đã lưu kết quả tư vấn.");
            onSubmitted(); // Gọi lại để reload
            onClose();     // Đóng modal
        } catch (err) {
            console.error("❌ Gửi kết quả thất bại:", err);
            alert("Không thể lưu kết quả.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>{viewMode ? "Kết quả tư vấn đã lưu" : "Nhập kết quả tư vấn"}</h3>
                <form onSubmit={handleSubmit}>
                    <label>Kết quả:</label>
                    {viewMode ? (
                        <p className="readonly-box">{result}</p>
                    ) : (
                        <input
                            type="text"
                            value={result}
                            onChange={(e) => setResult(e.target.value)}
                        />
                    )}

                    <label>Ghi chú:</label>
                    {viewMode ? (
                        <p className="readonly-box">{notes}</p>
                    ) : (
                        <textarea
                            rows="4"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    )}

                    <div className="modal-actions">
                        {!viewMode && (
                            <button type="submit" disabled={loading}>
                                {loading ? "Đang lưu..." : "Lưu"}
                            </button>
                        )}
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Đóng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResultModal;
