import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs mt-auto border-t border-slate-800/80">
      {/* Back to top banner */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full bg-slate-900 hover:bg-slate-850 py-3 text-center text-slate-300 font-semibold text-xs transition-colors border-b border-slate-800"
      >
        Back to top
      </button>

      {/* Main Footer Links Container */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">E</span>
            </div>
            <span className="text-base font-black text-white tracking-tight">E Mart</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            Next-generation enterprise commerce platform providing real-time tracking, seamless checkout, and unified multi-vendor infrastructure.
          </p>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:underline hover:text-white transition-colors">About Marketplace</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white transition-colors">Careers & Engineering</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white transition-colors">Press & Media</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold text-white mb-3 tracking-wider uppercase">Sell & Partner</h3>
          <ul className="space-y-2">
            <li><Link to="/register?role=SELLER" className="hover:underline hover:text-brand-400 font-semibold text-slate-300 transition-colors">Become a Verified Seller</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white transition-colors">Merchant Accelerator</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white transition-colors">Brand Protection Protocol</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white transition-colors">E Mart Fulfillment Network</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold text-white mb-3 tracking-wider uppercase">Payment & Safety</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:underline hover:text-white transition-colors">E Mart Wallet & Credits</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white transition-colors">Zero-Fee UPI & Cards</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white transition-colors">Escrow Protection</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white transition-colors">GST Invoicing</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold text-white mb-3 tracking-wider uppercase">Help & Support</h3>
          <ul className="space-y-2">
            <li><Link to="/dashboard/customer/orders" className="hover:underline hover:text-white transition-colors">Your Orders & Invoices</Link></li>
            <li><Link to="/track-order" className="hover:underline hover:text-brand-400 text-slate-300 transition-colors font-medium">Live Package Tracker</Link></li>
            <li><Link to="/dashboard/customer/deliveries" className="hover:underline hover:text-white transition-colors">Shipping Rates & Policies</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white transition-colors">Help Center & Support Desk</Link></li>
          </ul>
        </div>
      </div>

      {/* Feature Badges Banner */}
      <div className="border-t border-slate-850 bg-slate-900/60 py-6 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <Truck className="w-5 h-5 text-brand-400" />
            <span className="font-bold text-white">Express Delivery</span>
            <span className="text-[11px] text-slate-400">Real-time GPS dispatch</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white">Buyer Protection</span>
            <span className="text-[11px] text-slate-400">Guaranteed refunds & replacements</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <RefreshCw className="w-5 h-5 text-sky-400" />
            <span className="font-bold text-white">Easy Returns</span>
            <span className="text-[11px] text-slate-400">Hassle-free return pickups</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CreditCard className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-white">Encrypted Payments</span>
            <span className="text-[11px] text-slate-400">256-bit bank grade security</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-slate-800/80 py-4 text-center text-[11px] text-slate-500">
        <p>&copy; {new Date().getFullYear()} E Mart. Modern Enterprise Commerce System.</p>
      </div>
    </footer>
  );
}

export default Footer;
