import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Calendar, ArrowRight, Home } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();

  // Try to get order from state or localStorage
  const savedOrderRaw = localStorage.getItem(`order_${orderId}`);
  const order = location.state?.order || (savedOrderRaw ? JSON.parse(savedOrderRaw) : null) || {
    _id: orderId,
    orderNumber: orderId,
    pricing: { total: 149.99 },
    shippingAddress: { fullName: 'Customer User', city: 'Seattle', state: 'WA' },
    createdAt: new Date().toISOString(),
    status: 'PLACED',
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 text-center space-y-8">
        {/* Success Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <Badge variant="success" size="md" showDot>
              Order Confirmed & Placed
            </Badge>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Thank you for your order!</h1>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              We've received your order and notified the seller to prepare your items for dispatch.
            </p>
          </div>

          {/* Key Order Details Box */}
          <div className="max-w-md mx-auto p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-2 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
              <span className="text-slate-500">Order Number</span>
              <span className="font-mono font-bold text-slate-900">{order.orderNumber || order._id}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
              <span className="text-slate-500">Placed Date</span>
              <span className="font-medium text-slate-800">{formattedDate}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
              <span className="text-slate-500">Estimated Delivery</span>
              <span className="font-bold text-emerald-700">3 - 5 Business Days</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500">Total Paid</span>
              <span className="text-base font-black text-slate-900">₹{order.pricing?.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link to={`/dashboard/customer/orders`}>
              <Button variant="amber" size="lg" leftIcon={<Truck className="w-5 h-5" />} className="w-full sm:w-auto font-bold shadow-md">
                Track Order Status
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg" leftIcon={<Home className="w-5 h-5" />} className="w-full sm:w-auto">
                Back to Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default OrderConfirmationPage;
