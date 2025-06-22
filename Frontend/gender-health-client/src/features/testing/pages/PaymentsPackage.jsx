import React, { useRef, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatNumberWithDot } from "../helper/helper";
import api from "../../../api/axios";
import { AuthContext } from "../../../context/AuthContext";
import "../styles/Payments.css";


export default function PaymentPageForPackage() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user } = useContext(AuthContext);

  const selectedPackage = location.state?.selectedPackage;
  const appointmentId = location.state?.appointmentId || 1;
  const customerId = user?.id;

  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageData, setImageData] = useState(""); // For base64

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setImageData(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!customerId) {
      alert("Bạn chưa đăng nhập! Vui lòng đăng nhập để thanh toán.");
      return;
    }
    if (!selectedPackage) {
      alert("No package selected.");
      return;
    }
    if (!imageData) {
      alert("Please upload your payment proof.");
      return;
    }
    try {
      await api.post("/api/invoice/create-invoice", {
        customerId,
        appointmentId,
        amount: selectedPackage.totalPrice,
        paid: false,
        paymentProof: imageData,
        paidItems: JSON.stringify(selectedPackage),
      });

      alert("Payment submitted!");
      navigate("/payment-success");
    } catch (err) {
      alert(
        "Error submitting payment: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  if (!selectedPackage) {
    return (
      <div className="payment-container">
        <div className="payment-card" style={{ textAlign: "center" }}>
          <div className="payment-title">No package selected.</div>
          <button
            className="btn btn-confirm"
            onClick={() => navigate("/package")}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-title">Payment for Package</h2>
        <img
          src="/qr.png" alt="Payment QR Code" className="payment-qr"
         
        />
        <div>
          <label className="payment-label">
            Upload Payment Proof (screenshot/photo)
          </label>
          <input
            type="file"
            accept="image/*"
            className="payment-input"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          {uploadedImage && (
            <img
              src={uploadedImage}
              alt="Uploaded Proof"
              className="payment-proof-img"
            />
          )}
        </div>
        <div className="mb-6" style={{ marginTop: "1.5rem" }}>
          <div className="flex justify-between text-lg font-semibold" style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "1.125rem",
            fontWeight: "600"
          }}>
            <span>Package:</span>
            <span>{selectedPackage.packageName}</span>
          </div>
          <div className="flex justify-between text-lg mt-2" style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "1.125rem",
            marginTop: ".5rem"
          }}>
            <span>Price:</span>
            <span className="payment-total-amount">
              {formatNumberWithDot(selectedPackage.totalPrice || 0)} VNĐ
            </span>
          </div>
        </div>
        <div className="payment-buttons">
          <button
            className="btn btn-back"
            onClick={() => navigate("/package")}
          >
            Back
          </button>
          <button
            className="btn btn-confirm"
            onClick={handleSubmit}
            disabled={!uploadedImage}
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
