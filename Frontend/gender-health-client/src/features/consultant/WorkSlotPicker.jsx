import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/WorkSlotPicker.css"; // Assuming you have a CSS file for styles
import { useNavigate } from "react-router-dom";

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
        if (!selectedDate || selectedSlotIds.length === 0) {
            alert("Vui lòng chọn ngày và ít nhất một slot.");
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
            console.error("❌ Lỗi khi lưu workslot:", error);
            alert("Lưu thất bại!");
        }
    };


    return (

        <div className="workslot-container_consultantSlot">
            <h2>Consultant ID: {consultantId}</h2>
            <h2 className="workslot-title_consultantSlot">📅Chọn lịch làm việc</h2>

            <label>Ngày làm việc:</label>
            <input
                type="date"
                className="workslot-date_consultantSlot"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
            />

            <div className="slot-list_consultantSlot">
                <h4>🕐Chọn slot rảnh:</h4>
                {slots.map((slot) => (
                    <div key={slot.slotId} className="slot-item_consultantSlot">
                        <input
                            type="checkbox"
                            className="slot-checkbox_consultantSlot"
                            checked={selectedSlotIds.includes(slot.slotId)}
                            onChange={() => handleSlotToggle(slot.slotId)}
                        />
                        <label>{slot.description} : {`${slot.startTime} - ${slot.endTime}`}</label>
                    </div>
                ))}
            </div>

            <button className="workslot-save_consultantSlot" onClick={handleSubmit}>
                Lưu lịch
            </button>
            <button
                className="workslot-viewappointments_consultantSlot"
                onClick={() => navigate("/consultant/appointments")}
            >
                Xem các cuộc hẹn
            </button>
        </div>
    );
};

export default WorkSlotPicker;
