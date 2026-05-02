import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AppProvider } from './context/AppContext'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Register from './pages/auth/Register';
import Login from './pages/auth/login'; 
import Landing from './pages/Landing';
import Products from './pages/Products';
import AddProduct from './pages/admin/AddProduct';
import AdminDashboard from './pages/admin/Dashboard';
import CheckoutPage from './pages/Checkout';
import CartPage from './pages/Cart';
import MyOrdersPage from './pages/MyOrdersPage';
import UploadPrescription from './pages/UploadPrescription';
import CustomersPage from './pages/admin/CustomersPage';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './layouts/admin/AdminLayout';
import './layouts/variables.css';
import './layouts/global.css';

const NotFound = () => <div style={{textAlign: 'center', padding: '50px'}}><h1>404 - Page Not Found</h1></div>;

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Global Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/products" element={<Products />} />
          
          {/* Auth Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          

          {/* Private Routes */}

          <Route path="/checkout" element={
              <ProtectedRoute>
                  <CheckoutPage />
              </ProtectedRoute>
          } />

          <Route path="/my-orders" element={
              <ProtectedRoute>
                  <MyOrdersPage />
              </ProtectedRoute>
          } />

          <Route path="/cart" element={
            <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
          } />

          <Route path="/prescriptions" element={
            <ProtectedRoute>
                <UploadPrescription />
              </ProtectedRoute>
          } />


          {/* Admin Routes */}
          
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route path="customers" element={<CustomersPage />} />
          <Route path='add-product' element={<AddProduct />}/>
        </Route>




          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer 
        position="top-right"
        autoClose={500}
        hideProgressBar={true}
        newestOnTop={true}
        rtl={true} 
        pauseOnHover
      />
    </AppProvider>
  );
}

export default App;
