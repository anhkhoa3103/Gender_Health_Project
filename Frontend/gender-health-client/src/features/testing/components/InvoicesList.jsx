import { useEffect, useState } from "react";
import { getInvoicesAxios } from "../../../api/invoice";
import { formatNumberWithDot } from "../helper/helper";
import { useNavigate } from "react-router-dom";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const navigate = useNavigate();

  function openModal(invoice) {
    setSelectedInvoice(invoice);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setSelectedInvoice(null);
  }

  const getInvoices = async () => {
    try {
      const { data } = await getInvoicesAxios();
      setInvoices(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInvoices();
  }, []);

  // --------- PARSE PAID ITEMS ---------
  let paidItems = [];
  try {
    if (selectedInvoice && selectedInvoice.paidItems) {
      if (Array.isArray(selectedInvoice.paidItems)) {
        paidItems = selectedInvoice.paidItems;
      } else if (typeof selectedInvoice.paidItems === "string") {
        const parsed = JSON.parse(selectedInvoice.paidItems);
        if (Array.isArray(parsed)) {
          paidItems = parsed;
        } else if (typeof parsed === "object") {
          paidItems = [parsed];
        }
      } else if (typeof selectedInvoice.paidItems === "object") {
        paidItems = [selectedInvoice.paidItems];
      }
    }
  } catch (e) {
    paidItems = [];
  }

  return (
    <div className="px-8 py-10 bg-blue-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Invoices</h1>
      <div className="overflow-x-auto rounded-2xl shadow-xl bg-white border border-blue-100">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-100 text-blue-800 font-semibold">
              <th className="p-4">Invoice #</th>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Appointment ID</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Paid</th>
              <th className="p-4">Created At</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices && invoices.length > 0 ? (
              invoices.map((inv, idx) => (
                <tr
                  key={inv.id || inv.invoice_id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-blue-50"
                  } border-b last:border-none hover:bg-blue-100 transition`}
                >
                  <td className="p-4">{inv.id || inv.invoice_id}</td>
                  <td className="p-4">{inv.customerName || "-"}</td>
                  <td className="p-4">
                    {inv.appointmentId || inv.appointment_id || "-"}
                  </td>
                  <td className="p-4 text-blue-700 font-semibold">
                    {formatNumberWithDot(inv.amount || 0)} VNĐ
                  </td>
                  <td className="p-4">
                    {inv.paid ? (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium shadow-sm">
                        Yes
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 font-medium shadow-sm">
                        No
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {inv.createdAt || inv.created_at
                      ? new Date(
                          inv.createdAt || inv.created_at
                        ).toLocaleString("vi-VN")
                      : "-"}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => openModal(inv)}
                      className="bg-blue-500 text-white px-4 py-1.5 rounded-xl font-medium shadow hover:bg-blue-600 transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-400">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for details */}
      {modalIsOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="rounded-2xl border-2 border-blue-200 px-8 py-7 bg-white w-[450px] shadow-2xl">
            <h2 className="text-xl font-bold mb-3 text-blue-700">
              Invoice #{selectedInvoice.id || selectedInvoice.invoice_id}
            </h2>
            <div className="mb-1">
              Customer Name:{" "}
              <span className="font-semibold">
                {selectedInvoice.customerName}
              </span>
            </div>
            <div className="mb-1">
              Appointment ID:{" "}
              <span className="font-semibold">
                {selectedInvoice.appointmentId ||
                  selectedInvoice.appointment_id}
              </span>
            </div>
            <div className="mb-1">
              Amount:{" "}
              <span className="font-semibold text-blue-600">
                {formatNumberWithDot(selectedInvoice.amount || 0)} VNĐ
              </span>
            </div>
            {/* Show payment proof if exists */}
            <div className="mb-1">
              <span className="block font-medium mb-1">Payment Proof:</span>
              {selectedInvoice.paymentProof &&
              selectedInvoice.paymentProof.startsWith("http") ? (
                <a
                  href={selectedInvoice.paymentProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {selectedInvoice.paymentProof}
                </a>
              ) : (
                <span className="italic text-gray-700">
                  {selectedInvoice.paymentProof}
                </span>
              )}
            </div>
            {/* Show selected/paid packages/items */}
            {paidItems.length > 0 && (
              <div className="mb-3">
                <span className="block font-medium mb-1">Paid Items:</span>
                <ul className="pl-4 list-disc">
                  {paidItems.map((item, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">{item.testName || item.packageName || "Item"}</span>
                      {item.price && (
                        <span className="ml-2 text-blue-700">({formatNumberWithDot(item.price)} VNĐ)</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-1">
              Paid:{" "}
              <span
                className={`font-semibold ${
                  selectedInvoice.paid ? "text-green-700" : "text-red-600"
                }`}
              >
                {selectedInvoice.paid ? "Yes" : "No"}
              </span>
            </div>
            <div className="mb-3">
              Created At:{" "}
              <span className="font-medium">
                {selectedInvoice.createdAt || selectedInvoice.created_at
                  ? new Date(
                      selectedInvoice.createdAt || selectedInvoice.created_at
                    ).toLocaleString("vi-VN")
                  : "-"}
              </span>
            </div>
            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={closeModal}
                className="rounded-lg px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
