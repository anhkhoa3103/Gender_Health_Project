import React, { useState, useEffect } from 'react';
import { submitFeedback, updateFeedback } from '../../../api/feedbackApi';
import '../style/Feedback.css';

const FeedbackForm = ({ customerId, consultantId, consultationId, onSuccess, initialFeedback = null }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (initialFeedback) {
      setRating(initialFeedback.rating);
      setComment(initialFeedback.comment);
      setIsEdit(true);
    }
  }, [initialFeedback]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateFeedback(initialFeedback.feedbackId, {
          rating,
          comment,
          consultationId, 
        });
        alert("Feedback updated successfully!");
      } else {
        await submitFeedback({
          customerId,
          consultantId,
          consultationId,
          rating,
          comment,
        });
        alert("Feedback submitted successfully!");
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting/updating feedback:", error);
      alert("Failed to submit/update feedback.");
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h3 className="form-title">{isEdit ? "Edit Your Feedback" : "Submit Feedback"}</h3>

      <label className="form-label">Rating:</label>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'star filled' : 'star'}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>

      <label className="form-label">Comment:</label>
      <textarea
        className="form-textarea"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your feedback..."
        rows={4}
      />

      <button type="submit" className="submit-btn">
        {isEdit ? "Update" : "Submit"}
      </button>
    </form>
  );
};

export default FeedbackForm;
