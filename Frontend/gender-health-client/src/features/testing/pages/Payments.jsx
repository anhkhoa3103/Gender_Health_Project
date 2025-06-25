import React, { useRef, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { AuthContext } from "../../../context/AuthContext";
import { formatNumberWithDot } from "../helper/helper";
import "../styles/Payments.css"; // Import the CSS
import qrimg from "../../img/qr.jpg"

// Helper to create STI Appointment (sends testIds array)
const createStiAppointment = async ({ customerId, amount, testIds }) => {
  const res = await api.post("/api/sti-appointment/create", {
    customerId,
    amount,
    testIds, // <-- Add this!
  });
  return res.data; // { appointmentId, status }
};

export default function Payments() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user } = useContext(AuthContext);

  // Data from previous page
  const selectedTestTypes = location.state?.selectedTestTypes || [];
  const customerId = user?.id;
  const appointmentId = location.state?.appointmentId; // If editing, may exist; usually undefined

  // States
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageData, setImageData] = useState(""); // base64

  // Calculate total
  const total = selectedTestTypes.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );

  // Extract test IDs for backend
  const testIds = selectedTestTypes.map(item => item.testId);

  // Handle file upload and preview
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

  // Main submit function
  const handleSubmit = async () => {
    if (selectedTestTypes.length === 0) {
      alert("Please select at least one test type.");
      return;
    }
    if (!imageData) {
      alert("Please upload your payment proof.");
      return;
    }
    try {
      let finalAppointmentId = appointmentId;

      // 1. Create appointment (and test result + details) if needed
      if (!finalAppointmentId) {
        const result = await createStiAppointment({
          customerId,
          amount: total,
          testIds, // Pass testIds here!
        });
        finalAppointmentId = result.appointmentId;
        if (!finalAppointmentId) {
          alert("Failed to create appointment. Please try again.");
          return;
        }
        // Backend automatically creates TestResult and TestResultDetail!
      }

      // 2. Now create the invoice
      await api.post("/api/invoice/create-invoice", {
        customerId,
        appointmentId: finalAppointmentId,
        amount: total,
        paid: false,
        paymentProof: imageData,
        paidItems: JSON.stringify(selectedTestTypes),
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

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-title">Payment Summary</h2>
        <img src={qrimg} alt="Payment QR Code" className="payment-qr" />
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
            <img src={uploadedImage} alt="Uploaded Proof" className="payment-proof-img" />
          )}
        </div>
        <table className="payment-table">
          <thead>
            <tr>
              <th>Test Type</th>
              <th className="payment-total-amount">Price</th>
            </tr>
          </thead>
          <tbody>
            {selectedTestTypes.map((type) => (
              <tr key={type.testId}>
                <td>{type.testName}</td>
                <td className="payment-total-amount">
                  {formatNumberWithDot(type.price)} VNĐ
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="payment-total">Total</td>
              <td className="payment-total-amount">
                {formatNumberWithDot(total)} VNĐ
              </td>
            </tr>
          </tfoot>
        </table>
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
            disabled={selectedTestTypes.length === 0 || !uploadedImage}
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
