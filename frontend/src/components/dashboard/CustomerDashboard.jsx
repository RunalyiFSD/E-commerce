import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OrderStatusBadge from '../order/OrderStatusBadge';
import OrderCard from '../order/OrderCard';
import Button from '../common/Button';
import Input from '../common/Input';
import orderService from '../../services/orderService';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Package,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react';

export function CustomerDashboard({ data, onRefresh }) {
  const { stats = {}, activeShipment: apiActiveShipment, recentOrders = [] } = data || {};
  const location = useLocation();
  const navigate = useNavigate();

  const isOrderHistory = location.pathname.includes('/orders');
  const isDeliveries = location.pathname.includes('/deliveries');

  const [apiOrders, setApiOrders] = useState(recentOrders);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Fetch full orders list from backend
  const fetchAllOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await orderService.getOrders();
      if (res?.orders) {
        setApiOrders(res.orders);
      }
    } catch (e) {
      console.warn('[Orders Sync] Falling back to recent/local orders cache:', e.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Merge backend orders with client-side localStorage orders (so demo/offline orders never disappear)
  const unifiedOrders = useMemo(() => {
    let localOrders = [];
    try {
      localOrders = JSON.parse(localStorage.getItem('customer_orders') || '[]');
    } catch (e) {}

    const combined = [...apiOrders];
    localOrders.forEach((lo) => {
      const exists = combined.some(
        (co) => String(co._id || co.orderNumber) === String(lo._id || lo.orderNumber)
      );
      if (!exists) {
        combined.push(lo);
      }
    });

    return combined.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }, [apiOrders]);

  // Derive metrics dynamically
  const activeStatuses = ['CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'];
  const activeShipments = unifiedOrders.filter((o) => activeStatuses.includes(o.status));
  const deliveredOrders = unifiedOrders.filter((o) => o.status === 'DELIVERED');
  const currentActiveShipment =
    apiActiveShipment || (activeShipments.length > 0 ? activeShipments[0] : null);

  // Filtered orders for Order History view
  const filteredOrders = useMemo(() => {
    return unifiedOrders.filter((ord) => {
      // Status filtering
      if (statusFilter === 'ACTIVE') {
        if (!activeStatuses.includes(ord.status) && ord.status !== 'PLACED') return false;
      } else if (statusFilter === 'DELIVERED') {
        if (ord.status !== 'DELIVERED') return false;
      } else if (statusFilter === 'CANCELLED') {
        if (ord.status !== 'CANCELLED' && ord.status !== 'RETURNED' && ord.status !== 'RETURN_REQUESTED')
          return false;
      }

      // Keyword query filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNumber = (ord.orderNumber || ord._id || '').toLowerCase().includes(q);
        const matchesItem = (ord.items || []).some((item) =>
          (item.productName || item.name || '').toLowerCase().includes(q)
        );
        const matchesCourier = (ord.tracking?.courier || '').toLowerCase().includes(q);
        const matchesTrk = (ord.tracking?.trackingNumber || '').toLowerCase().includes(q);
        return matchesNumber || matchesItem || matchesCourier || matchesTrk;
      }

      return true;
    });
  }, [unifiedOrders, statusFilter, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
              Customer Hub
            </span>
            <h1 className="text-2xl font-black mt-1">
              {isOrderHistory
                ? 'Your Order History'
                : isDeliveries
                ? 'Active Deliveries'
                : 'Welcome Back!'}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              {isOrderHistory
                ? 'Review, track, or request returns for all your purchases.'
                : isDeliveries
                ? 'Real-time timeline tracking for packages in transit.'
                : 'Track active shipments, view order history, and manage your account.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(isOrderHistory || isDeliveries) && (
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="text-white border-slate-600 hover:bg-slate-800">
                  Dashboard Overview
                </Button>
              </Link>
            )}
            <Link to="/products">
              <Button variant="amber" size="sm" icon={<ShoppingBag className="w-4 h-4" />}>
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => navigate('/dashboard/customer/orders')}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Orders</span>
            <ShoppingBag className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{unifiedOrders.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Orders placed to date</p>
        </div>

        <div
          onClick={() => navigate('/dashboard/customer/deliveries')}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-sky-400 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Shipments</span>
            <Truck className="w-5 h-5 text-sky-500" />
          </div>
          <p className="text-3xl font-black text-sky-600">{activeShipments.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Packages in fulfillment/transit</p>
        </div>

        <div
          onClick={() => navigate('/dashboard/customer/orders')}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-emerald-400 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Delivered</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600">{deliveredOrders.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Completed package deliveries</p>
        </div>
      </div>

      {/* Active Package Tracker Widget (Overview or Deliveries view) */}
      {currentActiveShipment && (!isOrderHistory || isDeliveries) && (
        <div className="bg-white border-2 border-amber-400/60 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">
                  Live Package Tracking
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                  IN PROGRESS
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Order #{currentActiveShipment.orderNumber}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <OrderStatusBadge status={currentActiveShipment.status} size="md" />
              <Link to={`/orders/${currentActiveShipment._id || currentActiveShipment.orderNumber}/track`}>
                <Button variant="amber" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Full Timeline
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 font-semibold block">Estimated Delivery</span>
              <p className="font-extrabold text-emerald-700 text-sm">
                {currentActiveShipment.tracking?.estimatedDeliveryDate || '3 - 5 Business Days'}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Carrier / Courier</span>
              <p className="font-bold text-slate-900">
                {currentActiveShipment.tracking?.courier || 'E Mart Logistics'}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Tracking Number</span>
              <p className="font-mono font-bold text-slate-900">
                {currentActiveShipment.tracking?.trackingNumber || 'TRK-ASSIGNED'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED ORDER HISTORY / DELIVERIES VIEW */}
      {(isOrderHistory || isDeliveries) ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          {/* Header with Search and Filter Pills */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
                {isDeliveries ? 'Active Deliveries' : 'All Placed Orders'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {filteredOrders.length} of {unifiedOrders.length} total orders
              </p>
            </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentOrders.map((ord) => (
              <div key={ord._id} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">#{ord.orderNumber}</span>
                    <OrderStatusBadge status={ord.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {ord.items?.length} {ord.items?.length === 1 ? 'item' : 'items'} &bull; Total: ₹{ord.pricing?.total?.toFixed(2)}
                  </p>
                </div>

                <Link to={`/orders/${ord._id}/track`}>
                  <Button variant="outline" size="xs" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Track
                  </Button>
                </Link>
              </div>

              {!isDeliveries && (
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
                  <button
                    onClick={() => setStatusFilter('ALL')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setStatusFilter('ACTIVE')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      statusFilter === 'ACTIVE' ? 'bg-white text-amber-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => setStatusFilter('DELIVERED')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      statusFilter === 'DELIVERED' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => setStatusFilter('CANCELLED')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      statusFilter === 'CANCELLED' ? 'bg-white text-rose-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Exceptions
                  </button>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={fetchAllOrders}
                disabled={loadingOrders}
                icon={<RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />}
              >
                Sync
              </Button>
            </div>
          </div>

          {/* Orders Cards List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs space-y-3">
              <Package className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-700">No Orders Found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery
                  ? 'No orders match your search keyword. Try adjusting your query.'
                  : "You haven't placed any orders matching this filter yet."}
              </p>
              <Link to="/products">
                <Button variant="amber" size="sm" className="mt-2 font-bold">
                  Browse Catalog
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((ord) => (
                <OrderCard
                  key={ord._id || ord.orderNumber}
                  order={ord}
                  role="CUSTOMER"
                  onTrackOrder={(o) => navigate(`/orders/${o._id || o.orderNumber}/track`)}
                  onViewDetails={(o) => navigate(`/orders/${o._id || o.orderNumber}/track`)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* MAIN DASHBOARD OVERVIEW: RECENT ORDERS WIDGET */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Recent Orders History
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {unifiedOrders.length} order{unifiedOrders.length === 1 ? '' : 's'} placed to date
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard/customer/orders"
                className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1"
              >
                View Full Order History &rarr;
              </Link>
            </div>
          </div>

          {unifiedOrders.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <Package className="w-8 h-8 mx-auto opacity-50" />
              <p className="font-semibold text-slate-600">You haven't placed any orders yet.</p>
              <Link to="/products">
                <Button variant="amber" size="xs" className="mt-1 font-bold">
                  Explore Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {unifiedOrders.slice(0, 5).map((ord) => (
                <div key={ord._id || ord.orderNumber} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">#{ord.orderNumber}</span>
                      <OrderStatusBadge status={ord.status} size="sm" />
                      <span className="text-[11px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {ord.items?.length} {ord.items?.length === 1 ? 'item' : 'items'} &bull; Total: ₹{ord.pricing?.total?.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/orders/${ord._id || ord.orderNumber}/track`}>
                      <Button variant="amber" size="xs" icon={<Truck className="w-3.5 h-3.5" />}>
                        Track Order
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
