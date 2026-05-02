import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Seidebar';
import '../../layouts/Forms.css';
import { BASE_URL } from '../../api/config';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    category_id: '',
    price: '',
    qty: '',
    description: '',
    pic: null
  });

  const [categories, setCategories] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // جلب الفئات عند تحميل الصفحة
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}api/category.php`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (result.status === 'success') {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('فشل تحميل الفئات');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // تحضير الـ FormData للرفع
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('category_id', product.category_id);
    formData.append('price', product.price);
    formData.append('qty', product.qty);
    formData.append('description', product.description);
    formData.append('pic', product.pic);

    try {
      const response = await fetch(`${BASE_URL}api/admin/add_product.php`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });
      
      const result = await response.json();
      if (result.status === 'success') {
        toast.success('تمت إضافة المنتج بنجاح!');
        setProduct({ name: '', category_id: '', price: '', qty: '', description: '', pic: null });
      } else {
        toast.error(result.message || 'حدث خطأ أثناء الإضافة');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('حدث خطأ في الاتصال بالسيرفر');
    }
  };

  return (
    <div className="admin-page-container">
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <i className="fas fa-bars"></i>
      </button>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className="admin-main-wrapper">
        <div className="stats-grid">
          <div className="auth-container" dir="rtl">
            <div className="auth-card">
              <h2 style={{ color: '#0F7A73', marginBottom: '25px', textAlign: 'center' }}>إضافة منتج جديد</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">اسم المنتج</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={product.name}
                    onChange={(e) => setProduct({...product, name: e.target.value})}
                    required 
                  />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                   <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">السعر (ج.م)</label>
                      <input 
                        type="number" 
                        className="form-input"
                        value={product.price}
                        onChange={(e) => setProduct({...product, price: e.target.value})}
                        required 
                      />
                   </div>
                   <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">الكمية</label>
                      <input 
                        type="number" 
                        className="form-input"
                        value={product.qty}
                        onChange={(e) => setProduct({...product, qty: e.target.value})}
                        required 
                      />
                   </div>
                </div>

                <div className="form-group">
                  <label className="form-label">الفئة</label>
                  <select 
                    className="form-input" 
                    value={product.category_id}
                    onChange={(e) => setProduct({...product, category_id: e.target.value})}
                    required
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">صورة المنتج</label>
                  <div className="custom-file-upload">
                      <input 
                        type="file" 
                        id="pic-upload"
                        accept="image/*"
                        onChange={(e) => setProduct({...product, pic: e.target.files[0]})}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="pic-upload" className="file-upload-label">
                          <i className="fas fa-camera" style={{marginLeft: '8px'}}></i>
                          {product.pic ? product.pic.name : "اضغط لرفع صورة"}
                      </label>
                  </div>
                </div>

                <button type="submit" className="btn-form-submit">
                  حفظ المنتج في الصيدلية
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;