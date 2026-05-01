import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  // 1. هنجيب بيانات المستخدم من الـ localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // 2. لو مفيش توكن أو نوع الحساب مش admin، اطرده لصفحة اللوجن
  if (!token || !user || user.type !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // 3. لو كله تمام، اعرض الصفحة اللي هو عايز يدخلها
  return children;
};

export default AdminRoute;