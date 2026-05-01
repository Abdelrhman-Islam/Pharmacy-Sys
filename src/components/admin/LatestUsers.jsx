import React, { useEffect, useState } from 'react';
import { adminService } from '../../api/adminService';
import '../../layouts/admin/LatestUsers.css'

const LatestUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await adminService.getLatestUsers();
                setUsers(res.data); // بفرض إن الداتا راجعة في array
            } catch (err) {
                console.error("خطأ في جلب العملاء", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <p>جاري التحميل...</p>;

    return (
        <div className="dashboard-card">
            <div className="card-header">
                <h3>أحدث 10 عملاء مسجلين</h3>
                <button className="btn-view-all">عرض الكل</button>
            </div>
            
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>العميل</th>
                            <th>البريد الإلكتروني</th>
                            <th>تاريخ التسجيل</th>
                            <th>الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                {/* ... باقي الأعمده ... */}
                                <td>{user.name}</td>
                                <td>
                                    {user.email}
                                </td>
                                <td>
                                    {user.created_at 
                                        ? new Date(user.created_at).toLocaleDateString('ar-EG') 
                                        : 'غير مسجل'}
                                </td>
                                <td><span className="status-badge active">نشط</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LatestUsers;