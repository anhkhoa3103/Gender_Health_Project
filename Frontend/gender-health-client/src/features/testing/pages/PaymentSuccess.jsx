import React from 'react';
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react"; // optional icon, install lucide-react or use another

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-700 mb-6 text-center">
          Thank you for your payment. Your transaction has been received and is being processed.
        </p>
        <button
          className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
          onClick={() => navigate("/")}
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
}
