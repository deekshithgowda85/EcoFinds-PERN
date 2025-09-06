import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductPage from './pages/ProductPage';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Detail from './pages/Detail';
import ProfilePage from './pages/ProfilePage';
import GrocDetail from './pages/GrocDetail';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProductManagement from './pages/Admin/ProductManagement';
import UserManagement from './pages/Admin/UserManagement';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Checkout from './pages/Checkout';
import CartSummary from './pages/CartSummary';
import OrderSummaryConfirm from './pages/OrderSummaryConfirm';
import PaymentDetails from './pages/PaymentDetails';
import OrderSuccessPage from './pages/OrderSuccessPage';
import Electronics from './pages/Electronics';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          {/* Product routes */}
          <Route path="/products" element={<ProductPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/products/:id" element={<GrocDetail />} />
          <Route path="/product/:id" element={<GrocDetail />} />

          {/* Electronics routes */}
          <Route path="/electronics" element={<Electronics />} />
          <Route path="/electronic" element={<Electronics />} />
          <Route path="/electronics/:id" element={<Detail />} />
          <Route path="/electronic/:id" element={<Detail />} />
          
          {/* Legacy grocery routes (redirect to electronics) */}
          <Route path="/groceries" element={<Electronics />} />
          <Route path="/grocery" element={<Electronics />} />
          <Route path="/groceries/:id" element={<Detail />} />
          <Route path="/grocery/:id" element={<Detail />} />

          {/* Other routes */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartSummary />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-summary" element={<OrderSummaryConfirm />} />
          <Route path="/payment-details" element={<PaymentDetails />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;