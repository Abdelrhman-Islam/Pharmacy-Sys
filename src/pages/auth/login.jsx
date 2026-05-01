import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';
import { AppContext } from '../../context/AppContext'; 
import translations from '../../locales/auth.json';
import '../../layouts/Forms.css';

const Login = () => {
    const navigate = useNavigate();
    const { lang } = useContext(AppContext);
    const content = translations[lang] || translations['en'];
    const isRtl = lang === 'ar';

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // حالة الأخطاء لكل خانة
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // مسح الخطأ بمجرد ما المستخدم يبدأ يعدل البيانات
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // تصفير الأخطاء عند محاولة الدخول

        try {
            const result = await authService.login(formData);
            
            if (result.status === 'success') {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));

                // تأكد إن الـ type بيتقرأ من المكان الصح (غالباً من جوه الـ user)
                const userRole = result.user?.type || result.type; 

                if (userRole === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                // التعامل مع الخطأ القادم من الباك إند
                const msg = result.message || '';
                // لو المشكلة في الإيميل أو الباسورد (أو الاثنين مع بعض للأمان)
                if (msg.includes('email') || msg.includes('البريد') || msg.includes('password') || msg.includes('كلمة')) {
                    setErrors({
                        email: isRtl ? "خطأ في البريد الإلكتروني أو كلمة المرور" : "Invalid email or password",
                        password: ' ' // مجرد مساحة لتلوين الخانة بالأحمر
                    });
                } else {
                    setErrors({ general: msg });
                }
            }
        } catch (error) {
            setErrors({ general: isRtl ? "فشل الاتصال بالسيرفر" : "Server connection failed" });
        }
    };

    return (
        <div className="auth-container" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="auth-card">
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: '#222', margin: '0 0 10px 0' }}>{content.loginTitle}</h2>
                    <p style={{ color: '#666', margin: 0 }}>
                        {content.loginSubtitle} <span className="accent-text">{content.loginAccent}</span>
                    </p>
                </div>

                {/* عرض خطأ عام لو موجود */}
                {errors.general && <div className="general-error-box">{errors.general}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">{content.email}</label>
                        <input 
                            className={`form-input ${errors.email ? 'input-error' : ''}`} 
                            type="email" 
                            name="email" 
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@gmail.com" 
                            required 
                        />
                        {errors.email && <span className="field-error-msg">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label className="form-label">{content.pass}</label>
                            <a href="#" style={{ color: '#F57C00', fontSize: '12px', textDecoration: 'none', marginBottom: '8px' }}>
                                {content.forgotPass}
                            </a>
                        </div>
                        <input 
                            className={`form-input ${errors.password ? 'input-error' : ''}`} 
                            type="password" 
                            name="password" 
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••" 
                            required 
                        />
                        {errors.password && errors.password !== ' ' && (
                            <span className="field-error-msg">{errors.password}</span>
                        )}
                    </div>

                    <button type="submit" className="btn-form-submit">
                        {content.btnLogin}
                    </button>

                    <button type="button" className="btn-secondary" onClick={() => navigate('/register')}>
                        {content.btnGoToReg}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;