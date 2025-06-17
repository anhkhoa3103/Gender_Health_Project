import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/Sidebar.css'; 

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Users', path: '/admin/users', icon: '👥' },
    { label: 'Service', path: '/admin/services', icon: '🛠' },
    { label: 'Consultant', path: '/admin/consultants', icon: '💬' },
    { label: 'Staff', path: '/admin/staffs', icon: '👨‍💼' },
    { label: 'Feedback', path: '/admin/feedbacks', icon: '📢' },
    { label: 'Financial Report', path: '/admin/reports', icon: '📈' },
  ];

  return (
    <div className="sidebar_management">
      <h2 className="logo_management">
        Admin <span className="highlight_management">Controller</span>
      </h2>
      <ul className="menu_management">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`menu-item_management ${
              location.pathname === item.path ? 'active_management' : ''
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className="icon_management">{item.icon}</span> {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
