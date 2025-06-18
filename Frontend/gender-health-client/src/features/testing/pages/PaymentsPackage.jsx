import React, { useRef, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatNumberWithDot } from "../helper/helper";
import api from "../../../api/axios";
import { AuthContext } from "../../../context/AuthContext";

export default function PaymentPageForPackage() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user } = useContext(AuthContext);

  // Get package info from navigation state
  const selectedPackage = location.state?.selectedPackage;
  const appointmentId = location.state?.appointmentId || 1; // You may update as needed
  const customerId = user?.id; // Use current user

  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageData, setImageData] = useState(""); // For base64

  // Handle file input change
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

  // Handle submit payment
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
        paidItems: JSON.stringify(selectedPackage), // Array, to match test payment logic
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-2xl shadow">
          <div className="text-lg font-bold mb-4">No package selected.</div>
          <button
            className="bg-blue-500 px-4 py-2 text-white rounded"
            onClick={() => navigate("/package")}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Payment for Package</h2>
        {/* QR Code Image */}
        <div className="flex justify-center mb-6">
          <img
            src="/qr.png"
            alt="Payment QR Code"
            className="w-40 h-40 object-contain rounded-md border"
          />
        </div>
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-600">
            Upload Payment Proof (screenshot/photo)
          </label>
          <input
            type="file"
            accept="image/*"
            className="mb-2"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          {uploadedImage && (
            <div className="mt-2 flex justify-center">
              <img
                src={uploadedImage}
                alt="Uploaded Proof"
                className="w-40 h-40 object-contain border rounded-md"
              />
            </div>
          )}
        </div>
        <div className="mb-6">
          <div className="flex justify-between text-lg font-semibold">
            <span>Package:</span>
            <span>{selectedPackage.packageName}</span>
          </div>
          <div className="flex justify-between text-lg mt-2">
            <span>Price:</span>
            <span className="text-blue-600 font-bold">
              {formatNumberWithDot(selectedPackage.totalPrice || 0)} VNĐ
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
            onClick={() => navigate("/package")}
          >
            Back
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold"
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
