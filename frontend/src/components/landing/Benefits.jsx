import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones, MapPin, Lock } from 'lucide-react';

const BENEFITS = [
  {
    icon: Truck,
    title: 'Express Delivery',
    description: 'Track packages in real-time with continuous updates.',
    color: 'text-brand-600 bg-brand-50',
  },
  {
    icon: ShieldCheck,
    title: 'Buyer Protection',
    description: 'Full refund guarantee for eligible order non-deliveries.',
    color: 'text-emerald-500 bg-emerald-50',
  },
  {
    icon: RefreshCw,
    title: 'Hassle-Free Returns',
    description: 'Initiate return requests directly from your customer dashboard.',
    color: 'text-sky-500 bg-sky-50',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated customer support for sellers and shoppers.',
    color: 'text-purple-500 bg-purple-50',
  },
];

export function Benefits() {
  return (
    <section className="mb-12 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {BENEFITS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-4 p-2">
              <div className={`p-3.5 rounded-2xl ${item.color} shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Benefits;
