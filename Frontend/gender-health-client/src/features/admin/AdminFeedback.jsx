import React, { useEffect, useState } from 'react';
import { getAllFeedbacks } from '../../api/adminApi';
import Sidebar from '../components/sidebar'; // sidebar bên trái
import './styles/AdminFeedback.css'; // CSS cho trang AdminFeedback

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

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

  return (
    <div className="admin-container_adminfeedback">
      <Sidebar />

      <div className="main-content_adminfeedback">
        <h2 className="title_adminfeedback">All Feedbacks</h2>

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
            {feedbacks.map(fb => (
              <tr key={fb.feedbackId}>
                <td>{fb.feedbackId}</td>
                <td>{fb.customerName}</td>
                <td>{fb.consultantName}</td>
                <td>{fb.rating}</td>
                <td>{fb.comment}</td>
                <td>{fb.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFeedback;
