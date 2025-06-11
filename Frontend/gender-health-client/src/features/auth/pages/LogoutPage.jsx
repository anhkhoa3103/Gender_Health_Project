import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Xóa token và các thông tin đăng nhập
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Chuyển hướng về trang login (hoặc home)
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <h2>Đang đăng xuất...</h2>
      <p>Bạn sẽ được chuyển về trang đăng nhập ngay.</p>
    </div>
  );
};

export default LogoutPage;
