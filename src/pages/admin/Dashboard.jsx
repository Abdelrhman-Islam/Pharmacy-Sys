import React, { useState } from 'react';
import StatsCard from '../../components/admin/DashboardStats';
import LatestOrders from '../../components/admin/LatestOrders';
const Dashboard = () => {

    return (
        <div className="dashboard-container">
            {/* المحتوى الرئيسي للمنطقة دي */}
            <main className="main-content-area">
                
                {/* هنا فصلنا الـ Stats لوحدها عشان تاخد ستايل مستقل */}
                <div className="stats-grid-wrapper">
                     <StatsCard/>
                     <LatestOrders/>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;