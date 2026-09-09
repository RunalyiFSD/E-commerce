import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../context/CartContext';
import ToastProvider, { useToast } from '../../components/common/Toast';

function CartPageContent() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountTotal,
    netSubtotal,
    shippingCost,
    taxEstimate,
    grandTotal,
    itemCount,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SAVE10') {
      setAppliedPromo({ code: 'SAVE10', discount: 10 });
      addToast({ message: 'Promo code SAVE10 applied! ₹10 discount saved.', type: 'success' });
    } else {
      addToast({ message: 'Invalid promo code. Try "SAVE10"', type: 'error' });
    }
  };

  const finalGrandTotal = Math.max(0, grandTotal - (appliedPromo ? appliedPromo.discount : 0));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar cartCount={itemCount} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase font-extrabold text-brand-600 tracking-wider">Shopping Basket</span>
            <h1 className="text-2xl font-black text-slate-900 mt-0.5">Your Cart ({itemCount} items)</h1>
          </div>

          <Link to="/products" className="text-xs font-bold text-slate-600 hover:text-brand-600 flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
            <EmptyState
              icon={ShoppingCart}
              title="Your Shopping Cart is empty"
              description="Discover thousands of deals and top-rated products waiting for you."
              action={
                <Link to="/products">
                  <Button variant="primary" size="lg" className="font-bold shadow-md shadow-brand-500/25">
                    Explore Today's Deals
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map(({ product, quantity }) => {
                const effectivePrice = product.discountPrice || product.price;

                return (
                  <Card key={product.id || product._id} className="p-5 bg-white border border-slate-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Image & Title */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-2">
                          <img
                            src={product.images && product.images[0] ? product.images[0] : '/placeholder.jpg'}
                            alt={product.name}
                            className="object-contain w-full h-full"
                          />
                        </div>

                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-bold text-brand-600">{product.category}</span>
                          <h3 className="text-sm font-bold text-slate-900 truncate line-clamp-1">{product.name}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Sold by <strong className="text-slate-700">{product.seller?.name || 'Authorized Store'}</strong>
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-base font-extrabold text-slate-900">₹{effectivePrice.toFixed(2)}</span>
                            {product.discountPrice && (
                              <span className="text-xs text-slate-400 line-through">₹{product.price.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Controls & Total */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {/* Quantity Controller */}
                        <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                          <button
                            onClick={() => updateQuantity(product.id || product._id, quantity - 1)}
                            className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-xs font-bold text-slate-900">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id || product._id, quantity + 1)}
                            className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                          >
                            +
                          </button>
                        </div>

                        {/* Line Total & Delete */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-extrabold text-slate-900 min-w-[70px] text-right">
                            ₹{(effectivePrice * quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(product.id || product._id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 sticky top-24">
              <h2 className="text-sm uppercase font-extrabold text-slate-700 tracking-wider pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              {/* Price Metrics */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
                </div>

                {discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount Savings</span>
                    <span>-₹{discountTotal.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    <span className="font-semibold text-slate-900">₹{shippingCost.toFixed(2)}</span>
                  )}
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-slate-900">₹{taxEstimate.toFixed(2)}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-brand-700 font-bold pt-1">
                    <span>Promo ({appliedPromo.code})</span>
                    <span>-₹{appliedPromo.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total Order Amount</span>
                  <span className="text-xl font-black text-slate-900">₹{finalGrandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <Input
                  placeholder="Promo code (SAVE10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="py-1.5 text-xs"
                />
                <Button type="submit" variant="secondary" size="sm">
                  Apply
                </Button>
              </form>

              {/* Checkout Action Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/checkout')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full font-bold shadow-md shadow-brand-500/25"
              >
                Proceed to Checkout
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Encrypted PCI-DSS Payment Checkout</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export function CartPage() {
  return (
    <ToastProvider>
      <CartPageContent />
    </ToastProvider>
  );
}

export default CartPage;
