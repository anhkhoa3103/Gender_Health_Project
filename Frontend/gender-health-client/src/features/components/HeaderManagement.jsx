import React from 'react';
import './styles/HeaderManagement.css';

const Header = () => {
  return (
    <div className="header_management">
      <input
        type="text"
        className="search_management"
        placeholder="Quick search"
      />
      <div className="notification_management">🔔</div>
    </div>
  );
};

export default Header;
