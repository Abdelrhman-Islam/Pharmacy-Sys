import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminService } from '../../api/adminService'; // هنا استدعينا السيرفس
import '../../layouts/admin/CustomersPage.css';
import Sidebar from '../../components/admin/Seidebar';

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                // استخدام الـ Service بدل الـ fetch المباشر
                const result = await adminService.getLatestUsers(); 
                
                // بما إن السيرفس بترجع الـ data على طول أو بترمي error
                if (result && result.data) {
                    setCustomers(result.data);
                }
            } catch (error) {
                // الـ error هنا بيجي من الـ throw في الـ service
                toast.error(error.message || "حدث خطأ أثناء جلب العملاء");
            } finally {
                setLoading(false);
            }
        };
        
        fetchCustomers();
    }, []);

    return (
        <>
         {/* Mobile button */}
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
                <i className="fas fa-bars"></i>
            </button>

            {/* Pass state to handle sidebar toggle on mobile */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="admin-page">
            <h2>آخر عملاء مسجلين</h2>
            {loading ? (
                <p>جاري تحميل البيانات...</p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>الاسم</th>
                            <th>البريد الإلكتروني</th>
                            <th>رقم الهاتف</th>
                            <th>تاريخ الانضمام</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length > 0 ? (
                            customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.name}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phone}</td>
                                    <td>{new Date(customer.created_at).toLocaleDateString('ar-EG')}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{textAlign: 'center'}}>لا يوجد عملاء لعرضهم</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
        </>
    );
};

export default CustomersPage;