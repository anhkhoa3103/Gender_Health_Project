import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/LoginPromptModal.css";

const LoginPromptModal = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Bạn cần đăng nhập để sử dụng dịch vụ này</h3>
        <div className="modal-buttons">
          <button className="btn btn-exit" onClick={onClose}>
            Thoát
          </button>
          <button
            className="btn btn-login"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
