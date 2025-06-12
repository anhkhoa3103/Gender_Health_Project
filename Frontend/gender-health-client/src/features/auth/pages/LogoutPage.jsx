import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

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
