import { useEffect, useState, useContext } from "react";
import { getInvoicesAxios } from "../../../api/invoice";
import { formatNumberWithDot } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import "../styles/CustomerInvoicesHistory.css";
import { AuthContext } from "../../../context/AuthContext";
import Header from '../../components/Header';

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    getInvoicesAxios()
      .then(({ data }) => setInvoices(data))
      .catch(console.error);
  }, []);

  const openModal = (invoice) => {
    setSelectedInvoice(invoice);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedInvoice(null);
  };

  const filteredInvoices = user?.id
    ? invoices.filter(inv =>
        String(inv.customerId) === String(user.id) ||
        String(inv.customer_id) === String(user.id)
      )
    : [];

  let paidItems = [];
  try {
    if (selectedInvoice?.paidItems) {
      const raw = selectedInvoice.paidItems;
      if (Array.isArray(raw)) paidItems = raw;
      else if (typeof raw === "string") {
        const parsed = JSON.parse(raw);
        paidItems = Array.isArray(parsed) ? parsed : [parsed];
      } else if (typeof raw === "object") {
        paidItems = [raw];
      }
    }
  } catch (e) {
    paidItems = [];
  }

  return (
    <>
      <div className="header_customerinvoiceshistory">
        <Header />
      </div>
      <div className="container_customerinvoiceshistory">
        <h1 className="title_customerinvoiceshistory">My Invoices</h1>
        <div className="table-wrapper_customerinvoiceshistory">
          <table className="table_customerinvoiceshistory">
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
                    <td className="amount_customerinvoiceshistory">
                      {formatNumberWithDot(inv.amount || 0)} VNĐ
                    </td>
                    <td>
                      <span className={inv.paid ? "paid-yes_customerinvoiceshistory" : "paid-no_customerinvoiceshistory"}>
                        {inv.paid ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      {(inv.createdAt || inv.created_at)
                        ? new Date(inv.createdAt || inv.created_at).toLocaleString("vi-VN")
                        : "-"}
                    </td>
                    <td>
                      <button
                        onClick={() => openModal(inv)}
                        className="view-btn_customerinvoiceshistory"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="no-data_customerinvoiceshistory">No invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {modalIsOpen && selectedInvoice && (
          <div className="modal-bg_customerinvoiceshistory">
            <div className="modal-card_customerinvoiceshistory">
              <h2 className="modal-title_customerinvoiceshistory">
                Invoice #{selectedInvoice.id || selectedInvoice.invoice_id}
              </h2>

              <div className="modal-field_customerinvoiceshistory"><strong>Customer Name:</strong> {selectedInvoice.customerName}</div>
              <div className="modal-field_customerinvoiceshistory"><strong>Appointment ID:</strong> {selectedInvoice.appointmentId || selectedInvoice.appointment_id}</div>
              <div className="modal-field_customerinvoiceshistory"><strong>Amount:</strong> {formatNumberWithDot(selectedInvoice.amount || 0)} VNĐ</div>

              {selectedInvoice.paymentProof && (
                <div className="modal-field_customerinvoiceshistory">
                  <strong>Payment Proof:</strong><br />
                  {selectedInvoice.paymentProof.startsWith("http") ? (
                    <a href={selectedInvoice.paymentProof} target="_blank" rel="noreferrer" className="proof-link_customerinvoiceshistory">
                      {selectedInvoice.paymentProof}
                    </a>
                  ) : (
                    <img
                      src={selectedInvoice.paymentProof}
                      alt="Payment Proof"
                      className="proof-img_customerinvoiceshistory"
                    />
                  )}
                </div>
              )}

              {paidItems.length > 0 && (
                <div className="modal-field_customerinvoiceshistory">
                  <strong>Paid Items:</strong>
                  <ul className="paid-items_customerinvoiceshistory">
                    {paidItems.map((item, idx) => (
                      <li key={idx}>
                        {item.testName || item.packageName || "Item"}{" "}
                        {item.price && `- ${formatNumberWithDot(item.price)} VNĐ`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="modal-field_customerinvoiceshistory"><strong>Paid:</strong> <span className={selectedInvoice.paid ? "paid-yes_customerinvoiceshistory" : "paid-no_customerinvoiceshistory"}>{selectedInvoice.paid ? "Yes" : "No"}</span></div>
              <div className="modal-field_customerinvoiceshistory"><strong>Created At:</strong> {new Date(selectedInvoice.createdAt || selectedInvoice.created_at).toLocaleString("vi-VN")}</div>

              <div className="modal-actions_customerinvoiceshistory">
                <button onClick={closeModal} className="btn-close_customerinvoiceshistory">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
