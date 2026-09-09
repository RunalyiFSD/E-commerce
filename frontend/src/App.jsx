import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import CartProvider from './context/CartContext';
import LandingPage from './pages/public/LandingPage';
import ProductListingPage from './pages/public/ProductListingPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import DesignSystemShowcase from './pages/DesignSystemShowcase';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UnauthorizedPage from './pages/public/UnauthorizedPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import TrackingLookupPage from './pages/public/TrackingLookupPage';
import SellerFulfillmentPage from './pages/seller/SellerFulfillmentPage';
import AdminDeliveryManagementPage from './pages/admin/AdminDeliveryManagementPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Public Discovery Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/search" element={<ProductListingPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/track-order" element={<TrackingLookupPage />} />

          {/* Authentication & Authorization Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Unified Role Dashboard Route */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Customer Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation/:orderId"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderId/track"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                <OrderTrackingPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Seller Routes */}
          <Route
            path="/seller/fulfillment"
            element={
              <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
                <SellerFulfillmentPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/deliveries"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDeliveryManagementPage />
              </ProtectedRoute>
            }
          />

          {/* Development Showcase */}
          <Route path="/design-system" element={<DesignSystemShowcase />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

