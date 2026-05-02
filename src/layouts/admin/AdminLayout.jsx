// AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Seidebar'; // المسار بتاعك
import '../../layouts/admin/Sidebar.css'; // الـ CSS الأصلي عشان يطبق الـ Layout

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="admin-page-container">
            
            {/* الزرار (التعديل اللي فوق) */}
            <button 
                className="mobile-menu-btn" 
                onClick={(e) => {
                    e.stopPropagation(); // عشان الكليك ما يوصلش للـ Overlay
                    setSidebarOpen(!sidebarOpen);
                }}
                style={{ zIndex: 10000 }} // التأكيد النهائي من الـ JSX
            >
                <i className="fas fa-bars"></i>
            </button>

            {/* الـ Overlay (بيظهر لما السايد بار يكون مفتوح) */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
            )}

            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <main className="admin-main-wrapper">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;