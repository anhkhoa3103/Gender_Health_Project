import React from 'react';
import Sidebar from '../components/sidebar.jsx';
import Header from '../components/HeaderManagement.jsx';
import './styles/AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="container_admindashboard">
      <Sidebar />
      <div className="main_admindashboard">
        <Header />
        <div className="content_admindashboard">
          <div className="card-group_admindashboard">
            <div className="card_admindashboard">Company Facts</div>
            <div className="card_admindashboard">Statistics</div>
          </div>
          <div className="card-group_admindashboard">
            <div className="card_admindashboard">Assigned Risks</div>
            <div className="card_admindashboard">Assigned Action Items</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
