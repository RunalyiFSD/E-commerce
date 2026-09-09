import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OrderStatusBadge from '../order/OrderStatusBadge';
import FulfillmentModal from '../seller/FulfillmentModal';
import Button from '../common/Button';
import { IndianRupee, ShoppingBag, Package, AlertTriangle, Truck, Plus, ArrowRight } from 'lucide-react';

export function SellerDashboard({ data, onRefresh }) {
  const { stats = {}, lowStockProducts = [], recentOrders = [] } = data;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFulfillClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-amber-200 uppercase tracking-wider">
              Seller Command Center
            </span>
            <h1 className="text-2xl font-black mt-1">Merchant Store Analytics</h1>
            <p className="text-xs text-amber-100 mt-1">
              Manage inventory dispatches, fulfill incoming orders, and track store performance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/seller/fulfillment">
              <Button variant="outline" size="sm" className="text-white border-amber-300 hover:bg-amber-800" icon={<Truck className="w-4 h-4" />}>
                Fulfillment Hub
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Store Revenue</span>
            <IndianRupee className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-700">₹{stats.totalRevenue?.toFixed(2) || '0.00'}</p>
          <p className="text-[11px] text-slate-500 mt-1">Gross sales completed</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Pending Dispatches</span>
            <Truck className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-amber-600">{stats.pendingFulfillmentCount || 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Needs packing or shipping</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Store Orders</span>
            <ShoppingBag className="w-5 h-5 text-sky-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.totalStoreOrders || 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Total order items received</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Products</span>
            <Package className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.totalStoreProducts || 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Listed catalog inventory</p>
        </div>
      </div>

      {/* Low Stock Inventory Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-sm mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Low Stock Inventory Warning ({stats.lowStockCount || lowStockProducts.length} items &le; 5 units)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {lowStockProducts.map((p) => (
              <div key={p._id} className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                  <p className="text-slate-400 font-mono">SKU: {p.SKU}</p>
                </div>
                <span className="font-black text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[11px]">
                  {p.stock} Left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Store Orders Fulfillment Queue */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Recent Store Orders Queue
          </h3>
          <Link to="/seller/fulfillment" className="text-xs font-bold text-amber-600 hover:underline">
            View All Dispatches &rarr;
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No customer orders received yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentOrders.map((ord) => (
              <div key={ord._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">#{ord.orderNumber}</span>
                    <OrderStatusBadge status={ord.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customer: <span className="font-semibold text-slate-800">{ord.customer?.name || 'Customer'}</span> &bull; Items: {ord.items?.length} &bull; Total: ₹{ord.pricing?.total?.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="amber"
                    size="xs"
                    icon={<Truck className="w-3.5 h-3.5" />}
                    onClick={() => handleFulfillClick(ord)}
                  >
                    Fulfill Order
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Launcher */}
      <FulfillmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onOrderUpdated={onRefresh}
      />
    </div>
  );
}

export default SellerDashboard;
