import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    
    // لو مفيش توكن، حوّل المستخدم لصفحة تسجيل الدخول
    if (!token) {
        return <Navigate to="/login" />;
    }
    
    // لو موجود، اعرض الصفحة عادي
    return children;
};

export default ProtectedRoute;