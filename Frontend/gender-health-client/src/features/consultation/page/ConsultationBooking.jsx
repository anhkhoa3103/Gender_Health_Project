import React, { useState, useEffect } from 'react';
import { Calendar, Users, Download, Clock, CheckCircle, Shield, User, Award, Globe } from 'lucide-react';

import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../style/ConsultationBooking.css";
import "../style/Last.css";

const HealthcareWebsite = () => {
  const [animatedCards, setAnimatedCards] = useState(false);
    const [stats, setStats] = useState(null); // Thêm state cho stats
  const [allFeedbacks, setAllFeedbacks] = useState([]); // Thêm state cho allFeedbacks
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [feedbacks, setFeedbacks] = useState([
    { customerName: "Sarah Johnson", comment: "Excellent service and very professional staff!", rating: 5 },
    { customerName: "Mike Chen", comment: "Great consultation experience, highly recommended.", rating: 4 },
    { customerName: "Emma Davis", comment: "Very helpful and understanding consultants.", rating: 5 }
  ]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedCards(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

   useEffect(() => {
  const fetchData = async () => {
    try {
      // Gọi tuần tự các API
      const feedbacksResponse = await fetch("http://localhost:8080/api/feedback/consultant/4/with-names");
      const feedbacksData = await feedbacksResponse.json();
      setFeedbacks(feedbacksData);

      const statsResponse = await fetch("http://localhost:8080/api/feedback/consultant/4/rating-summary");
      const statsData = await statsResponse.json();
      setStats(statsData);

      const allResponse = await fetch("http://localhost:8080/api/feedback/with-names");
      const allData = await allResponse.json();
      setAllFeedbacks(allData);

    } catch (error) {
      console.error("Failed to fetch data:", error);
      // Xử lý fallback
    }
  };

  fetchData();
}, []);

  const navigate = useNavigate();

  const consultants = [
    { name: "Jennifer Green", rating: "4.8 (150 Reviews)", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face" },
    { name: "Jack Williams", rating: "4.9 (250 Reviews)", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face" },
    { name: "Priti Malik", rating: "4.8 (180 Reviews)", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face" }
  ];

  const stats1 = [
    { value: "12+", label: "Years Experience", color: "stat-card-pink" },
    { value: "120+", label: "Active Country", color: "stat-card-blue" },
    { value: "15+", label: "Specialized Consultants", color: "stat-card-green" }
  ];

  const stats2 = [
    { value: "31 hours", label: "Professional Training", color: "stat-card-light-blue" },
    { value: "203 hours", label: "Counseling Practice", color: "stat-card-light-purple" },
    { value: "58 hours", label: "Counseling Supervisor", color: "stat-card-light-green" }
  ];



  
  const generateCalendar = () => {
    const days = ['Mo', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
    const dates = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(i);
    }
    return { days, dates };
  };

  const timeSlots = [
    '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30'
  ];

   const { days, dates } = generateCalendar();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      alert(`Appointment booked for ${selectedDate} at ${selectedTime}`);
    } else {
      alert('Please select both date and time');
    }
  };


  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <div className="logo-icon">G</div>
            <span className="logo-text">Gender Healthcare System</span>
          </div>
          <nav className="nav">
            <a href="#">Home</a>
            <a href="#">About Us</a>
            <a href="#">Service</a>
            <a href="#">Blog</a>
            <a href="#">Contact Us</a>
          </nav>
          <button className="login-btn">Log Out</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-header">
          <p className="hero-subtitle">We are here to help you</p>
          <h1 className="hero-title">
            Gender Healthcare System for SWP Project{' '}
            <span className="hero-title-highlight">We Are Ready to Help Your Health Problems</span>
          </h1>
        </div>

        <div className="hero-content">
          {/* Left Content */}
          <div className="left-content">
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>

            <div>
              <span className="consultant-label">CONSULTANT</span>
              <h2 className="main-title">
                Get Smart Solution<br />
                For Your Health
              </h2>
              <p className="main-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <button
            className="cta-button"
            onClick={() => navigate("/bookappointment")}
          >
            Book Appointment
          </button>
            </div>

            {/* Consultant Cards */}
            {[0, 1, 2].map((rowIndex) => (
              <div key={rowIndex} className="consultants-grid">
                {consultants.map((consultant, index) => (
                  <div 
                    key={`${rowIndex}-${index}`} 
                    className={`consultant-card ${animatedCards ? 'animated' : ''}`}
                    style={{ transitionDelay: `${(rowIndex * 3 + index) * 0.1}s` }}
                  >
                    <img 
                      src={consultant.image} 
                      alt={consultant.name}
                      className="consultant-image"
                    />
                    <div className="consultant-info">
                      <h4>{consultant.name}</h4>
                      <p>{consultant.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Right Content */}
          <div className="right-content">
            <div className="hero-image-container">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face" 
                alt="John Cena" 
                className="hero-image"
              />
              <h3 className="hero-name">John Cena</h3>
              <div className="hero-rating">★★★★★</div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              {stats1.map((stat, index) => (
                <div key={index} className={`stat-card ${stat.color}`}>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="stats-grid">
              {stats2.map((stat, index) => (
                <div key={index} className={`stat-card ${stat.color}`}>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <button
            className="cta-button"
            onClick={() => navigate("/appointments")}
          >
            HistoryBooking
          </button>
        </div>
      </section>
       {/* John Cena Profile Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">John Cena</h2>
          <div className="bg-blue-50 p-8 rounded-lg">
            <div className="flex items-start space-x-4 mb-8">
              <div className="w-2 h-16 bg-blue-500 rounded-full"></div>
              <p className="text-gray-700 italic text-left">
                "The passion for Human Resource Management, Human Development, and the journey of people is what drives me to support career orientation in which I choose to create a team from excitement in career guidance. Team believes that the world of careers will be more beautiful in the future if we have time, dedicate ourselves to continuous growth and values for society from our careers. Therefore, Team really wants to accompany young people in the journey of self-discovery, life discovery and creating a satisfactory career."
              </p>
            </div>
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
                  <h4 className="font-semibold text-gray-900">August 2024</h4>
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
                      className={`p-2 text-sm rounded-lg transition-colors ${
                        selectedDate === date
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
                {timeSlots.map((time, index) => (
                  <button
                    key={index}
                    onClick={() => handleTimeSelect(time)}
                    className={`p-3 text-sm rounded-lg border transition-colors ${
                      selectedTime === time
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Booking Buttons */}
            <div className="flex justify-center space-x-4">
              <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button 
  onClick={() => navigate("/bookingsuccess")}  // Đã sửa từ "/bookingsucces" thành "/bookingsuccess"
  className="px-8 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
>
  Continue
</button>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <p className="text-gray-400">© 2024 Gender Healthcare System. All rights reserved.</p>
        </div>
        
      </footer>
      <div className="rating-summary-section">
  <h3>Consultant Rating Summary</h3>
  {stats ? (
    <div className="rating-details">
      <div className="rating-average">
        <span className="rating-value">{stats.averageRating.toFixed(1)}</span>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span 
              key={star} 
              className={star <= Math.round(stats.averageRating) ? 'filled' : ''}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <div className="feedback-count">
        Based on {stats.feedbackCount} reviews
      </div>
    </div>
  ) : (
    <p>Loading rating data...</p>
  )}
</div>
    </div>
  );
};

export default HealthcareWebsite;
