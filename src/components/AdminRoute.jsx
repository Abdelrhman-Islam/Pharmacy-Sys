import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Redirect to login if unauthorized or not an admin
  if (!token || !user || user.type !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // Render children if authorized
  return children;
};

export default AdminRoute;