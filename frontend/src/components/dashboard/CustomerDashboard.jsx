import React from 'react';
import { Link } from 'react-router-dom';
import OrderStatusBadge from '../order/OrderStatusBadge';
import Button from '../common/Button';
import { ShoppingBag, Truck, CheckCircle2, ArrowRight, MapPin, Package, ExternalLink } from 'lucide-react';

export function CustomerDashboard({ data }) {
  const { stats = {}, activeShipment, recentOrders = [] } = data;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
              Customer Hub
            </span>
            <h1 className="text-2xl font-black mt-1">Welcome Back!</h1>
            <p className="text-xs text-slate-300 mt-1">
              Track active shipments, view order history, and manage your account.
            </p>
          </div>
          <Link to="/products">
            <Button variant="amber" size="sm" icon={<ShoppingBag className="w-4 h-4" />}>
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Orders</span>
            <ShoppingBag className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.totalOrders || 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Orders placed to date</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Shipments</span>
            <Truck className="w-5 h-5 text-sky-500" />
          </div>
          <p className="text-3xl font-black text-sky-600">{stats.activeShipmentsCount || 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Packages in fulfillment/transit</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Delivered</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600">{stats.deliveredCount || 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Completed package deliveries</p>
        </div>
      </div>

      {/* Active Package Tracker Widget */}
      {activeShipment && (
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
                Order #{activeShipment.orderNumber}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <OrderStatusBadge status={activeShipment.status} size="md" />
              <Link to={`/orders/${activeShipment._id}/track`}>
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
                {activeShipment.tracking?.estimatedDeliveryDate || '3 - 5 Business Days'}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Carrier / Courier</span>
              <p className="font-bold text-slate-900">
                {activeShipment.tracking?.courier || 'E-Commerce Express'}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Tracking Number</span>
              <p className="font-mono font-bold text-slate-900">
                {activeShipment.tracking?.trackingNumber || 'TRK-ASSIGNED'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders List Widget */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Recent Orders History
          </h3>
          <Link to="/track-order" className="text-xs font-bold text-amber-600 hover:underline">
            Public Tracking Lookup &rarr;
          </Link>
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
                    {ord.items?.length} {ord.items?.length === 1 ? 'item' : 'items'} &bull; Total: ${ord.pricing?.total?.toFixed(2)}
                  </p>
                </div>

                <Link to={`/orders/${ord._id}/track`}>
                  <Button variant="outline" size="xs" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Track
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;
