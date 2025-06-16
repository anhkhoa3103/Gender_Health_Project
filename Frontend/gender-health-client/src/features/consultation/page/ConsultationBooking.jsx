import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getConsultants, getAllSlot, getAvailableSlots } from "../../../api/consultationApi";
import HeaderSession from "../../components/Header";
import FooterSession from "../../home/sessions/FooterSession";
import "../style/ConsultationBooking.css"
import "../style/Last.css"

const HealthcareWebsite_consultation = () => {
  const [animatedCards, setAnimatedCards] = useState(false);
  const [stats, setStats] = useState(null);
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [consultants, setConsultants] = useState([]);
  const [allSlots, setAllSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedConsultant, setSelectedConsultant] = useState(null);


  const [feedbacks, setFeedbacks] = useState([
    { customerName: "Sarah Johnson", comment: "Excellent service and very professional staff!", rating: 5 },
    { customerName: "Mike Chen", comment: "Great consultation experience, highly recommended.", rating: 4 },
    { customerName: "Emma Davis", comment: "Very helpful and understanding consultants.", rating: 5 }
  ]);

  // State quản lý tháng/năm hiện tại cho lịch
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-based

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedCards(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Lấy danh sách consultants từ backend
  useEffect(() => {
    getConsultants()
      .then(res => setConsultants(res.data))
      .catch(console.error);
  }, []);

  // Lấy tất cả slot từ backend
  useEffect(() => {
    getAllSlot()
      .then(res => setAllSlots(res.data))
      .catch(console.error);
  }, []);

  // Mặc định chọn consultant đầu tiên nếu chưa chọn
  useEffect(() => {
    if (consultants.length > 0 && !selectedConsultant) {
      setSelectedConsultant(consultants[0]);
    }
  }, [consultants, selectedConsultant]);

  // Khi consultant hoặc ngày thay đổi, lấy các slot available từ backend
  useEffect(() => {
    if (selectedConsultant && selectedDate !== null) {
      const isoDate = formatDateISO(currentYear, currentMonth, selectedDate);
      getAvailableSlots(selectedConsultant.userId, isoDate)
        .then(res => {
          const availableSlotIds = res.data.map(ws => ws.slotId);
          setAvailableSlots(availableSlotIds);
          setSelectedTime(null); // reset giờ chọn khi ngày hoặc consultant đổi
        })
        .catch(console.error);
    } else {
      setAvailableSlots([]);
      setSelectedTime(null);
    }
  }, [selectedConsultant, selectedDate, currentMonth, currentYear]);


  // Format ngày sang yyyy-MM-dd
  const formatDateISO = (year, month, day) => {
    const mm = (month + 1).toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Tạo lịch theo tháng và năm hiện tại
  const generateCalendar = (year, month) => {
    const days = ['Mo', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
    const dates = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(i);
    }
    return { days, dates };
  };

  const { days, dates } = generateCalendar(currentYear, currentMonth);

  // Hàm format thời gian "HH:mm:ss" => "HH:mm"
  const formatTime = (time) => time.slice(0, 5);

  // Nút chuyển tháng trước
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null); // reset ngày chọn khi đổi tháng
  };

  // Nút chuyển tháng kế tiếp
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null); // reset ngày chọn khi đổi tháng
  };

  // Chọn ngày
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Chọn giờ
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Đặt lịch demo (alert)
  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      alert(`Appointment booked for ${selectedDate} ${monthNames[currentMonth]} ${currentYear} at ${selectedTime}`);
    } else {
      alert('Please select both date and time');
    }
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedTime || !selectedConsultant) {
      alert('Please select consultant, date and time before continuing');
      return;
    }

    // Tạo object data để truyền sang BookAppointment
    const appointmentData = {
      consultant: selectedConsultant,
      date: selectedDate,
      time: selectedTime,
      year: currentYear,
      month: currentMonth
    };

    navigate('/bookappointment', { state: appointmentData });
  }

  // Tên các tháng
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Chọn consultant
  const handleSelectConsultant = (consultant) => {
    setSelectedConsultant(consultant);
  };

  return (
    <>
      <div className="heder-section">
        <HeaderSession />
      </div>

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
                <button
                  className="cta-button_consultation"
                  onClick={() => navigate("/bookappointment")}
                >
                  Book Appointment
                </button>
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
                    <div className="hero-rating_consultation">★★★★★</div>
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

          <div>
            <button
              className="cta-button_consultation"
              onClick={() => navigate("/appointments")}
            >
              HistoryBooking
            </button>
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
                    {dates.map((date, index) => (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(date)}
                        className={`p-2 text-sm rounded-lg transition-colors ${selectedDate === date
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                          }`}
                      >
                        {date}
                      </button>
                    ))}
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
                          onClick={() => isAvailable && handleTimeSelect(formatTime(slot.startTime))}
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
      <div className="footer-section">
        <FooterSession />
      </div>
    </>
  );
};

export default HealthcareWebsite_consultation;
