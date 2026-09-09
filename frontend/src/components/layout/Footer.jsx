import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-amazon-blue text-slate-300 text-xs mt-auto border-t border-slate-800">
      {/* Back to top banner */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full bg-amazon-light_blue hover:bg-slate-700 py-3 text-center text-slate-200 font-semibold text-xs transition-colors border-b border-slate-700"
      >
        Back to top
      </button>

      {/* Main Footer Links Container */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-sm font-bold text-white mb-3 tracking-wide uppercase">Get to Know Us</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:underline hover:text-white">About Marketplace</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white">Careers</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white">Press Releases</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white">Enterprise Science</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white mb-3 tracking-wide uppercase">Make Money with Us</h3>
          <ul className="space-y-2">
            <li><Link to="/register?role=SELLER" className="hover:underline hover:text-amber-400 font-semibold">Sell on E-Commerce Marketplace</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white">Sell under Accelerator</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white">Protect & Build Your Brand</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white">Fulfillment Logistics</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white mb-3 tracking-wide uppercase">Payment & Security</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:underline hover:text-white">E-Commerce Business Card</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white">Shop with Points</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white">Reload Your Balance</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white">Currency Converter</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white mb-3 tracking-wide uppercase">Let Us Help You</h3>
          <ul className="space-y-2">
            <li><Link to="/dashboard/customer/orders" className="hover:underline hover:text-white">Your Account & Orders</Link></li>
            <li><Link to="/dashboard/customer/deliveries" className="hover:underline hover:text-white">Shipping Rates & Policies</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white">Returns & Replacements</Link></li>
            <li><Link to="/" className="hover:underline hover:text-white">Customer Service Assistant</Link></li>
          </ul>
        </div>
      </div>

      {/* Feature Badges Banner */}
      <div className="border-t border-slate-800 bg-slate-900/60 py-6 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <Truck className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-white">Fast Delivery</span>
            <span className="text-[11px] text-slate-400">Track shipments step-by-step</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white">Buyer Protection</span>
            <span className="text-[11px] text-slate-400">Secure transactions guaranteed</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <RefreshCw className="w-5 h-5 text-sky-400" />
            <span className="font-bold text-white">Easy Returns</span>
            <span className="text-[11px] text-slate-400">Eligible refund lifecycle</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CreditCard className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-white">Encrypted Payments</span>
            <span className="text-[11px] text-slate-400">PCI-DSS compliant standards</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-slate-800/80 py-4 text-center text-[11px] text-slate-500">
        <p>&copy; {new Date().getFullYear()} E-Commerce Platform. Built for Production Enterprise Standards.</p>
      </div>
    </footer>
  );
}

export default Footer;
