import React, { useState } from 'react';
import Sidebar from '../../components/admin/Seidebar'; // Ensure path is correct
import StatsCard from '../../components/admin/DashboardStats';
import LatestUsers from '../../components/admin/LatestUsers';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="admin-page-container">
            {/* Mobile button */}
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
                <i className="fas fa-bars"></i>
            </button>

            {/* Pass state to handle sidebar toggle on mobile */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            {/* Main content area */}
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