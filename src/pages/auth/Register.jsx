import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';
import { AppContext } from '../../context/AppContext'; 
import translations from '../../locales/auth.json';
import '../../layouts/Forms.css';

const Register = () => {
  const navigate = useNavigate();
  const { lang } = useContext(AppContext);
  const content = translations[lang] || translations['en'];
  const isRtl = lang === 'ar';

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', age: '', address: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); 
    const password = formData.password;
    let passwordErrors = "";

    if (password.length < 8) {
      passwordErrors = isRtl ? "الباسورد لازم يكون 8 حروف على الأقل" : "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      passwordErrors = isRtl ? "لازم حرف كبير واحد على الأقل (A-Z)" : "Must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(password)) {
      passwordErrors = isRtl ? "لازم رقم واحد على الأقل" : "Must contain at least one number";
    }

    if (passwordErrors) {
      setErrors({ password: passwordErrors });
      return; 
    }

    try {
      const result = await authService.register(formData);
      
      if (result.status === 'success') {
        navigate('/login');
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          if (result.message.includes('الإيميل') || result.message.toLowerCase().includes('email')) {
            setErrors({ email: result.message });
          } else {
            setErrors({ general: result.message });
          }
        }
      }
    } catch (error) {
      setErrors({ general: isRtl ? "فشل الاتصال بالسيرفر" : "Server connection error" });
    }
  };

  return (
    <div className="auth-container" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#222', margin: '0 0 10px 0' }}>{content.title}</h2>
          <p style={{ color: '#666', margin: 0 }}>
            {content.subtitle} <span className="accent-text">{content.accent}</span>
          </p>
        </div>

        {errors.general && <div className="general-error-box">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{content.name}</label>
            <input 
              className={`form-input ${errors.name ? 'input-error' : ''}`} 
              type="text" name="name" value={formData.name} onChange={handleChange} placeholder={content.placeholders.name} required 
            />
            {errors.name && <span className="field-error-msg">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{content.email}</label>
            <input 
              className={`form-input ${errors.email ? 'input-error' : ''}`} 
              type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@company.com" required 
            />
            {errors.email && <span className="field-error-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{content.pass}</label>
            <input 
              className={`form-input ${errors.password ? 'input-error' : ''}`} 
              type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required 
            />
            {errors.password && <span className="field-error-msg">{errors.password}</span>}
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">{content.phone}</label>
              <input 
                className={`form-input ${errors.phone ? 'input-error' : ''}`} 
                type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="01xxxxxxx" 
              />
              {errors.phone && <span className="field-error-msg">{errors.phone}</span>}
            </div>
            <div className="form-group" style={{ flex: 0.4 }}>
              <label className="form-label">{content.age}</label>
              <input className="form-input" type="number" name="age" value={formData.age} onChange={handleChange} placeholder="25" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{content.address}</label>
            <input className="form-input" type="text" name="address" value={formData.address} onChange={handleChange} placeholder={content.placeholders.address} />
          </div>

          <button type="submit" className="btn-form-submit">{content.btnReg}</button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/login')}>{content.btnLog}</button>
        </form>
      </div>
    </div>
  );
};

export default Register;