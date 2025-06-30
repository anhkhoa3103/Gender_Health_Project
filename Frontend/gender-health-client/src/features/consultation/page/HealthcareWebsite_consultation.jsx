import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { getConsultants, getAllSlot, getAvailableSlots, createAppointment } from "../../../api/consultationApi";
import HeaderSession from "../../components/Header";
import FooterSession from "../../home/sessions/FooterSession";
import "../style/ConsultationBooking.css"
import "../style/Last.css"
import { getRatingSummaryByConsultantId } from "../../../api/feedbackApi"
import { AuthContext } from '../../../context/AuthContext';

const HealthcareWebsite_consultation = () => {
    const [animatedCards, setAnimatedCards] = useState(false);
    const [consultants, setConsultants] = useState([]);
    const [allSlots, setAllSlots] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedConsultant, setSelectedConsultant] = useState(null);
    const [selectedSlotId, setSelectedSlotId] = useState(null);
    const [selectedWorkslotId, setSelectedWorkslotId] = useState(null);
    const [availableWorkslots, setAvailableWorkslots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const { user } = useContext(AuthContext);
    const userId = user?.id;
    const navigate = useNavigate();

    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [note, setNote] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user]);


    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedCards(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchConsultantsWithRatings = async () => {
            try {
                const res = await getConsultants();
                const rawConsultants = res.data;

                const enriched = await Promise.all(
                    rawConsultants.map(async (c) => {
                        try {
                            const { data } = await getRatingSummaryByConsultantId(c.userId);
                            return { ...c, avgRating: data.averageRating };
                        } catch (e) {
                            console.error(`Error loading rating for consultant ${c.userId}`, e);
                            return { ...c, avgRating: null };
                        }
                    })
                );

                setConsultants(enriched);
            } catch (error) {
                console.error("Failed to load consultants", error);
            }
        };

        fetchConsultantsWithRatings();
    }, []);

    useEffect(() => {
        getAllSlot()
            .then(res => setAllSlots(res.data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (consultants.length > 0 && !selectedConsultant) {
            setSelectedConsultant(consultants[0]);
        }
    }, [consultants, selectedConsultant]);

    useEffect(() => {
        if (selectedConsultant && selectedDate !== null) {
            const isoDate = formatDateISO(currentYear, currentMonth, selectedDate);
            getAvailableSlots(selectedConsultant.userId, isoDate)
                .then(res => {
                    const data = res.data;
                    const availableSlotIds = data.map(ws => ws.slotId);
                    setAvailableSlots(availableSlotIds);
                    setAvailableWorkslots(data);
                    setSelectedTime(null);
                })
                .catch(console.error);
        } else {
            setAvailableSlots([]);
            setSelectedTime(null);
        }
    }, [selectedConsultant, selectedDate, currentMonth, currentYear]);

    const formatDateISO = (year, month, day) => {
        const mm = (month + 1).toString().padStart(2, '0');
        const dd = day.toString().padStart(2, '0');
        return `${year}-${mm}-${dd}`;
    };

    const formatTime = (time) => time.slice(0, 5);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentYear(currentYear - 1);
            setCurrentMonth(11);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentYear(currentYear + 1);
            setCurrentMonth(0);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
        setSelectedDate(null);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleSelectConsultant = (consultant) => {
        setSelectedConsultant(consultant);
    };

    const handleContinue = () => {
        if (!selectedDate || !selectedTime || !selectedConsultant) {
            alert('Please select consultant, date and time before continuing');
            return;
        }
        setShowBookingModal(true);
    };

    const handleSubmitAppointment = async (e) => {
        e.preventDefault();
        const appointmentDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;

        if (!selectedWorkslotId) {
            alert("Invalid timeslot selected. Please choose again.");
            return;
        }

        const payload = {
            customerId: String(userId),
            consultantId: String(selectedConsultant.userId),
            appointmentDate,
            status: "PENDING",
            workslotId: selectedWorkslotId,
            name: user?.fullName || '',
            phoneNumber: user?.phoneNumber || '',
            note: note.trim(),
            message: message.trim(),
        };

        setLoading(true);
        try {
            await createAppointment(payload);
            alert('Booking successful!');
            navigate('/bookingsuccess');
            setShowBookingModal(false);
        } catch (error) {
            console.error("❌ Booking failed:", error);
            alert('Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const generateCalendar = (year, month) => {
        const days = ['Mo', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
        const dates = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) dates.push(i);
        return { days, dates };
    };

    const { days, dates } = generateCalendar(currentYear, currentMonth);

    return (
        <div>
            <HeaderSession />
            <div className="app_consultation">
                {/* Hero Section */}
                <section className="hero-section_consultation">
                    <div className="hero-header_consultation">
                        <p className="hero-subtitle_consultation">We are here to help you</p>
                        <h1 className="hero-title_consultation">
                            Gender Healthcare System for SWP Project{' '}
                            <span className="hero-title-highlight_consultation">We Are Ready to Help Your Health Problems</span>
                        </h1>
                    </div>

                    <div className="hero-content_consultation">
                        {/* Left Content */}
                        <div className="left-content_consultation">
                            <div className="floating-shapes_consultation">
                                <div className="shape_consultation shape-1_consultation"></div>
                                <div className="shape_consultation shape-2_consultation"></div>
                                <div className="shape_consultation shape-3_consultation"></div>
                            </div>

                            <div>
                                <span className="consultant-label_consultation">CONSULTANT</span>
                                <h2 className="main-title_consultation">
                                    Get Smart Solution<br />
                                    For Your Health
                                </h2>
                                <p className="main-description_consultation">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>

                            {/* Consultant Cards - hiển thị từ dữ liệu backend */}
                            <div className="consultants-grid_consultation">
                                {consultants.length > 0 ? (
                                    consultants.map((consultant) => (
                                        <div
                                            key={consultant.userId}
                                            className={`consultant-card_consultation ${animatedCards ? 'animated_consultation' : ''} ${selectedConsultant?.userId === consultant.userId ? 'selected_consultation' : ''}`}
                                            onClick={() => handleSelectConsultant(consultant)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img
                                                src={consultant.avatar || 'https://via.placeholder.com/100'}
                                                alt="avatar"
                                                className="consultant-image_consultation"
                                            />
                                            <div className="consultant-info_consultation">
                                                <h4>{consultant.name}</h4>
                                                <p>{consultant.specialization}</p>
                                                <p>{consultant.qualification}</p>
                                                <p>{consultant.experiencedYears} years experience</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Loading consultants...</p>
                                )}
                            </div>
                            <div>
                                <button
                                    className="cta-button_consultation"
                                    onClick={() => navigate('/appointments')}
                                >
                                    Booking History
                                </button>
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="right-content_consultation">
                            {selectedConsultant ? (
                                <>
                                    <div className="hero-image-container_consultation">
                                        <img
                                            src={selectedConsultant.avatar || 'https://via.placeholder.com/400x500'}
                                            alt={selectedConsultant.name}
                                            className="hero-image_consultation"
                                        />
                                        <h3 className="hero-name_consultation">{selectedConsultant.name}</h3>
                                        <div className="hero-rating_consultation">
                                            {selectedConsultant.avgRating !== null && selectedConsultant.avgRating > 0
                                                ? <>
                                                    {"★".repeat(Math.round(selectedConsultant.avgRating))}
                                                    {"☆".repeat(5 - Math.round(selectedConsultant.avgRating))}
                                                    <span style={{ marginLeft: 6, fontSize: "14px", color: "#666" }}>
                                                        ({selectedConsultant.avgRating})
                                                    </span>
                                                </>
                                                : "No ratings yet"}
                                        </div>
                                    </div>

                                    {/* Các thông tin chi tiết khác */}
                                    <div className="stats-grid_consultation">
                                        <div className="stat-card_consultation stat-card-pink_consultation">
                                            <div className="stat-value_consultation">{selectedConsultant.experiencedYears}+</div>
                                            <div className="stat-label_consultation">Years Experience</div>
                                        </div>
                                        <div className="stat-card_consultation stat-card-blue_consultation">
                                            <div className="stat-value_consultation">{selectedConsultant.specialization}</div>
                                            <div className="stat-label_consultation">Specialization</div>
                                        </div>
                                        <div className="stat-card_consultation stat-card-green_consultation">
                                            <div className="stat-value_consultation">{selectedConsultant.qualification}</div>
                                            <div className="stat-label_consultation">Qualification</div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p>Please select a consultant</p>
                            )}
                        </div>

                    </div>
                </section>

                {/* Booking Section */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            {/* Choose a Date */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose a Date</h3>
                                <div className="bg-white rounded-lg p-6 border">
                                    <div className="flex justify-between items-center mb-4">
                                        <button
                                            onClick={handlePrevMonth}
                                            className="px-3 py-1 rounded hover:bg-gray-100"
                                            aria-label="Previous Month"
                                        >
                                            &lt;
                                        </button>
                                        <h4 className="font-semibold text-gray-900">
                                            {monthNames[currentMonth]} {currentYear}
                                        </h4>
                                        <button
                                            onClick={handleNextMonth}
                                            className="px-3 py-1 rounded hover:bg-gray-100"
                                            aria-label="Next Month"
                                        >
                                            &gt;
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-2 mb-4">
                                        {days.map((day, index) => (
                                            <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {dates.map((date, index) => {
                                            const thisDate = new Date(currentYear, currentMonth, date);
                                            const isPast = thisDate < new Date(new Date().setHours(0, 0, 0, 0));

                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => !isPast && handleDateSelect(date)}
                                                    disabled={isPast}
                                                    className={`p-2 text-sm rounded-lg transition-colors
                ${selectedDate === date ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}
                ${isPast ? 'past-date_consultation' : ''}`}
                                                >
                                                    {date}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Pick a Time */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pick a time</h3>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                    {allSlots.length === 0 ? (
                                        <p>Loading slots...</p>
                                    ) : (
                                        allSlots.map((slot) => {
                                            const isAvailable = availableSlots.includes(slot.slotId);
                                            return (
                                                <button
                                                    key={slot.slotId}
                                                    disabled={!isAvailable}
                                                    onClick={() => {
                                                        if (isAvailable) {
                                                            const ws = availableWorkslots.find(w => w.slotId === slot.slotId);
                                                            handleTimeSelect(formatTime(slot.startTime));
                                                            setSelectedSlotId(slot.slotId);
                                                            setSelectedWorkslotId(ws?.workslotId);
                                                        }
                                                    }}
                                                    className={`p-3 text-sm rounded-lg border transition-colors ${selectedTime === formatTime(slot.startTime)
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : isAvailable
                                                            ? 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {formatTime(slot.startTime)}
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Booking Buttons */}
                            <div className="flex justify-center space-x-4">
                                <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                    Back
                                </button>
                                <button
                                    onClick={handleContinue}
                                    className="px-8 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            {showBookingModal && (
                <div className="modal-overlay_consultation">
                    <div className="modal-content_consultation">
                        <button className="modal-close_consultation" onClick={() => setShowBookingModal(false)}>✖</button>
                        <h2>Book your appointment</h2>

                        <div className="book-appointment-info_consultation" style={{ marginBottom: 20 }}>
                            <p><strong>Customer ID:</strong> {userId || "Not logged in"}</p>
                            <p><strong>Consultant:</strong> {selectedConsultant.fullName || selectedConsultant.name}</p>
                            <p><strong>Date:</strong> {selectedDate} {monthNames[currentMonth]} {currentYear}</p>
                            <p><strong>Time:</strong> {selectedTime}</p>
                            <p><strong>Workslot id:</strong> {selectedWorkslotId}</p>
                            <p><strong>Slot id:</strong> {selectedSlotId}</p>
                            <p><strong>Customer Name:</strong> {user?.fullName || 'N/A'}</p>
                            <p><strong>Customer Phone:</strong> {user?.phoneNumber || 'N/A'}</p>
                        </div>

                        <form onSubmit={handleSubmitAppointment}>
                            <div>
                                <label>Note</label>
                                <input
                                    type="text"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Additional notes (optional)"
                                />
                            </div>
                            <div>
                                <label>Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Your message"
                                />
                            </div>
                            <button type="submit" disabled={loading}>
                                {loading ? "Booking..." : "Book Now →"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <FooterSession />
        </div>
    );
};

export default HealthcareWebsite_consultation;
