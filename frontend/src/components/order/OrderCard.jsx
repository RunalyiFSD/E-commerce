import React from 'react';
import { Package, Truck, Calendar, MapPin, ExternalLink, ChevronRight } from 'lucide-react';
import Card from '../common/Card';
import OrderStatusBadge from './OrderStatusBadge';
import Button from '../common/Button';

export function OrderCard({
  order = {
    _id: 'ord-1001',
    orderNumber: 'AMZ-2026-9921',
    createdAt: '2026-09-07T14:30:00.000Z',
    status: 'IN_TRANSIT',
    pricing: { total: 184.99 },
    items: [
      {
        productName: 'Wireless Noise Cancelling Headphones',
        quantity: 1,
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80',
      },
    ],
    shippingAddress: {
      fullName: 'Alex Johnson',
      city: 'Seattle',
      state: 'WA',
    },
    tracking: {
      trackingNumber: 'TRK-98214-US',
      courier: 'FedEx Express',
    },
  },
  role = 'CUSTOMER',
  onTrackOrder,
  onViewDetails,
  actionsSlot,
  className,
}) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card className={className}>
      {/* Order Header */}
      <Card.Header className="bg-slate-50/70 border-b border-slate-200/80 py-3.5 px-5">
        <div className="flex flex-wrap items-center justify-between gap-4 w-full text-xs">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Order Number</span>
              <span className="font-bold text-slate-900">{order.orderNumber || order._id}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Placed On</span>
              <span className="text-slate-700 font-medium">{formattedDate}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Total Amount</span>
              <span className="font-extrabold text-slate-900">₹{order.pricing?.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </Card.Header>

      {/* Order Body Items & Shipping details */}
      <Card.Body className="p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Order Items Preview */}
          <div className="flex-1 space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                  <img
                    src={item.image || '/placeholder.jpg'}
                    alt={item.productName}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-slate-800 truncate">{item.productName}</h5>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Qty: <span className="font-medium text-slate-700">{item.quantity}</span> &bull; ₹{item.price?.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping / Tracking Details */}
          <div className="md:w-64 p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs space-y-1.5 shrink-0">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">Deliver to {order.shippingAddress?.fullName}</span>
            </div>
            {order.tracking?.trackingNumber && (
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>{order.tracking.courier}:</span>
                <span className="font-mono text-slate-700 font-medium">{order.tracking.trackingNumber}</span>
              </div>
            )}
          </div>
        </div>
      </Card.Body>

      {/* Order Card Footer with Role-Specific Actions */}
      <Card.Footer className="bg-white border-t border-slate-100 px-5 py-3 flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails && onViewDetails(order)}
          rightIcon={<ChevronRight className="w-4 h-4" />}
          className="text-slate-600 hover:text-slate-900"
        >
          Order Details
        </Button>

        <div className="flex items-center gap-2">
          {/* Default Customer Action */}
          {onTrackOrder && (
            <Button
              variant="amber"
              size="sm"
              onClick={() => onTrackOrder(order)}
              leftIcon={<Truck className="w-3.5 h-3.5" />}
            >
              Track Order
            </Button>
          )}

          {/* Role specific custom actions slot */}
          {actionsSlot}
        </div>
      </Card.Footer>
    </Card>
  );
}

export default OrderCard;
