import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OrderStatusBadge from '../order/OrderStatusBadge';
import FulfillmentModal from '../seller/FulfillmentModal';
import Button from '../common/Button';
import { ShieldCheck, IndianRupee, Users, Store, Package, Layers, Truck, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

export function AdminDashboard({ data, onRefresh }) {
  const { stats = {}, recentOrders = [] } = data;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOverrideClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Admin Executive Header */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Platform Executive Control Tower</span>
            </div>
            <h1 className="text-2xl font-black">Platform Administration & Oversight</h1>
            <p className="text-xs text-slate-300 mt-1">
              Platform-wide GMV analytics, user/seller ecosystem metrics, and delivery exception control.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/admin/deliveries">
              <Button variant="amber" size="sm" icon={<Truck className="w-4 h-4" />}>
                Delivery Operations
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Platform GMV</span>
            <IndianRupee className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-black text-emerald-700">₹{stats.totalGMV?.toFixed(2) || '0.00'}</p>
          <p className="text-[10px] text-slate-400">Total gross volume</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Customers</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-xl font-black text-slate-900">{stats.totalCustomers || 0}</p>
          <p className="text-[10px] text-slate-400">Registered buyers</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Sellers</span>
            <Store className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-black text-amber-600">{stats.totalSellers || 0}</p>
          <p className="text-[10px] text-slate-400">Active merchants</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Products</span>
            <Package className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xl font-black text-slate-900">{stats.totalProducts || 0}</p>
          <p className="text-[10px] text-slate-400">Catalog items</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Categories</span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-black text-purple-700">{stats.totalCategories || 0}</p>
          <p className="text-[10px] text-slate-400">Platform categories</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Total Orders</span>
            <Truck className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-black text-slate-900">{stats.totalOrders || 0}</p>
          <p className="text-[10px] text-slate-400">Processed to date</p>
        </div>
      </div>

      {/* Logistics Health Widget */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Logistics Health & Delivery Status
            </h3>
            <p className="text-xs text-slate-500">Live platform shipment breakdown</p>
          </div>
          <Link to="/admin/deliveries" className="text-xs font-bold text-amber-600 hover:underline">
            Manage Logistics &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-sky-800 uppercase">Active Dispatches</span>
              <p className="text-2xl font-black text-sky-900 mt-0.5">{stats.totalActiveDeliveries || 0}</p>
            </div>
            <Truck className="w-7 h-7 text-sky-500" />
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-red-800 uppercase">Delivery Exceptions</span>
              <p className="text-2xl font-black text-red-900 mt-0.5">{stats.totalExceptions || 0}</p>
            </div>
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase">Completed Deliveries</span>
              <p className="text-2xl font-black text-emerald-900 mt-0.5">{stats.totalDelivered || 0}</p>
            </div>
            <CheckCircle className="w-7 h-7 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Recent Platform Orders */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Recent Platform Orders
          </h3>
          <Link to="/admin/deliveries" className="text-xs font-bold text-amber-600 hover:underline">
            Control Tower &rarr;
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No orders registered on the platform yet.</p>
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
                    Customer: <span className="font-semibold text-slate-800">{ord.customer?.name || 'User'}</span> &bull; Items: {ord.items?.length} &bull; Total: ₹{ord.pricing?.total?.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="amber"
                    size="xs"
                    icon={<Truck className="w-3.5 h-3.5" />}
                    onClick={() => handleOverrideClick(ord)}
                  >
                    Admin Status Override
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FulfillmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onOrderUpdated={onRefresh}
      />
    </div>
  );
}

export default AdminDashboard;
