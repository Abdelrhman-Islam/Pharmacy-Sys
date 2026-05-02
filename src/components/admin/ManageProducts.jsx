import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../api/config';
import '../../layouts/admin/ManageProducts.css'; 

const ManageProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`${BASE_URL}api/admin/get_all_products.php`, {
            headers: { 'Authorization': localStorage.getItem('token') }
        })
        .then(res => res.json())
        .then(res => {
            if(res.status === 'success') setProducts(res.data);
        });
    }, []);

    const deleteProduct = (id) => {
        if(window.confirm('هل أنت متأكد من حذف هذا الدواء؟')) {
            // TODO: Call delete API
            console.log('Deleting product:', id);
        }
    };

    return (
        <div className="manage-container" dir="rtl" style={{padding: '20px'}}>
            <h2>إدارة الأدوية والمخزن</h2>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>الصورة</th>
                        <th>اسم الدواء</th>
                        <th>السعر</th>
                        <th>الكمية</th>
                        <th>العمليات</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td><img src={product.pic} width="50" alt={product.name} /></td>
                            <td>{product.name}</td>
                            <td>{product.price} ج.م</td>
                            <td>{product.qty}</td>
                            <td>
                                <button className="btn-edit">تعديل</button>
                                <button className="btn-delete" onClick={() => deleteProduct(product.id)}>حذف</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageProducts;