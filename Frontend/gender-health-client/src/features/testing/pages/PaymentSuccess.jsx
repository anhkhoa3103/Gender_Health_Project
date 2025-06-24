import React from 'react';
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import "../styles/PaymentSuccess.css"; // Import the CSS!

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="payment-success-bg">
      <div className="payment-success-card">
        <CheckCircle className="payment-success-icon" />
        <h1 className="payment-success-title">
          Payment Successful!
        </h1>
        <p className="payment-success-msg">
          Thank you for your payment. Your transaction has been received and is being processed.
        </p>
        <div className="payment-success-alert">
          <strong>Important:</strong>
          Please visit our center within <span style={{ fontWeight: 700 }}>7 days</span> from the order date to complete your testing.<br />
          If you do not come to the center within this time, your appointment will be <span style={{ fontWeight: 700 }}>automatically cancelled</span>.
        </div>
        <button
          className="payment-success-btn"
          onClick={() => navigate("/")}
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
}
