import React, { useEffect, useState } from 'react';
import { getAllFeedbacks } from '../../api/adminApi';
import Sidebar from '../components/sidebar';
import './styles/AdminFeedback.css';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [ratingFilter, setRatingFilter] = useState('');
  const [consultantFilter, setConsultantFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await getAllFeedbacks();
      setFeedbacks(res.data);
    } catch (error) {
      console.error("Failed to load feedbacks", error);
    }
  };

  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchRating = ratingFilter ? fb.rating === parseInt(ratingFilter) : true;
    const matchConsultant = consultantFilter
      ? fb.consultantName?.toLowerCase().includes(consultantFilter.toLowerCase())
      : true;

    const createdAtDate = new Date(fb.createdAt);
    const matchStartDate = startDate ? createdAtDate >= new Date(startDate) : true;
    const matchEndDate = endDate ? createdAtDate <= new Date(endDate) : true;

    return matchRating && matchConsultant && matchStartDate && matchEndDate;
  });

  const renderStars = (rating) => {
    return (
      <div className="rating-stars_adminfeedback">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`star_adminfeedback ${
              i <= rating ? `star-${rating}_adminfeedback` : ''
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="admin-container_adminfeedback">
      <Sidebar />
      <div className="main-content_adminfeedback">
        <h2 className="title_adminfeedback">Feedbacks</h2>

        {/* --- Bộ lọc --- */}
        <div style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            style={{ padding: "6px", fontSize: "14px" }}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <input
            type="text"
            placeholder="Search by consultant name..."
            value={consultantFilter}
            onChange={(e) => setConsultantFilter(e.target.value)}
            style={{ padding: "6px", fontSize: "14px", width: "240px" }}
          />

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: "6px", fontSize: "14px" }}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: "6px", fontSize: "14px" }}
          />
        </div>

        <table className="table_adminfeedback">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Consultant</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#888" }}>No feedbacks found.</td>
              </tr>
            ) : (
              filteredFeedbacks.map(fb => (
                <tr key={fb.feedbackId}>
                  <td>{fb.feedbackId}</td>
                  <td>{fb.customerName}</td>
                  <td>{fb.consultantName}</td>
                  <td>{renderStars(fb.rating)}</td>
                  <td>{fb.comment}</td>
                  <td>{new Date(fb.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFeedback;
