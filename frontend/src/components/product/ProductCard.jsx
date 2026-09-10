import React from 'react';
import { Star, ShoppingCart, Eye, Tag } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

export function ProductCard({
  product = {
    id: 'prod-1',
    name: 'Wireless Noise Cancelling Headphones',
    price: 199.99,
    discountPrice: 149.99,
    category: 'Electronics',
    rating: 4.6,
    reviewCount: 320,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'],
    inventory: 15,
    seller: { name: 'AudioTech Store' },
    badgeText: 'Best Seller',
  },
  onAddToCart,
  onQuickView,
}) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Card isHoverable className="group flex flex-col h-full bg-white border border-slate-200">
      {/* Product Image Preview */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.images && product.images[0] ? product.images[0] : '/placeholder.jpg'}
          alt={product.name}
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badgeText && (
            <Badge variant="amber" size="sm">
              {product.badgeText}
            </Badge>
          )}
          {hasDiscount && (
            <Badge variant="danger" size="sm">
              -{discountPercent}% OFF
            </Badge>
          )}
        </div>

        {/* Quick View Floating Button */}
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            title="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product Information */}
      <Card.Body className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Seller */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="uppercase font-semibold tracking-wider text-slate-500">{product.category}</span>
            {product.seller?.name && (
              <span className="truncate max-w-[120px] text-slate-400">By {product.seller.name}</span>
            )}
          </div>

          {/* Product Title */}
          <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug hover:text-amber-600 transition-colors cursor-pointer">
            {product.name}
          </h4>

          {/* Star Ratings */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold text-slate-800 ml-1">{product.rating || '4.5'}</span>
            </div>
            <span className="text-[11px] text-slate-400">({product.reviewCount || 0})</span>
          </div>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900">
                ₹{hasDiscount ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>
            {product.inventory <= 5 && product.inventory > 0 && (
              <span className="text-[10px] text-rose-600 font-semibold block">Only {product.inventory} left in stock</span>
            )}
          </div>

          <Button
            variant="amber"
            size="sm"
            onClick={() => onAddToCart && onAddToCart(product)}
            leftIcon={<ShoppingCart className="w-3.5 h-3.5" />}
          >
            Add
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
