import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../api/config';
import '../../layouts/admin/Dashboardstats.css'; 

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_products: 0, total_users: 0, low_stock: 0 });

  useEffect(() => {
    fetch(`${BASE_URL}api/admin/dashboard_stats.php`, {
      headers: { 'Authorization': localStorage.getItem('token') }
    })
    .then(res => res.json())
    .then(result => {
      if(result.status === 'success') setStats(result.data);
    });
  }, []);

  return (
    <div className="dashboard-container" dir="rtl">
      <h1>لوحة تحكم الصيدلية</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>إجمالي المنتجات</h3>
          <p className="number">{stats.total_products}</p>
        </div>

        <div className="stat-card">
          <h3>عدد العملاء</h3>
          <p className="number">{stats.total_users}</p>
        </div>

        <div className="stat-card warning">
          <h3>نواقص (كمية قليلة)</h3>
          <p className="number">{stats.low_stock}</p>
        </div>
      </div>

      {/* Add recent products or orders table here */}
    </div>
  );
};

export default AdminDashboard;