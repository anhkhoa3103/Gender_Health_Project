import React, { useRef, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { formatNumberWithDot } from "../helper/helper";
import api from "../../../api/axios";
import { AuthContext } from "../../../context/AuthContext";
export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user } = useContext(AuthContext);
  // Adjust these as needed
  const selectedTestTypes = location.state?.selectedTestTypes || [];
  // Get customerId, appointmentId from location.state or user context
  const customerId = user?.id;
  const appointmentId = location.state?.appointmentId || 1; // Example fallback

  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageData, setImageData] = useState(""); // will store base64 if you want

  const total = selectedTestTypes.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview the image
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setImageData(event.target.result); // base64 string
      };
      reader.readAsDataURL(file);
    }
  };

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
      await api.post("/api/invoice/create-invoice", {
        customerId,
        appointmentId,
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
<div className="flex flex-col items-center min-h-screen justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Payment Summary</h2>
        <div className="flex justify-center mb-6">
          <img src="/qr.png" alt="Payment QR Code" className="w-40 h-40 object-contain rounded-md border" />
        </div>
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
              <img src={uploadedImage} alt="Uploaded Proof" className="w-40 h-40 object-contain border rounded-md" />
            </div>
          )}
        </div>
        <table className="min-w-full text-sm mb-6">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Test Type</th>
              <th className="p-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {selectedTestTypes.map((type) => (
              <tr key={type.testId} className="border-b last:border-none">
                <td className="p-2">{type.testName}</td>
                <td className="p-2 text-right">
                  {formatNumberWithDot(type.price)} VNĐ
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td className="p-2 font-bold">Total</td>
              <td className="p-2 text-right font-bold text-blue-600">
                {formatNumberWithDot(total)} VNĐ
              </td>
            </tr>
          </tfoot>
        </table>
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
            disabled={selectedTestTypes.length === 0 || !uploadedImage}
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
