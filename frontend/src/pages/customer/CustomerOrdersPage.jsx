import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import ReturnRequestModal from '../../components/order/ReturnRequestModal';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { ShoppingBag, Truck, ArrowRight, RefreshCw, Calendar, PackageCheck, AlertCircle } from 'lucide-react';

export function CustomerOrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get('/orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
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
    if (activeTab === 'CANCELLED') return ['CANCELLED', 'DELIVERY_FAILED'].includes(order.status);
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
              <ShoppingBag className="w-6 h-6 text-amber-500" /> My Orders History
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              View and track all your past and active orders, manage returns, and view delivery updates.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchOrders} className="self-start sm:self-auto">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh List
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All Orders' },
            { id: 'ACTIVE', label: 'Active & In-Transit' },
            { id: 'DELIVERED', label: 'Delivered' },
            { id: 'RETURNS', label: 'Returns & Refunds' },
            { id: 'CANCELLED', label: 'Cancelled' },
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

        {/* Content Area */}
        {loading ? (
          <LoadingState label="Fetching your order history..." />
        ) : filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <EmptyState
              title="No orders found"
              message={
                activeTab === 'ALL'
                  ? "You haven't placed any orders yet. Start exploring our marketplace!"
                  : `No orders matching filter "${activeTab}".`
              }
              actionLabel="Start Shopping"
              onAction={() => navigate('/products')}
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order._id} className="p-5 hover:border-amber-300 transition-colors">
                {/* Order Top Bar */}
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

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Total Amount</span>
                    <span className="text-base font-black text-slate-900">
                      ₹{(order.pricing?.totalPrice || order.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3 mb-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-xs">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 truncate">{item.name}</p>
                        <p className="text-slate-500 mt-0.5">
                          Qty: {item.quantity} × ₹{item.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-2">
                  <div className="text-xs text-slate-500">
                    Shipping to: <span className="font-medium text-slate-700">{order.shippingAddress?.fullName || 'Customer'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="amber"
                      size="sm"
                      onClick={() => navigate(`/orders/${order._id}/track`)}
                    >
                      <Truck className="w-3.5 h-3.5 mr-1.5" /> Track Package
                    </Button>

                    {order.status === 'DELIVERED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReturnOrder(order)}
                      >
                        Request Return
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Return Request Modal */}
      {selectedReturnOrder && (
        <ReturnRequestModal
          order={selectedReturnOrder}
          onClose={() => setSelectedReturnOrder(null)}
          onSuccess={() => {
            setSelectedReturnOrder(null);
            fetchOrders();
          }}
        />
      )}
    </DashboardLayout>
  );
}

export default CustomerOrdersPage;
