import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { FaVial, FaStethoscope } from "react-icons/fa";
import Header from "../../components/Header";
import "../styles/InvoicesHistory.css";

export default function InvoicesHistory() {
  const { user } = useContext(AuthContext);
  const [stiInvoices, setStiInvoices] = useState([]);
  const [consultationInvoices, setConsultationInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state for details
  const [showModal, setShowModal] = useState(false);
  const [modalInvoice, setModalInvoice] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    const fetchInvoices = async () => {
      try {
        const stiRes = await axios.get(`http://localhost:8080/api/invoice/customer/${user.id}`);
        setStiInvoices(stiRes.data || []);
        const consultRes = await axios.get(`http://localhost:8080/api/consultation-invoices/customer/${user.id}`);
        setConsultationInvoices(consultRes.data || []);
      } catch (err) {
        console.error("Lỗi khi tải hóa đơn:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [user]);

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    return timeStr.replace("T", " ").slice(0, 19);
  };

  // Only show paid
  const paidStiInvoices = stiInvoices.filter((item) => item.paymentResponseCode === "00");
  const paidConsultationInvoices = consultationInvoices.filter((item) => item.paymentResponseCode === "00");

  // For STI card only, add View Details button
  const renderCard = (item, type) => {
    const icon = type === "sti"
      ? <FaVial className="invoice-icon_invoiceshistory" />
      : <FaStethoscope className="invoice-icon_invoiceshistory" />;
    const title = type === "sti" ? "Xét nghiệm" : "Tư vấn sức khỏe";
    const time = type === "sti" ? (item.paymentTime || item.createdAt) : item.paymentTime;

    return (
      <div key={item.id} className="invoice-card_invoiceshistory">
        <div className="invoice-card-header_invoiceshistory">
          {icon}
          <div className="invoice-title_invoiceshistory">{title}</div>
          <div className="invoice-time_invoiceshistory">{formatTime(time)}</div>
        </div>
        <div className="invoice-card-body_invoiceshistory">
          <div className="invoice-desc_invoiceshistory">Mã giao dịch: {item.paymentTxnRef || "-"}</div>
          <div className="invoice-status_invoiceshistory">Đã thanh toán</div>
          <div className="invoice-amount_invoiceshistory">-{item.amount?.toLocaleString()}đ</div>
          {type === "sti" && (
            <button
              className="modal-btn"
              onClick={() => {
                setModalInvoice(item);
                setShowModal(true);
              }}
            >Xem chi tiết</button>
          )}
        </div>
      </div>
    );
  };

  // Modal for details
  const renderModal = () => {
    if (!modalInvoice) return null;
    let paidItems = [];
    try {
      paidItems = typeof modalInvoice.paidItems === "string"
        ? JSON.parse(modalInvoice.paidItems)
        : modalInvoice.paidItems || [];
    } catch {
      paidItems = [];
    }
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3 className="modal-title">Chi tiết hóa đơn</h3>
          <div><b>Mã giao dịch:</b> {modalInvoice.paymentTxnRef || "-"}</div>
          <div><b>Ngày thanh toán:</b> {formatTime(modalInvoice.paymentTime || modalInvoice.createdAt)}</div>
          <div><b>Số tiền:</b> {modalInvoice.amount?.toLocaleString()}đ</div>
          <div className="modal-paiditem-label">Danh sách xét nghiệm đã thanh toán:</div>
          {Array.isArray(paidItems) && paidItems.length > 0 ? (
            <ul className="modal-paiditems">
              {paidItems.map((it, idx) => (
                <li key={idx}>
                  {it.testName || it.name || `Test ${it.testId}`}{it.price ? ` - ${it.price.toLocaleString()}đ` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <div className="modal-nodata">Không có dữ liệu.</div>
          )}
          <div >
            <button
              className="modal-btn"
              onClick={() => setShowModal(false)}
            >Đóng</button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading_invoiceshistory">Đang tải dữ liệu...</div>;

  return (
    <div
      className="invoices-history-wrapper_invoiceshistory"
      style={{ marginTop: 110 }}
    >
      <Header />
      <h2>Lịch sử thanh toán</h2>
      <div className="section-header sti">Hóa đơn Xét nghiệm</div>
      <div className="invoice-list_invoiceshistory">
        {paidStiInvoices.length === 0 ? (
          <div className="invoice-empty">Không có hóa đơn.</div>
        ) : (
          paidStiInvoices.map((item) => renderCard(item, "sti"))
        )}
      </div>
      <div className="section-header consultation">Hóa đơn Tư vấn sức khỏe</div>
      <div className="invoice-list_invoiceshistory">
        {paidConsultationInvoices.length === 0 ? (
          <div className="invoice-empty">Không có hóa đơn.</div>
        ) : (
          paidConsultationInvoices.map((item) => renderCard(item, "consultation"))
        )}
      </div>
      {showModal && renderModal()}
    </div>
  );
}