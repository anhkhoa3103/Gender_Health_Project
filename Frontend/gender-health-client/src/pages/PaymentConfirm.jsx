import React from 'react';

export default function PaymentConfirm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
        <div className="w-20 h-20 mx-auto mb-4">
          <svg
            className="w-full h-full text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2l4 -4m5 2a9 9 0 11-18 0a9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">Your payment has been confirmed. Thank you!</p>

        <div className="bg-gray-100 rounded-lg p-4 text-left text-sm mb-6">
          <p><strong>Order ID:</strong> #123456</p>
          <p><strong>Amount:</strong> $89.99</p>
          <p><strong>Payment Method:</strong> Credit Card</p>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={() => (window.location.href = '/')}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Go to Home
          </button>
          <button
            onClick={() => (window.location.href = '/package')}
            className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
          >
            Order Another
          </button>
        </div>
      </div>
    </div>
  );
}
