import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, ShoppingCart, Zap, Store, ArrowLeft, Check, Heart, Share2 } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import ToastProvider, { useToast } from '../../components/common/Toast';
import { PRODUCTS } from '../../services/mockData';
import { useCart } from '../../context/CartContext';

function ProductDetailContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { addToCart } = useCart();

  // Find product by id or default to first product
  const product = PRODUCTS.find((p) => p.id === id || p.slug === id) || PRODUCTS[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    addToast({
      message: `Added ${quantity} x "${product.name}" to cart!`,
      type: 'success',
    });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Back Link Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link to="/products" className="text-xs font-bold text-slate-600 hover:text-brand-600 flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
          </Link>

          <span className="text-xs text-slate-400">SKU: <strong className="font-mono text-slate-700">{product.SKU}</strong></span>
        </div>

        {/* Top Product Overview Grid */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-4/3 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-6">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="object-contain w-full h-full"
              />
              {product.badgeText && (
                <div className="absolute top-4 left-4">
                  <Badge variant="brand" size="md">{product.badgeText}</Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-slate-50 transition-all p-1 ${
                      activeImageIndex === idx ? 'border-brand-500 ring-2 ring-brand-500/20 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title, Ratings, Pricing, Buy Controls */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div>
              {/* Category & Seller Tag */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="uppercase font-bold tracking-wider text-brand-600">{product.category}</span>
                <span className="flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-slate-400" /> Sold by <strong className="text-slate-800">{product.seller?.name}</strong>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-300'}`}
                    />
                  ))}
                  <span className="text-sm font-extrabold text-slate-900 ml-2">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-400">&bull; {product.reviewCount} customer reviews</span>
              </div>

              {/* Price Banner */}
              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">
                  ₹{hasDiscount ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-sm text-slate-400 line-through">₹{product.price.toFixed(2)}</span>
                    <Badge variant="danger" size="sm">Save {discountPercent}%</Badge>
                  </>
                )}
              </div>

              <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Actions & Inventory */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="text-xs">
                  {product.inventory > 0 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> In Stock ({product.inventory} available)
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold">Out of Stock</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  leftIcon={<ShoppingCart className="w-5 h-5" />}
                  className="flex-1 font-bold shadow-md shadow-brand-500/20"
                >
                  Add to Cart
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleBuyNow}
                  leftIcon={<Zap className="w-5 h-5" />}
                  className="flex-1 font-bold"
                >
                  Buy Now
                </Button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-2">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-brand-600" /> Free Shipping Eligible
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> 30-Day Buyer Guarantee
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Detail Tabs */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="text-base font-black text-slate-900">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.specifications?.map((spec, idx) => (
              <div key={idx} className="flex justify-between py-2.5 px-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <span className="font-semibold text-slate-600">{spec.key}</span>
                <span className="font-bold text-slate-900">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function ProductDetailPage() {
  return (
    <ToastProvider>
      <ProductDetailContent />
    </ToastProvider>
  );
}

export default ProductDetailPage;
