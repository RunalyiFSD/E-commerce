import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, LogOut, Package, ShieldCheck, Store, Menu } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import NotificationBell from '../common/NotificationBell';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export function Navbar({ user: userProp, cartCount = 0, wishlistCount = 0, onMobileMenuToggle }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const { user: authUser, logout } = useAuth();
  const user = userProp || authUser;
  const navigate = useNavigate();

  const cartContext = useCart();
  const authContext = useAuth();

  const currentUser = user !== undefined ? user : authContext?.user;
  const currentCartCount = cartCount !== undefined ? cartCount : (cartContext?.itemCount ?? 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&category=${category}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl text-white shadow-xl border-b border-slate-800/80">
      {/* Top Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Mobile Menu Button & Brand Logo */}
        <div className="flex items-center gap-3">
          {onMobileMenuToggle && (
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-850"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-black text-lg tracking-tighter">E</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 tracking-tight leading-none group-hover:to-brand-300 transition-colors">
                E Mart
              </span>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-indigo-400">
                Marketplace
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl hidden md:flex items-center">
          <div className="relative flex w-full rounded-xl overflow-hidden bg-slate-900/90 border border-slate-700/80 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30 transition-all shadow-inner">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-850 text-slate-300 text-xs font-semibold px-3 py-2 border-r border-slate-700 focus:outline-none cursor-pointer hover:bg-slate-800"
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
              className="w-full bg-transparent text-white text-sm px-4 py-2 focus:outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white px-5 flex items-center justify-center transition-all shadow-sm active:scale-95"
              aria-label="Search"
            >
              <Search className="w-4 h-4 font-bold" />
            </button>
          </div>
        </form>

        {/* Right User Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Role Badge if Authenticated */}
          {currentUser && (
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] text-slate-400 leading-none">Signed in as</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-bold text-slate-200 truncate max-w-[110px]">
                  {currentUser.name || currentUser.email}
                </span>
                <Badge
                  variant={
                    currentUser.role === 'ADMIN'
                      ? 'danger'
                      : currentUser.role === 'SELLER'
                      ? 'brand'
                      : 'info'
                  }
                  size="sm"
                >
                  {currentUser.role}
                </Badge>
              </div>
            </div>
          )}

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="hidden sm:flex flex-col items-center text-slate-300 hover:text-white transition-colors relative p-1 rounded-lg hover:bg-slate-900"
            aria-label="Wishlist"
          >
            <div className="relative">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-brand-500 to-indigo-500 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Wishlist</span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group p-1.5 rounded-xl hover:bg-slate-900"
            aria-label="Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 group-hover:scale-105 transition-transform text-slate-200" />
              <span className="absolute -top-2 -right-2.5 bg-gradient-to-r from-brand-600 to-indigo-500 text-white font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-brand-500/30">
                {currentCartCount}
              </span>
            </div>
            <span className="hidden sm:inline text-xs font-bold text-slate-200">Cart</span>
          </Link>

          {/* Notification Bell */}
          {currentUser && <NotificationBell />}

          {/* Dashboard Link & Log Out / Sign In */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button variant="amber" size="sm">
                  Dashboard
                </Button>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-slate-300 hover:text-red-400 hover:bg-slate-800/80 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="text-white border-slate-700 hover:bg-slate-900 hover:border-slate-600">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Sub-header Navigation Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-2 text-xs text-slate-300 flex items-center justify-between overflow-x-auto border-t border-slate-800/80">
        <div className="flex items-center gap-6 whitespace-nowrap">
          <Link to="/products" className="hover:text-brand-400 transition-colors font-medium">
            All Products
          </Link>
          <Link to="/products?category=Electronics" className="hover:text-brand-400 transition-colors">
            Electronics
          </Link>
          <Link to="/products?category=Fashion" className="hover:text-brand-400 transition-colors">
            Fashion
          </Link>
          <Link to="/products?category=Beauty%20%26%20Care" className="hover:text-amber-400 transition-colors">
            Beauty & Care
          </Link>
          <Link to="/products?category=Deals" className="text-amber-400 font-bold hover:underline">
            Today's Deals
          </Link>
          <Link to="/track-order" className="text-slate-300 hover:text-brand-400 font-medium transition-colors flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-brand-400" />
            Track Order
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-5 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Guaranteed Secure Checkout
          </span>
          <span className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-indigo-400" /> Historical Order Tracking
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
