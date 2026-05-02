import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Redirect to login if unauthorized or not an admin
  if (!token || !user || user.type !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // Render Outlet instead of children
  return <Outlet />;
};

export default AdminRoute;