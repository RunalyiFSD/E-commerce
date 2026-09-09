import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, LogOut, Package, ShieldCheck, Store, Menu } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import NotificationBell from '../common/NotificationBell';

export function Navbar({ user, cartCount = 0, wishlistCount = 0, onMobileMenuToggle }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&category=${category}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-amazon-blue text-white shadow-md">
      {/* Top Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Mobile Menu Button & Brand Logo */}
        <div className="flex items-center gap-3">
          {onMobileMenuToggle && (
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-black text-amber-400 tracking-tighter group-hover:text-amber-300 transition-colors">
              E-Commerce
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
              Enterprise
            </span>
          </Link>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl hidden md:flex items-center">
          <div className="relative flex w-full rounded-lg overflow-hidden border-2 border-amber-400/0 focus-within:border-amber-400 transition-all">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-100 text-slate-800 text-xs font-semibold px-3 border-r border-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Books">Books</option>
            </select>
            <input
              type="text"
              placeholder="Search products, brands, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-900 text-sm px-4 py-2 focus:outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-5 flex items-center justify-center transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 font-bold" />
            </button>
          </div>
        </form>

        {/* Right User Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Role Badge if Authenticated */}
          {user && (
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[11px] text-slate-400 leading-none">Signed in as</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs font-bold text-slate-200 truncate max-w-[100px]">
                  {user.name || user.email}
                </span>
                <Badge
                  variant={
                    user.role === 'ADMIN'
                      ? 'danger'
                      : user.role === 'SELLER'
                      ? 'amber'
                      : 'info'
                  }
                  size="sm"
                >
                  {user.role}
                </Badge>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <Link
            to="/wishlist"
            className="hidden sm:flex flex-col items-center text-slate-300 hover:text-white transition-colors relative"
            aria-label="Wishlist"
          >
            <div className="relative">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-900 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Wishlist</span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
            aria-label="Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6 group-hover:scale-105 transition-transform" />
              <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-900 font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            </div>
            <span className="hidden sm:inline text-xs font-bold text-slate-100">Cart</span>
          </Link>

          {/* Notification Bell for logged-in users */}
          {user && <NotificationBell />}

          {/* Dashboard Link / Login */}
          {user ? (
            <Link to="/dashboard">
              <Button variant="amber" size="sm">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="text-white border-slate-600 hover:bg-slate-800">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Sub-header Navigation Bar */}
      <div className="bg-amazon-light_blue px-4 sm:px-6 py-2 text-xs text-slate-300 flex items-center justify-between overflow-x-auto border-t border-slate-700/50">
        <div className="flex items-center gap-6 whitespace-nowrap">
          <Link to="/products" className="hover:text-amber-400 transition-colors font-medium">
            All Products
          </Link>
          <Link to="/products?category=Electronics" className="hover:text-amber-400 transition-colors">
            Electronics
          </Link>
          <Link to="/products?category=Fashion" className="hover:text-amber-400 transition-colors">
            Fashion
          </Link>
          <Link to="/products?category=Deals" className="text-amber-400 font-bold hover:underline">
            Today's Deals
          </Link>
          <Link to="/track-order" className="text-amber-300 hover:text-amber-400 font-semibold transition-colors flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-amber-400" />
            Track Order
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Guaranteed Secure Checkout
          </span>
          <span className="flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-amber-400" /> Historical Order Tracking
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
