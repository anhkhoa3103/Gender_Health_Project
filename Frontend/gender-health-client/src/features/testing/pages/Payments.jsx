// Payments.jsx (only redirect, does not create anything in DB)
import React, { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { AuthContext } from "../../../context/AuthContext";
import "../styles/Payments.css";

export default function Payments() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const selectedTestTypes = location.state?.selectedTestTypes || [];
  const customerId = user?.id;
  const total = selectedTestTypes.reduce((sum, item) => sum + (item.price || 0), 0);
  const testIds = selectedTestTypes.map(item => item.testId);

  useEffect(() => {
    const goVnpay = async () => {
      if (!customerId || !selectedTestTypes.length) {
        alert("Missing info");
        navigate("/package");
        return;
      }
      // Pass all info as JSON to BE for inclusion in vnp_OrderInfo
      const res = await api.post("/api/invoice/vnpay-create", {
        amount: total,
        customerId,
         paidItems: JSON.stringify(selectedTestTypes)
      });
      window.location.href = res.data.paymentUrl;
    };
    goVnpay();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-title">Đang chuyển hướng tới VNPay...</h2>
      </div>
    </div>
  );
}
