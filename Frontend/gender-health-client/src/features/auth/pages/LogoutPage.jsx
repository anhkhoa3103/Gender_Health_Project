import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        // Gọi API logout (nếu backend có hỗ trợ)
        await axios.post(
          "http://localhost:8080/api/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (err) {
        // Có thể lỗi nhưng vẫn tiếp tục
        console.error("Logout API error", err);
      }

      // Xóa localStorage token và userId
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      // Chuyển hướng về login
      navigate("/login", { replace: true });
    };

    logout();
  }, [navigate]);

  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <h2>Đang đăng xuất...</h2>
      <p>Bạn sẽ được chuyển về trang đăng nhập ngay.</p>
    </div>
  );
};

export default LogoutPage;
