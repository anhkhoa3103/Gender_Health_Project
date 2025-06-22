import { useEffect, useState } from "react";
import {
  getInvoicesAxios,
  updateInvoicePaidStatus,
} from "../../../api/invoice";
import { formatNumberWithDot } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import "../styles/Invoices.css"; // <== import your CSS file!

export default function InvoiceListStaff() {
  // ... (rest of your code is the same, just replace className below)
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
            {invoices && invoices.length > 0 ? (
              invoices.map((inv, idx) => (
                <tr key={inv.id || inv.invoice_id}>
                  <td>{inv.id || inv.invoice_id}</td>
                  <td>{inv.customerName || "-"}</td>
                  <td>{inv.appointmentId || inv.appointment_id || "-"}</td>
                  <td className="amount">
                    {formatNumberWithDot(inv.amount || 0)} VNĐ
                  </td>
                  <td>
                    {inv.paid ? (
                      <span className="paid-yes">Yes</span>
                    ) : (
                      <span className="paid-no">No</span>
                    )}
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
            <div>Customer Name: <span style={{ fontWeight: 600 }}>{selectedInvoice.customerName}</span></div>
            <div>Appointment ID: <span style={{ fontWeight: 600 }}>{selectedInvoice.appointmentId || selectedInvoice.appointment_id}</span></div>
            <div>Amount: <span style={{ fontWeight: 600, color: "#2563eb" }}>{formatNumberWithDot(selectedInvoice.amount || 0)} VNĐ</span></div>
            <div style={{ margin: "10px 0" }}>
              <span className="block font-medium mb-1">Payment Proof:</span>
              {selectedInvoice.paymentProof && selectedInvoice.paymentProof.startsWith("data:image") ? (
                <>
                  <a
                    href={selectedInvoice.paymentProof}
                    download={`payment-proof-${selectedInvoice.id || selectedInvoice.invoice_id}.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Click to download or view full image"
                  >
                    <img
                      src={selectedInvoice.paymentProof}
                      alt="Payment Proof"
                      className="invoice-modal-proof-img"
                    />
                  </a>
                  <div>
                    <button
                      className="invoice-modal-download"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = selectedInvoice.paymentProof;
                        link.download = `payment-proof-${selectedInvoice.id || selectedInvoice.invoice_id}.jpg`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Download Image
                    </button>
                  </div>
                </>
              ) : selectedInvoice.paymentProof && selectedInvoice.paymentProof.startsWith("http") ? (
                <a
                  href={selectedInvoice.paymentProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2563eb", textDecoration: "underline", wordBreak: "break-all" }}
                >
                  {selectedInvoice.paymentProof}
                </a>
              ) : (
                <span style={{ fontStyle: "italic", color: "#a0aec0" }}>No payment proof.</span>
              )}
            </div>

            {/* Paid Items */}
            {paidItems.length > 0 && (
              <div>
                <span style={{ fontWeight: 500 }}>Paid Items:</span>
                <ul className="invoice-modal-list">
                  {paidItems.map((item, idx) => (
                    <li key={idx}>
                      <span style={{ fontWeight: 600 }}>{item.testName || item.packageName || "Item"}</span>
                      {item.price && (
                        <span style={{ marginLeft: 8, color: "#2563eb" }}>
                          ({formatNumberWithDot(item.price)} VNĐ)
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>Paid: <span style={{ fontWeight: 600, color: selectedInvoice.paid ? "#15803d" : "#dc2626" }}>{selectedInvoice.paid ? "Yes" : "No"}</span></div>
            <div>Created At: <span style={{ fontWeight: 500 }}>{selectedInvoice.createdAt || selectedInvoice.created_at ? new Date(selectedInvoice.createdAt || selectedInvoice.created_at).toLocaleString("vi-VN") : "-"}</span></div>
            <div className="invoice-modal-btn-row">
              {!selectedInvoice.paid && (
                <button
                  onClick={async () => {
                    try {
                      await updateInvoicePaidStatus(selectedInvoice.id || selectedInvoice.invoice_id, true);
                      await getInvoices();
                      closeModal();
                    } catch (err) {
                      alert("Failed to update status: " + (err?.response?.data?.message || err.message));
                    }
                  }}
                  className="invoice-modal-btn mark-paid"
                >
                  Mark as Paid
                </button>
              )}
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
