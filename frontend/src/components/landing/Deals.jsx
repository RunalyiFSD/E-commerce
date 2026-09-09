import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../../services/mockData';
import ProductCard from '../product/ProductCard';
import Badge from '../common/Badge';

export function Deals({ onAddToCart }) {
  const dealProducts = PRODUCTS.filter((p) => p.isDeal);

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mb-12 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/40 rounded-3xl p-6 sm:p-8">
      {/* Header with Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 text-slate-900 rounded-xl shadow-sm animate-bounce">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">Today's Flash Deals</h2>
              <Badge variant="danger" size="sm">Limited Time</Badge>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">Exclusive discounts updated daily</p>
          </div>
        </div>

        {/* Timer Display Box */}
        <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-mono shadow-sm">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-400">Ends in:</span>
          <span className="font-bold text-amber-400">
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dealProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
}

export default Deals;
