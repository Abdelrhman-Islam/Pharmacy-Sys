import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../layouts/admin/Sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* زرار الموبايل */}
            <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>

            <aside className={`sidebar ${isOpen ? 'open' : ''}`} dir="rtl">
                <div className="sidebar-header">
                    <div className="logo-box">
                        <i className="fas fa-pills"></i>
                    </div>
                    <span className="brand-name">صيدليتي</span>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <i className="fas fa-th-large"></i>
                        <span>لوحة التحكم</span>
                    </NavLink>

                    <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <i className="fa-solid fa-cart-shopping"></i>
                        <span>الطلبات</span>
                    </NavLink>
                   
                    <NavLink to="/admin/customers" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <i className="fas fa-users"></i>
                        <span>العملاء</span>
                    </NavLink>
                     <NavLink to="/admin/products" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <i className="fas fa-box"></i>
                        <span>المنتجات</span>
                    </NavLink>
                    <NavLink to="/admin/add-product" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <i className="fa-solid fa-square-plus"></i>
                        <span>اضافة منتجات</span>
                    </NavLink>
                    <NavLink to="/admin/innt" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                       <i className="fa-regular fa-file-lines"></i>
                        <span>روشته</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={() => { localStorage.clear(); window.location.href='/login'; }}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>
            {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
        </>
    );
};

export default Sidebar;