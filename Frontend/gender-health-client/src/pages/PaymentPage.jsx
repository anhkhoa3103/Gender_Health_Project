import React, { useState } from 'react';

export default function PaymentPage() {
  const [cardNumber, setCardNumber] = useState('');
  const [name, setName] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState('89.99');

  const handlePay = (e) => {
    e.preventDefault();
    alert('Payment successful!');
    window.location.href = '/payment-confirm'; // redirect to confirmation page
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm('Are you sure you want to cancel the payment?');
    if (confirmCancel) {
      window.location.href = '/'; // or redirect to '/booking', '/home', etc.
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Payment Details</h2>
        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1234 5678 9012 3456"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Expiration</label>
              <input
                type="text"
                required
                value={exp}
                onChange={(e) => setExp(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MM/YY"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">CVV</label>
              <input
                type="password"
                required
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="text"
              value={amount}
              readOnly
              className="w-full mt-1 px-4 py-2 border bg-gray-100 rounded-lg"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Pay ${amount}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
