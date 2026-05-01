import React, { useState } from 'react';
import Sidebar from '../../components/admin/Seidebar'; // تأكد من المسار
import StatsCard from '../../components/admin/DashboardStats';
import LatestUsers from '../../components/admin/LatestUsers';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="admin-page-container">
            {/* زرار الموبايل */}
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
                <i className="fas fa-bars"></i>
            </button>

            {/* السايدبار بنبعت له الحالة عشان يفتح ويقفل في الموبايل */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            {/* الجزء اللي فيه الشغل كله */}
            <main className="admin-main-wrapper">
                
                <div className="stats-grid">
                     <StatsCard/>
                     <LatestUsers/>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;