import React, { useRef, useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatNumberWithDot } from "../helper/helper";
import api from "../../../api/axios";
import { AuthContext } from "../../../context/AuthContext";
import "../styles/Payments.css";

// Helper to create STI Appointment with testIds
const createStiAppointment = async ({ customerId, amount, testIds }) => {
  const res = await api.post("/api/sti-appointment/create", {
    customerId,
    amount,
    testIds,
  });
  return res.data; // { appointmentId, ... }
};

export default function PaymentPageForPackage() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user } = useContext(AuthContext);

  const initialSelectedPackage = location.state?.selectedPackage;
  const customerId = user?.id;
  const [selectedPackage, setSelectedPackage] = useState(initialSelectedPackage);
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageData, setImageData] = useState(""); // For base64

  // Fetch testTypes of package if needed
  useEffect(() => {
    async function fetchTestTypes() {
      if (
        selectedPackage &&
        !selectedPackage.testTypes && // package missing testTypes
        selectedPackage.packageId
      ) {
        setLoading(true);
        try {
          const resp = await api.get(`/api/package/${selectedPackage.packageId}/test-types`);
          setSelectedPackage((prev) => ({
            ...prev,
            testTypes: resp.data,
          }));
        } catch (err) {
          alert("Failed to load test types: " + (err.response?.data?.message || err.message));
        }
        setLoading(false);
      }
    }
    fetchTestTypes();
    // eslint-disable-next-line
  }, [selectedPackage]);

  // Get test IDs for appointment creation
  const testIds = selectedPackage?.testTypes?.map((t) => t.testId) || [];

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

  // Main submit: Always create appointment + invoice for packages
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
    if (!testIds.length) {
      alert("No test types found in package!");
      return;
    }
    try {
      // 1. Create appointment (backend also creates testResult & detail!)
      const result = await createStiAppointment({
        customerId,
        amount: selectedPackage.totalPrice,
        testIds,
      });
      const appointmentId = result.appointmentId;
      if (!appointmentId) {
        alert("Failed to create appointment. Please try again.");
        return;
      }
      // 2. Create invoice for this appointment
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

  if (loading || (!selectedPackage.testTypes && selectedPackage.packageId)) {
    return (
      <div className="payment-container">
        <div className="payment-card" style={{ textAlign: "center" }}>
          <div className="payment-title">Loading package test types...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-title">Payment for Package</h2>
        <img
          src="/qr.png"
          alt="Payment QR Code"
          className="payment-qr"
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
          <div
            className="flex justify-between text-lg font-semibold"
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "1.125rem",
              fontWeight: "600",
            }}
          >
            <span>Package:</span>
            <span>{selectedPackage.packageName}</span>
          </div>
          <div
            className="flex justify-between text-lg mt-2"
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "1.125rem",
              marginTop: ".5rem",
            }}
          >
            <span>Price:</span>
            <span className="payment-total-amount">
              {formatNumberWithDot(selectedPackage.totalPrice || 0)} VNĐ
            </span>
          </div>
          <div style={{ marginTop: ".5rem" }}>
            <strong>Tests included:</strong>
            <ul style={{ paddingLeft: "1.5rem", marginTop: ".25rem" }}>
              {selectedPackage.testTypes?.map((type) => (
                <li key={type.testId}>{type.testName}</li>
              ))}
            </ul>
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
