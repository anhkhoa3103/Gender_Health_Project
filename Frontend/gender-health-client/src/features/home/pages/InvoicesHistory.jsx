import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaVial, FaStethoscope } from "react-icons/fa";
import "../styles/InvoicesHistory.css";

const InvoicesHistory = () => {
  const [stiInvoices, setStiInvoices] = useState([]);
  const [consultationInvoices, setConsultationInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const [stiRes, consultRes] = await Promise.all([
          axios.get("http://localhost:8080/api/invoice"),
          axios.get("http://localhost:8080/api/consultation-invoices"),
        ]);
        setStiInvoices(stiRes.data);
        setConsultationInvoices(consultRes.data);
      } catch (err) {
        console.error("Lỗi khi tải hóa đơn:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    return timeStr.replace("T", " ").slice(0, 19);
  };

  const renderCard = (item, type) => {
    const isSTI = type === "sti";
    const icon = isSTI ? <FaVial className="invoice-icon_invoiceshistory" /> : <FaStethoscope className="invoice-icon_invoiceshistory" />;
    const title = isSTI ? "Xét nghiệm STI" : "Tư vấn sức khỏe";
    const time = isSTI ? item.paymentTime || item.createdAt : item.paymentTime;
    const paid = isSTI ? item.paid : true;

    return (
      <div key={`${type}-${item.id}`} className="invoice-card_invoiceshistory">
        <div className="invoice-card-header_invoiceshistory">
          {icon}
          <div className="invoice-title_invoiceshistory">{title}</div>
          <div className="invoice-time_invoiceshistory">{formatTime(time)}</div>
        </div>
        <div className="invoice-card-body_invoiceshistory">
          <div className="invoice-desc_invoiceshistory">Mã giao dịch: {item.paymentTxnRef || "-"}</div>
          <div className="invoice-status_invoiceshistory">{paid ? "✅ Đã thanh toán" : "❌ Chưa thanh toán"}</div>
          <div className="invoice-amount_invoiceshistory">-{item.amount?.toLocaleString()}đ</div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading_invoiceshistory">Đang tải dữ liệu...</div>;

  return (
    <div className="invoices-history-wrapper_invoiceshistory">
      <h2>Lịch sử thanh toán</h2>
      <div className="invoice-list_invoiceshistory">
        {[...stiInvoices.map((i) => renderCard(i, "sti")), ...consultationInvoices.map((i) => renderCard(i, "consultation"))]
          .sort((a, b) => (a?.key > b?.key ? -1 : 1))}
      </div>
    </div>
  );
};

export default InvoicesHistory;
