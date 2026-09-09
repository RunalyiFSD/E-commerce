import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../../services/mockData';
import ProductCard from '../product/ProductCard';

export function FeaturedProducts({ onAddToCart }) {
  const featured = PRODUCTS.filter((p) => p.isFeatured);

  return (
    <section className="mb-12 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-extrabold text-amber-600 tracking-wider">Editor Picks</span>
          <h2 className="text-2xl font-black text-slate-900 mt-0.5">Featured Products</h2>
        </div>
        <Link
          to="/products"
          className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 hover:underline"
        >
          Explore All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
