import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import CartProvider from './context/CartContext';
import { ToastProvider } from './components/common/Toast';
import LandingPage from './pages/public/LandingPage';
import ProductListingPage from './pages/public/ProductListingPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import DesignSystemShowcase from './pages/DesignSystemShowcase';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UnauthorizedPage from './pages/public/UnauthorizedPage';

// Customer Pages
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import WishlistPage from './pages/customer/WishlistPage';
import CustomerOrdersPage from './pages/customer/CustomerOrdersPage';
import CustomerAddressesPage from './pages/customer/CustomerAddressesPage';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';

// Public & Tracking Lookup
import TrackingLookupPage from './pages/public/TrackingLookupPage';

// Seller Pages
import SellerFulfillmentPage from './pages/seller/SellerFulfillmentPage';
import SellerProductsPage from './pages/seller/SellerProductsPage';
import SellerInventoryPage from './pages/seller/SellerInventoryPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import SellerSettingsPage from './pages/seller/SellerSettingsPage';

// Admin Pages
import AdminDeliveryManagementPage from './pages/admin/AdminDeliveryManagementPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSellersPage from './pages/admin/AdminSellersPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

// Dashboard Router Shell
import DashboardPage from './pages/dashboard/DashboardPage';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Routes>
          {/* Public Discovery Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/search" element={<ProductListingPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/track-order" element={<TrackingLookupPage />} />

          {/* Authentication & Authorization Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Core Dashboard Overview */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Customer Routes */}
          <Route
            path="/dashboard/customer/orders"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                <CustomerOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/customer/addresses"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                <CustomerAddressesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/customer/profile"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                <CustomerProfilePage />
              </ProtectedRoute>
            }
          />
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
            path="/dashboard/seller/products"
            element={
              <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
                <SellerProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/seller/inventory"
            element={
              <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
                <SellerInventoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/seller/orders"
            element={
              <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
                <SellerOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/seller/settings"
            element={
              <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
                <SellerSettingsPage />
              </ProtectedRoute>
            }
          />
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
            path="/dashboard/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/sellers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminSellersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/products"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <SellerProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/categories"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminCategoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/orders"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/audit-logs"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminAuditLogsPage />
              </ProtectedRoute>
            }
          />
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
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
