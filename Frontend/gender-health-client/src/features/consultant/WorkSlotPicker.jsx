import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/WorkSlotPicker.css"; // Assuming you have a CSS file for styles
import { useNavigate } from "react-router-dom";
import Sidebar from "../../features/components/sidebar";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from "date-fns";

const WorkSlotPicker = ({ }) => {
    const [consultantId] = useState(localStorage.getItem("userId"));
    const [selectedDate, setSelectedDate] = useState("");
    const [slots, setSlots] = useState([]);
    const [selectedSlotIds, setSelectedSlotIds] = useState([]);
    const navigate = useNavigate();

    // Lấy tất cả các slot cố định
    useEffect(() => {
        axios.get("http://localhost:8080/api/consultation/slots")
            .then((res) => {
                setSlots(res.data);
            })
            .catch((err) => {
                console.error("Lỗi khi tải slot:", err);
            });
    }, []);

    // Khi chọn ngày → load các slot đã chọn trước đó
    useEffect(() => {
        if (selectedDate && consultantId) {
            axios.get("http://localhost:8080/api/consultation/available-workslots", {
                params: {
                    consultantId,
                    date: selectedDate
                }
            })
                .then((res) => {
                    const existingSlotIds = res.data.map(w => w.slotId);
                    setSelectedSlotIds(existingSlotIds);
                })
                .catch((err) => {
                    console.error("Lỗi khi lấy workslot:", err);
                });
        } else {
            setSelectedSlotIds([]);
        }
    }, [selectedDate, consultantId]);

    const handleSlotToggle = (slotId) => {
        if (selectedSlotIds.includes(slotId)) {
            setSelectedSlotIds(selectedSlotIds.filter(id => id !== slotId));
        } else {
            setSelectedSlotIds([...selectedSlotIds, slotId]);
        }
    };

    const handleSubmit = async () => {
        if (!selectedDate) {
            alert("Vui lòng chọn ngày.");
            return;
        }

        const requestBody = {
            consultantId,
            workslotDate: selectedDate,
            slotIds: selectedSlotIds
        };

        try {
            await axios.post(
                "http://localhost:8080/api/consultants/workslots",
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("managementToken")}`,
                    },
                }
            );
            alert("Lịch làm việc đã được lưu!");
        } catch (error) {
            console.log("Token:", localStorage.getItem("managementToken"));
            console.error("❌ Lỗi khi lưu workslot:", error.response?.data || error);
            alert("Lưu thất bại!");
        }
    };

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });



    return (
        <div className="workslot_container">
            <Sidebar />
            <div className="workslot-container_consultantSlot">
                <h2 className="workslot-title_consultantSlot">📅 Chọn lịch làm việc</h2>
                <h4>ID Tư vấn viên: {consultantId}</h4>
                <div className="workslot-grid">
                    {/* Bên trái: Lịch */}
                    <div className="calendar-wrapper">
                        <div className="calendar-header">
                            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>❮</button>
                            <span>{format(currentMonth, "MMMM yyyy")}</span>
                            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>❯</button>
                        </div>
                        <div className="calendar-grid">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div key={day} className="calendar-day-name">{day}</div>
                            ))}
                            {Array(startOfMonth(currentMonth).getDay()).fill(null).map((_, i) => (
                                <div key={"empty-" + i} className="calendar-empty"></div>
                            ))}
                            {daysInMonth.map((day) => {
                                const dayStr = format(day, "yyyy-MM-dd");
                                const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

                                return (
                                    <div
                                        key={dayStr}
                                        className={`calendar-day 
                ${selectedDate === dayStr ? "selected" : ""} 
                ${isPast ? "calendar-day-past" : ""}`}
                                        onClick={() => !isPast && setSelectedDate(dayStr)}
                                    >
                                        {format(day, "d")}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bên phải: Slot */}
                    <div className="slot-list_consultantSlot">
                        <h4>🕐 Chọn slot rảnh:</h4>
                        <div className="slot-select-actions">
                            <button
                                onClick={() => setSelectedSlotIds(slots.map(slot => slot.slotId))}
                                className="select-all-button"
                            >
                                ✅ Chọn tất cả
                            </button>
                            <button
                                onClick={() => setSelectedSlotIds([])}
                                className="deselect-all-button"
                            >
                                ❌ Bỏ chọn tất cả
                            </button>
                        </div>
                        {slots.map((slot) => (
                            <div key={slot.slotId} className="slot-item_consultantSlot">
                                <input
                                    type="checkbox"
                                    className="slot-checkbox_consultantSlot"
                                    checked={selectedSlotIds.includes(slot.slotId)}
                                    onChange={() => handleSlotToggle(slot.slotId)}
                                />
                                <label>{slot.description}: {slot.startTime} - {slot.endTime}</label>
                            </div>
                        ))}

                        <div className="button-group">
                            <button className="workslot-save_consultantSlot" onClick={handleSubmit}>
                                💾 Lưu lịch
                            </button>
                            <button className="workslot-viewappointments_consultantSlot" onClick={() => navigate("/consultant/appointments")}>
                                📋 Xem các cuộc hẹn
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkSlotPicker;
