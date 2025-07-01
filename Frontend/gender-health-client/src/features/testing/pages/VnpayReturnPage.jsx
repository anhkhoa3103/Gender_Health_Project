import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../api/axios";

export default function VnpayReturnPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const confirmVnpay = async () => {
      try {
        const search = location.search || "";
        const res = await api.post(`/api/invoice/vnpay-return${search}`);
        setResult(res.data);
      } catch (e) {
        setResult({ success: false, message: "Có lỗi xác nhận thanh toán" });
      }
    };
    confirmVnpay();
    // eslint-disable-next-line
  }, []);

  // Redirect after 3s depending on result
  useEffect(() => {
    if (result) {
      const timeout = setTimeout(() => {
        if (result.success) {
          navigate("/payment-success");
        } else {
          navigate("/package");
        }
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [result, navigate]);

  if (!result) return <div>Đang xác nhận giao dịch VNPay...</div>;
  return (
    <div>
      {result.success ? (
        <div style={{ color: "green", fontWeight: 600 }}>
          Thanh toán thành công! Đơn của bạn đã được ghi nhận.
          <br />
          <span style={{ fontWeight: 400, fontSize: 14 }}>
            Đang chuyển hướng...
          </span>
        </div>
      ) : (
        <div style={{ color: "red", fontWeight: 600 }}>
          Thanh toán thất bại: {result.message || "Giao dịch không hợp lệ."}
          <br />
          <span style={{ fontWeight: 400, fontSize: 14 }}>
            Đang chuyển hướng về trang chọn gói...
          </span>
        </div>
      )}
    </div>
  );
}