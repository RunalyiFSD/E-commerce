import React from 'react';
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  AlertCircle,
  MapPin,
  Building2,
  UserCheck,
  RotateCcw,
} from 'lucide-react';
import { NORMAL_TRACKING_STEPS, ORDER_STATUS_CONFIG } from '../../constants/theme';
import { cn } from '../../utils/cn';
import OrderStatusBadge from '../order/OrderStatusBadge';

export function TrackingTimeline({
  currentStatus = 'IN_TRANSIT',
  trackingEvents = [],
  estimatedDeliveryDate = 'Sep 10, 2026',
  trackingNumber = 'TRK-98214-US',
  courier = 'FedEx Express',
  className,
}) {
  // Determine progress step index for standard flow
  const currentStepIndex = NORMAL_TRACKING_STEPS.indexOf(currentStatus);
  const isExceptionState = currentStepIndex === -1;

  // Mock initial tracking events if empty
  const events = trackingEvents.length > 0 ? trackingEvents : [
    {
      status: 'PLACED',
      message: 'Order received and verified',
      timestamp: '2026-09-07T14:30:00.000Z',
      location: 'Online Platform',
      source: 'SYSTEM',
    },
    {
      status: 'CONFIRMED',
      message: 'Seller accepted order items',
      timestamp: '2026-09-07T15:10:00.000Z',
      location: 'Seller Hub',
      source: 'SELLER',
    },
    {
      status: 'PROCESSING',
      message: 'Item picked and packed into box',
      timestamp: '2026-09-07T17:00:00.000Z',
      location: 'Warehouse - Bay 4',
      source: 'SELLER',
    },
    {
      status: 'SHIPPED',
      message: 'Package handed over to carrier partner',
      timestamp: '2026-09-07T19:20:00.000Z',
      location: 'Logistics Facility',
      source: 'COURIER',
    },
    {
      status: 'IN_TRANSIT',
      message: 'In transit to destination sorting facility',
      timestamp: '2026-09-07T20:15:00.000Z',
      location: 'Central Distribution Center, WA',
      source: 'COURIER',
    },
  ];

  return (
    <div className={cn('bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-8', className)}>
      {/* Header Overview Card */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Estimated Delivery</span>
            <span className="text-sm font-black text-emerald-700">{estimatedDeliveryDate}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
            <span>Courier: <strong className="text-slate-800">{courier}</strong></span>
            <span>&bull;</span>
            <span>Tracking No: <strong className="font-mono text-slate-900">{trackingNumber}</strong></span>
          </div>
        </div>

        <OrderStatusBadge status={currentStatus} size="md" />
      </div>

      {/* Standard Step Stepper Bar (Horizontal) */}
      {!isExceptionState && (
        <div className="hidden sm:block py-4">
          <div className="relative flex items-center justify-between">
            {/* Step Track Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStepIndex) / (NORMAL_TRACKING_STEPS.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Step Nodes */}
            {NORMAL_TRACKING_STEPS.map((step, idx) => {
              const isPassed = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step} className="relative z-10 flex flex-col items-center group">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                      isPassed
                        ? 'bg-emerald-500 text-white shadow-sm ring-4 ring-emerald-50'
                        : 'bg-white border-2 border-slate-300 text-slate-400',
                      isCurrent && 'ring-4 ring-brand-500/30 bg-brand-600 text-white border-brand-600 scale-110'
                    )}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-semibold mt-2 text-center max-w-[70px] truncate',
                      isCurrent ? 'text-slate-900 font-extrabold' : isPassed ? 'text-slate-700' : 'text-slate-400'
                    )}
                  >
                    {ORDER_STATUS_CONFIG[step]?.label || step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Historical Detailed Timeline Events */}
      <div>
        <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-4">
          Tracking History & Events
        </h4>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {events.map((evt, idx) => {
            const eventDate = new Date(evt.timestamp).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div key={idx} className="relative group">
                {/* Node Bullet */}
                <div
                  className={cn(
                    'absolute -left-6 top-1.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white',
                    idx === events.length - 1 ? 'bg-amber-500 text-slate-900' : 'bg-emerald-500 text-white'
                  )}
                >
                  <CheckCircle2 className="w-3 h-3" />
                </div>

                {/* Event Content Box */}
                <div className="bg-slate-50/70 hover:bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {ORDER_STATUS_CONFIG[evt.status]?.label || evt.status}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 font-medium uppercase">
                        {evt.source}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{eventDate}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{evt.message}</p>

                  {evt.location && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-2 font-medium">
                      <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>{evt.location}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TrackingTimeline;
