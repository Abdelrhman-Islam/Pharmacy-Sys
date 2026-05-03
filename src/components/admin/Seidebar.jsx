import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../layouts/admin/Sidebar.css';

const Sidebar = ({ isOpen, setIsOpen }) => {

    const navItems = [
        { path: '/admin', label: 'لوحة التحكم', icon: 'fas fa-th-large' },
        { path: '/admin/orders', label: 'الطلبات', icon: 'fas fa-shopping-cart' },
        { path: '/admin/clients', label: 'العملاء', icon: 'fas fa-users' },
        { path: '/admin/products', label: 'المنتجات', icon: 'fas fa-box' },
        { path: '/admin/add-product', label: 'إضافة منتجات', icon: 'fas fa-plus' },
    ];
    return (
        <>
            {/* Mobile toggle */}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`} dir="rtl">
                <div className="sidebar-header">
                    <div className="logo-box"><i className="fas fa-pills"></i></div>
                    <span className="brand-name">صيدليتي</span>
                </div>

                <nav className="sidebar-nav">
                    
                    {navItems.map((item) => (
                        <NavLink 
                            key={item.path} 
                            to={item.path}

                            onClick={() => setIsOpen(false)} 

                            className={({ isActive }) => `nav-link ${isActive ? "nav-item active" : "nav-item"}`}
                        >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}

                </nav>


                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={() => { localStorage.clear(); window.location.href='/login'; }}>
                        <i className="fas fa-sign-out-alt"></i> <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>
            {/* الزرار بتاع القفل والفتح اللي بيظهر في الموبايل */}
            {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
        </>
    );
};

export default Sidebar;