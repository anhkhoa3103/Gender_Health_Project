import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("managementRole")?.toUpperCase(); // "ADMIN", "STAFF", "CONSULTANT"

  // Menu cho từng vai trò
  const menuByRole = {
    ADMIN: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
      { label: 'Users', path: '/admin/users', icon: '👥' },
      { label: 'Service', path: '/admin/services', icon: '🛠' },
      { label: 'Consultant', path: '/admin/consultants', icon: '💬' },
      { label: 'Staff', path: '/admin/staffs', icon: '👨‍💼' },
      { label: 'Feedback', path: '/admin/feedbacks', icon: '📢' },
      { label: 'Reports', path: '/admin/reports', icon: '📈' },
    ],
    STAFF: [
      { label: 'Dashboard', path: '/staff/dashboard', icon: '📊' },
      { label: 'Appointments', path: '/staff/appointments', icon: '📅' },
      { label: 'Results', path: '/staff/samples', icon: '🧪' },
      { label: 'Invoices', path: '/staff/results', icon: '📄' },
    ],
    CONSULTANT: [
      { label: 'Dashboard', path: '/consultant/dashboard', icon: '📊' },
      { label: 'Information', path: '/consultant/info', icon: '📅' },
      { label: 'Appointments', path: '/consultant/appointments', icon: '📆' },
      { label: 'Working Slot', path: '/consultant/workslots', icon: '🕒' },
      { label: 'Result', path: '/consultant/results', icon: '📄' },
      { label: 'Feedback', path: '/consultant/feedback', icon: '📢' },
      { label: 'Financial Report', path: '/consultant/reports', icon: '📈' },
    ],
  };

  const menuItems = menuByRole[role] || [];

  return (
    <div className="sidebar_management">
      <h2 className="logo_management">
        {role} <span className="highlight_management">Panel</span>
      </h2>
      <ul className="menu_management">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`menu-item_management ${location.pathname === item.path ? 'active_management' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="icon_management">{item.icon}</span> {item.label}
          </li>
        ))}
      </ul>
      <button className='logout-button_management' onClick={() => window.location.href = "/logoutmanagement"}>
        Đăng xuất
      </button>
    </div>
  );
};

export default Sidebar;
