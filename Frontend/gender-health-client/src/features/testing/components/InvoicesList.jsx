import { useEffect, useState, useContext } from "react";
import { getInvoicesAxios } from "../../../api/invoice";
import { formatNumberWithDot } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import "../styles/Invoices.css";
import { AuthContext } from "../../../context/AuthContext"; // Add this

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get logged-in user

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
  useEffect(() => {
  console.log("Fetched invoices:", invoices);
  console.log("Logged in user id:", user?.id);
}, [invoices, user]);

  // Filter invoices by logged-in user
  const filteredInvoices = user && user.id
  ? invoices.filter(
      (inv) =>
        String(inv.customerId) === String(user.id) ||
        String(inv.customer_id) === String(user.id)
    )
  : [];


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
    <div className="invoice-container">
      <h1 className="invoice-title">Invoices</h1>
      <div className="invoice-table-wrapper">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer Name</th>
              <th>Appointment ID</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices && filteredInvoices.length > 0 ? (
              filteredInvoices.map((inv, idx) => (
                <tr key={inv.id || inv.invoice_id}>
                  <td>{inv.id || inv.invoice_id}</td>
                  <td>{inv.customerName || "-"}</td>
                  <td>{inv.appointmentId || inv.appointment_id || "-"}</td>
                  <td className="amount">{formatNumberWithDot(inv.amount || 0)} VNĐ</td>
                  <td>
                    <span className={inv.paid ? "paid-yes" : "paid-no"}>
                      {inv.paid ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    {inv.createdAt || inv.created_at
                      ? new Date(
                          inv.createdAt || inv.created_at
                        ).toLocaleString("vi-VN")
                      : "-"}
                  </td>
                  <td>
                    <button
                      onClick={() => openModal(inv)}
                      className="view-btn"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="no-invoices">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for details */}
      {modalIsOpen && selectedInvoice && (
        <div className="invoice-modal-bg">
          <div className="invoice-modal-card">
            <h2 className="invoice-modal-title">
              Invoice #{selectedInvoice.id || selectedInvoice.invoice_id}
            </h2>
            <div style={{ marginBottom: ".35rem" }}>
              <span style={{ color: "#555" }}>Customer Name:</span>{" "}
              <span className="font-semibold">{selectedInvoice.customerName}</span>
            </div>
            <div style={{ marginBottom: ".35rem" }}>
              <span style={{ color: "#555" }}>Appointment ID:</span>{" "}
              <span className="font-semibold">
                {selectedInvoice.appointmentId || selectedInvoice.appointment_id}
              </span>
            </div>
            <div style={{ marginBottom: ".35rem" }}>
              <span style={{ color: "#555" }}>Amount:</span>{" "}
              <span className="amount">
                {formatNumberWithDot(selectedInvoice.amount || 0)} VNĐ
              </span>
            </div>
            {/* Payment proof image or link */}
            <div style={{ marginBottom: ".35rem" }}>
              <span className="block font-medium mb-1">Payment Proof:</span>
              {selectedInvoice.paymentProof && selectedInvoice.paymentProof.startsWith("http") ? (
                <a
                  href={selectedInvoice.paymentProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {selectedInvoice.paymentProof}
                </a>
              ) : (
                selectedInvoice.paymentProof && (
                  <img
                    src={selectedInvoice.paymentProof}
                    alt="Payment Proof"
                    className="invoice-modal-proof-img"
                  />
                )
              )}
            </div>
            {/* Paid Items */}
            {paidItems.length > 0 && (
              <div>
                <span className="block font-medium mb-1">Paid Items:</span>
                <ul className="invoice-modal-list">
                  {paidItems.map((item, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">{item.testName || item.packageName || "Item"}</span>
                      {item.price && (
                        <span className="amount"> ({formatNumberWithDot(item.price)} VNĐ)</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div style={{ marginBottom: ".35rem" }}>
              <span style={{ color: "#555" }}>Paid:</span>{" "}
              <span className={selectedInvoice.paid ? "paid-yes" : "paid-no"}>
                {selectedInvoice.paid ? "Yes" : "No"}
              </span>
            </div>
            <div style={{ marginBottom: ".5rem" }}>
              <span style={{ color: "#555" }}>Created At:</span>{" "}
              <span className="font-medium">
                {selectedInvoice.createdAt || selectedInvoice.created_at
                  ? new Date(
                      selectedInvoice.createdAt || selectedInvoice.created_at
                    ).toLocaleString("vi-VN")
                  : "-"}
              </span>
            </div>
            <div className="invoice-modal-btn-row">
              <button
                onClick={closeModal}
                className="invoice-modal-btn close"
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
