import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import { ShoppingBag, Truck, RefreshCw, Calendar, Eye, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

export function AdminOrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get('/orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'ACTIVE') {
      return ['PLACED', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(order.status);
    }
    if (activeTab === 'DELIVERED') return order.status === 'DELIVERED';
    if (activeTab === 'ISSUES') return ['CANCELLED', 'DELIVERY_FAILED'].includes(order.status);
    if (activeTab === 'RETURNS') return ['RETURN_REQUESTED', 'RETURNED', 'REFUND_INITIATED', 'REFUNDED'].includes(order.status);
    return true;
  });

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-amber-500" /> Platform Orders Oversight
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Platform-wide order control panel for monitoring active shipments, exceptions, and fulfillment states.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchOrders}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Orders
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All Platform Orders' },
            { id: 'ACTIVE', label: 'Active Shipments' },
            { id: 'DELIVERED', label: 'Delivered' },
            { id: 'RETURNS', label: 'Returns & Refunds' },
            { id: 'ISSUES', label: 'Failed / Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-slate-900 font-extrabold shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState label="Loading platform orders..." />
        ) : filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <EmptyState title="No orders match filter" message={`No platform orders found for status "${activeTab}".`} />
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order._id} className="p-5 hover:border-amber-300 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-black text-slate-900">
                      Order #{order.orderNumber || order._id.slice(-8)}
                    </span>
                    <OrderStatusBadge status={order.status} />
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/orders/${order._id}/track`)}
                  >
                    <Truck className="w-3.5 h-3.5 mr-1.5" /> View Timeline & Tracking
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400 font-medium">Customer Information</p>
                    <p className="font-bold text-slate-800">{order.shippingAddress?.fullName || 'Customer User'}</p>
                    <p className="text-slate-500">{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-slate-400 font-medium">Total Amount</p>
                    <p className="text-base font-black text-slate-900">
                      ₹{(order.pricing?.totalPrice || order.totalAmount || 0).toFixed(2)}
                    </p>
                    <p className="text-[11px] text-slate-500">{order.items?.length || 0} items purchased</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminOrdersPage;
