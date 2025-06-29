import { useEffect, useState, useContext } from "react";
import { getInvoicesAxios } from "../../api/invoice";
import { formatNumberWithDot } from "../testing/helper/helper";
import { useNavigate } from "react-router-dom";
import "./styles/staffInvoices.css";
import { AuthContext } from "../../context/AuthContext"; // Add this
import Sidebar from "../components/sidebar"

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
    <>
      <Sidebar />
      <div className="invoice-container_staffinvoices">
        <h1 className="invoice-title_staffinvoices">Invoices</h1>
        <div className="invoice-table-wrapper_staffinvoices">
          <table className="invoice-table_staffinvoices">
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
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id || inv.invoice_id}>
                    <td>{inv.id || inv.invoice_id}</td>
                    <td>{inv.customerName || "-"}</td>
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
                  <td colSpan={7} className="no-invoices_staffinvoices">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
                  {selectedInvoice.paymentProof.startsWith("http") ? (
                    <a
                      href={selectedInvoice.paymentProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proof-link_staffinvoices"
                    >
                      View Proof
                    </a>
                  ) : (
                    <img
                      src={selectedInvoice.paymentProof}
                      alt="Payment Proof"
                      className="invoice-modal-proof-img_staffinvoices"
                    />
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
      </div>
    </>
  );
}
