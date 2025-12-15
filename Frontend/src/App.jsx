import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// User Pages
import HomePage from './pages/user/HomePage';
import ProductsPage from './pages/user/ProductsPage';
import ProductDetailPage from './pages/user/ProductDetailPage';
import CartPage from './pages/user/CartPage';
import UserDashboard from './pages/user/UserDashboard';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import AddProductPage from './pages/owner/AddProductPage';

// Private Route Component
const PrivateRoute = ({ children, requireOwner = false }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (requireOwner && user.role !== 'owner') {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected User Routes */}
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <CartPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              }
            />

            {/* Protected Owner Routes */}
            <Route
              path="/owner/dashboard"
              element={
                <PrivateRoute requireOwner={true}>
                  <OwnerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/owner/add-product"
              element={
                <PrivateRoute requireOwner={true}>
                  <AddProductPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/owner/edit-product/:id"
              element={
                <PrivateRoute requireOwner={true}>
                  <AddProductPage /> {/* Reusing same component for edit */}
                </PrivateRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />

        {/* Toaster for notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#2E7D32',
              },
            },
            error: {
              style: {
                background: '#D32F2F',
              },
            },
          }}
        />
      </div>
    </AuthProvider>
  );
};

export default App;