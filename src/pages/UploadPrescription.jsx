import React, { useState } from 'react';
import { BASE_URL } from '../api/config';
import { toast } from 'react-toastify';
import '../layouts/Upload.css'; // افترضت إن ده ملف الـ CSS بتاعك
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UploadPrescription = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null); // عشان الـ Preview
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected)); // توليد رابط مؤقت للصورة عشان تظهر
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.warn("من فضلك اختر صورة الروشتة أولاً");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('prescription', file);

        try {
            const res = await fetch(`${BASE_URL}api/prescriptions/upload.php`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: formData
            });
            const result = await res.json();

            if (result.status === 'success') {
                toast.success('تم رفع الروشتة بنجاح! سيتم مراجعتها قريباً.');
                // Reset state
                setFile(null);
                setPreview(null);
            } else {
                toast.error(result.message || 'خطأ في الرفع');
            }
        } catch (error) {
            toast.error('فشل الاتصال بالسيرفر');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Navbar />
        <div className="upload-wrapper">
            <div className="upload-card">
                <div className="upload-header">
                    <h3>رفع روشتة جديدة</h3>
                    <p>صور الروشتة بوضوح وارفعها، وهنتواصل معاك فوراً</p>
                </div>

                <div className={`drop-zone ${preview ? 'has-image' : ''}`}>
                    {preview ? (
                        <div className="preview-container">
                            <img src={preview} alt="Prescription" />
                            <button className="remove-btn" onClick={() => { setFile(null); setPreview(null); }}>حذف</button>
                        </div>
                    ) : (
                        <label htmlFor="fileInput" className="drop-label">
                            <span className="upload-icon">📷</span>
                            <p>اضغط لاختيار الصورة من جهازك</p>
                            <input type="file" accept="image/*" onChange={handleFileChange} id="fileInput" hidden />
                        </label>
                    )}
                </div>

                <button 
                    className="submit-btn" 
                    onClick={handleUpload} 
                    disabled={!file || loading}
                >
                    {loading ? "جاري الإرسال..." : "إرسال الروشتة للتحضير"}
                </button>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default UploadPrescription;