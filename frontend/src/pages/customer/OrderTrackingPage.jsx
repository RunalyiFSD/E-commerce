import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import TrackingTimeline from '../../components/tracking/TrackingTimeline';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import Button from '../../components/common/Button';
import ReturnRequestModal from '../../components/order/ReturnRequestModal';
import orderService from '../../services/orderService';
import { ArrowLeft, Package, MapPin, CreditCard, ExternalLink, ShieldCheck, RotateCcw } from 'lucide-react';

export function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  useEffect(() => {
    async function loadTracking() {
      setLoading(true);
      setError('');
      try {
        const res = await orderService.getOrderTracking(orderId);
        setTrackingData(res.tracking);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order tracking history');
      } finally {
        setLoading(false);
      }
    }
    loadTracking();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 w-full">
          <LoadingState label="Retrieving live shipment tracking details..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !trackingData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 w-full">
          <ErrorState
            title="Tracking Information Unavailable"
            message={error || 'Unable to find tracking records for this order.'}
            onRetry={() => window.location.reload()}
          />
          <div className="mt-6 text-center">
            <Link to="/products">
              <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
                Return to Store
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const {
    orderNumber,
    currentStatus,
    courier,
    trackingNumber,
    estimatedDeliveryDate,
    shippingAddress,
    items = [],
    timeline = [],
  } = trackingData;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>

          <div className="flex items-center gap-2">
            {currentStatus === 'DELIVERED' && (
              <Button
                variant="amber"
                size="sm"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={() => setIsReturnModalOpen(true)}
              >
                Request Return / Refund
              </Button>
            )}
            <Link to="/track-order">
              <Button variant="outline" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                Track Another Order
              </Button>
            </Link>
          </div>
        </div>

        {/* Title & Order ID Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                Live Shipment Tracking
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-0.5">
                Order #{orderNumber}
              </h1>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Authentic Carrier Scan Verified</span>
            </div>
          </div>
        </div>

        {/* Visual Tracking Component */}
        <TrackingTimeline
          currentStatus={currentStatus}
          trackingEvents={timeline}
          estimatedDeliveryDate={estimatedDeliveryDate || '3 - 5 Business Days'}
          trackingNumber={trackingNumber || 'TRK-PENDING'}
          courier={courier || 'E-Commerce Express'}
          className="mb-8"
        />

        {/* Summary Grid: Delivery Address & Order Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 mb-3">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Delivery Destination Address</span>
            </div>
            {shippingAddress ? (
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-900 text-sm">{shippingAddress.fullName}</p>
                <p>{shippingAddress.street}</p>
                <p>
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                </p>
                <p className="text-slate-500 pt-1">Phone: {shippingAddress.phone}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No shipping address recorded</p>
            )}
          </div>

          {/* Items Preview Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 mb-3">
              <Package className="w-4 h-4 text-amber-500" />
              <span>Shipment Package Contents ({items.length} {items.length === 1 ? 'Item' : 'Items'})</span>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-100 last:border-0 pb-2">
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img src={item.image} alt={item.productName} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                    ) : (
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                        <Package className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-800 line-clamp-1">{item.productName}</p>
                      <p className="text-slate-400 text-[11px]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <ReturnRequestModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        order={{ _id: orderId, orderNumber, pricing: { total: items.reduce((s, i) => s + i.price * i.quantity, 0) }, timeline }}
        onReturnSubmitted={() => window.location.reload()}
      />

      <Footer />
    </div>
  );
}

export default OrderTrackingPage;
