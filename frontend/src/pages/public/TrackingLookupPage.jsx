import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import TrackingTimeline from '../../components/tracking/TrackingTimeline';
import orderService from '../../services/orderService';
import { Search, Package, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export function TrackingLookupPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await orderService.trackByNumber(query.trim());
      setResult(res.tracking);
    } catch (err) {
      setError(err.response?.data?.message || 'No active shipment found with this tracking ID or order number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Search Hero Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl mb-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Package className="w-4 h-4" />
              <span>E-Commerce Logistics Central Lookup</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-3">
              Track Your Package
            </h1>
            <p className="text-slate-300 text-sm">
              Enter your order reference code (e.g. <span className="font-mono text-amber-400">AMZ-2026-12345</span>) or tracking number (e.g. <span className="font-mono text-amber-400">TRK-982140-US</span>) to see real-time updates.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order # or Tracking Code..."
                leftIcon={<Search className="w-5 h-5 text-slate-400" />}
                className="bg-white text-slate-900 placeholder:text-slate-400 rounded-xl"
              />
            </div>
            <Button
              type="submit"
              variant="amber"
              size="lg"
              isLoading={loading}
              className="font-bold px-6 shrink-0"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Track Package
            </Button>
          </form>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-xl mx-auto mb-8">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-red-900 mb-1">Shipment Not Found</h3>
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* Results Timeline */}
        {result && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4">
              <div>
                <span className="text-xs text-slate-500 font-semibold">Matched Order Number</span>
                <p className="text-lg font-black text-slate-900">{result.orderNumber}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Carrier Record</span>
              </div>
            </div>

            <TrackingTimeline
              currentStatus={result.currentStatus}
              trackingEvents={result.timeline}
              estimatedDeliveryDate={result.estimatedDeliveryDate || '3 - 5 Business Days'}
              trackingNumber={result.trackingNumber || 'TRK-VERIFIED'}
              courier={result.courier || 'E-Commerce Express'}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default TrackingLookupPage;
