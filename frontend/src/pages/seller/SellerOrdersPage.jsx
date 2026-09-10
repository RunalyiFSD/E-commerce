import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import FulfillmentModal from '../../components/seller/FulfillmentModal';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import { ShoppingBag, Truck, RefreshCw, Filter, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

export function SellerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedFulfillmentOrder, setSelectedFulfillmentOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get('/orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch seller orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return ['PLACED', 'CONFIRMED'].includes(order.status);
    if (activeTab === 'FULFILLMENT') return ['PROCESSING', 'PACKED'].includes(order.status);
    if (activeTab === 'SHIPPED') return ['SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(order.status);
    if (activeTab === 'DELIVERED') return order.status === 'DELIVERED';
    return true;
  });

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-amber-500" /> Merchant Order Queue
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Process customer orders, confirm items, pack products, and dispatch shipments with courier tracking.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchOrders}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Orders
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All Orders' },
            { id: 'PENDING', label: 'Pending Confirmation' },
            { id: 'FULFILLMENT', label: 'Processing & Packing' },
            { id: 'SHIPPED', label: 'Dispatched & Shipped' },
            { id: 'DELIVERED', label: 'Completed' },
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

        {/* Orders List */}
        {loading ? (
          <LoadingState label="Loading merchant order queue..." />
        ) : filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <EmptyState
              title="No orders found"
              message={`No seller orders currently match status "${activeTab}".`}
            />
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
                    variant="amber"
                    size="sm"
                    onClick={() => setSelectedFulfillmentOrder(order)}
                  >
                    <Truck className="w-3.5 h-3.5 mr-1.5" /> Manage Fulfillment
                  </Button>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                        )}
                        <div>
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Tracking Info if available */}
                {order.tracking?.trackingNumber && (
                  <div className="bg-slate-50 p-3 rounded-lg text-xs flex items-center justify-between text-slate-700 font-medium">
                    <span>
                      Courier: <strong>{order.tracking.courier || 'Standard Courier'}</strong>
                    </span>
                    <span>
                      Tracking: <strong className="font-mono text-amber-700">{order.tracking.trackingNumber}</strong>
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Fulfillment Modal */}
        {selectedFulfillmentOrder && (
          <FulfillmentModal
            order={selectedFulfillmentOrder}
            onClose={() => setSelectedFulfillmentOrder(null)}
            onSuccess={() => {
              setSelectedFulfillmentOrder(null);
              fetchOrders();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default SellerOrdersPage;
