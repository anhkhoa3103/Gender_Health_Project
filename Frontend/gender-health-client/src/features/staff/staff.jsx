import { useEffect, useState, useContext } from "react";
import { getInvoicesAxios, updateInvoicePaidStatus } from "../../api/invoice";
import { formatNumberWithDot } from "../testing/helper/helper";
import "./styles/staffInvoices.css";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../components/sidebar";

function Toast({ open, message, onClose }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#323232",
        color: "#fff",
        padding: "12px 28px",
        borderRadius: 8,
        zIndex: 9999,
        fontSize: 17,
        minWidth: 220,
        textAlign: "center",
        boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
        cursor: "pointer"
      }}
      onClick={onClose}
    >
      {message}
    </div>
  );
}

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [search, setSearch] = useState("");

  const { user } = useContext(AuthContext);

  function openModal(invoice) {
    setSelectedInvoice(invoice);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setSelectedInvoice(null);
  }

  const getInvoices = async () => {
    setLoading(true);
    try {
      const { data } = await getInvoicesAxios();
      setInvoices(data);
    } catch (error) {
      setToastMsg("Failed to load invoices.");
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 2200);
    }
    setLoading(false);
  };

  useEffect(() => {
    getInvoices();
    // eslint-disable-next-line
  }, []);

  // Search all fields
  const filteredInvoices = invoices.filter(inv => {
    if (!search) return true;
    const s = search.toLowerCase();
    const fields = [
      inv.id, inv.invoice_id,
      inv.customerName, inv.customer_name,
      inv.customerPhone, inv.customer_phone,
      inv.appointmentId, inv.appointment_id,
      inv.amount,
      inv.paid ? "yes" : "no",
      inv.createdAt, inv.created_at
    ]
      .map(v => (v === undefined || v === null ? "" : String(v).toLowerCase()))
      .join(" ");
    return fields.includes(s);
  });

  // --------- PARSE PAID ITEMS ---------
  let paidItems = [];
  try {
    if (selectedInvoice && selectedInvoice.paidItems) {
      if (Array.isArray(selectedInvoice.paidItems)) {
        paidItems = selectedInvoice.paidItems;
      } else if (typeof selectedInvoice.paidItems === "string") {
        const parsed = JSON.parse(selectedInvoice.paidItems);
        if (Array.isArray(parsed)) paidItems = parsed;
        else if (typeof parsed === "object") paidItems = [parsed];
      } else if (typeof selectedInvoice.paidItems === "object") {
        paidItems = [selectedInvoice.paidItems];
      }
    }
  } catch (e) {
    paidItems = [];
  }

  // Mark as Paid Handler (with toast)
  const handleMarkAsPaid = async () => {
    if (!selectedInvoice) return;
    try {
      await updateInvoicePaidStatus(selectedInvoice.id || selectedInvoice.invoice_id, true);
      setToastMsg("Invoice marked as paid!");
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 2200);
      await getInvoices();
      closeModal();
    } catch (err) {
      setToastMsg("Failed to update status.");
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 2200);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="invoice-container_staffinvoices">
        <h1 className="invoice-title_staffinvoices">Invoices</h1>

        {/* Single Search Bar */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search …"
            className="search-input_staffinvoices"
            style={{
              padding: "8px 15px",
              borderRadius: 7,
              border: "1px solid #e3e5ea",
              fontSize: 16,
              width: 350,
              marginLeft: 2,
              marginBottom: 8,
            }}
          />
        </div>

        {/* LOADING SPINNER */}
        {loading ? (
          <div>
            <span className="staffinvoices-spinner" />
            <div style={{ textAlign: "center", marginTop: 14, color: "#888" }}>Loading invoices...</div>
          </div>
        ) : (
        <div className="invoice-table-wrapper_staffinvoices">
          <table className="invoice-table_staffinvoices">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Appointment ID</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id || inv.invoice_id}>
                    <td>{inv.id || inv.invoice_id}</td>
                    <td>{inv.customerName || "-"}</td>
                    <td>{inv.customerPhone || inv.customer_phone || "-"}</td>
                    <td>{inv.appointmentId || inv.appointment_id || "-"}</td>
                    <td className="amount_staffinvoices">
                      {formatNumberWithDot(inv.amount || 0)} VNĐ
                    </td>
                    <td>
                      <span className={inv.paid ? "paid-yes_staffinvoices" : "paid-no_staffinvoices"}>
                        {inv.paid ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      {inv.createdAt || inv.created_at
                        ? new Date(inv.createdAt || inv.created_at).toLocaleString("vi-VN")
                        : "-"}
                    </td>
                    <td>
                      <button
                        onClick={() => openModal(inv)}
                        className="view-btn_staffinvoices"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="no-invoices_staffinvoices">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}

        {modalIsOpen && selectedInvoice && (
          <div className="invoice-modal-bg_staffinvoices">
            <div className="invoice-modal-card_staffinvoices">
              <h2 className="invoice-modal-title_staffinvoices">
                Invoice #{selectedInvoice.id || selectedInvoice.invoice_id}
              </h2>
              <div className="invoice-modal-field_staffinvoices">
                <strong>Customer Name:</strong> {selectedInvoice.customerName}
              </div>
              <div className="invoice-modal-field_staffinvoices">
                <strong>Phone:</strong> {selectedInvoice.customerPhone || selectedInvoice.customer_phone || "-"}
              </div>
              <div className="invoice-modal-field_staffinvoices">
                <strong>Appointment ID:</strong>{" "}
                {selectedInvoice.appointmentId || selectedInvoice.appointment_id}
              </div>
              <div className="invoice-modal-field_staffinvoices">
                <strong>Amount:</strong>{" "}
                <span className="amount_staffinvoices">
                  {formatNumberWithDot(selectedInvoice.amount || 0)} VNĐ
                </span>
              </div>
              <div className="invoice-modal-field_staffinvoices">
                <strong>Paid:</strong>{" "}
                <span className={selectedInvoice.paid ? "paid-yes_staffinvoices" : "paid-no_staffinvoices"}>
                  {selectedInvoice.paid ? "Yes" : "No"}
                </span>
              </div>
              <div className="invoice-modal-field_staffinvoices">
                <strong>Created At:</strong>{" "}
                {selectedInvoice.createdAt || selectedInvoice.created_at
                  ? new Date(selectedInvoice.createdAt || selectedInvoice.created_at).toLocaleString("vi-VN")
                  : "-"}
              </div>
              {selectedInvoice.paymentProof && (
                <div className="invoice-modal-field_staffinvoices">
                  <strong>Payment Proof:</strong>
                  {selectedInvoice.paymentProof.startsWith("data:image") ? (
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
                          className="invoice-modal-proof-img_staffinvoices"
                        />
                      </a>
                      <div>
                        <button
                          className="invoice-modal-download_staffinvoices"
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
                  ) : selectedInvoice.paymentProof.startsWith("http") ? (
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
              )}
              {paidItems.length > 0 && (
                <div className="invoice-modal-field_staffinvoices">
                  <strong>Paid Items:</strong>
                  <ul className="invoice-modal-list_staffinvoices">
                    {paidItems.map((item, idx) => (
                      <li key={idx}>
                        {item.testName || item.packageName || "Item"}{" "}
                        {item.price && (
                          <span className="amount_staffinvoices">
                            ({formatNumberWithDot(item.price)} VNĐ)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="invoice-modal-btn-row_staffinvoices">
                {!selectedInvoice.paid && (
                  <button
                    onClick={handleMarkAsPaid}
                    className="invoice-modal-btn_staffinvoices paid"
                    style={{ background: "#22c55e", color: "#fff", marginRight: 10 }}
                  >
                    Mark as Paid
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="invoice-modal-btn_staffinvoices close"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <Toast open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
      </div>
    </>
  );
}
