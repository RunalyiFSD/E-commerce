import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Shirt, Home, BookOpen, Sparkles, Dumbbell, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../../services/mockData';
import Card from '../common/Card';

const ICON_MAP = {
  Laptop,
  Shirt,
  Home,
  BookOpen,
  Sparkles,
  Dumbbell,
};

export function CategorySection() {
  return (
    <section className="mb-12 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-extrabold text-amber-600 tracking-wider">Browse Marketplace</span>
          <h2 className="text-2xl font-black text-slate-900 mt-0.5">Popular Departments</h2>
        </div>
        <Link
          to="/products"
          className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 hover:underline"
        >
          View All Departments <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Laptop;

          return (
            <Link key={cat.id} to={`/products?category=${encodeURIComponent(cat.name)}`}>
              <Card isHoverable className="group text-center p-4 bg-white border border-slate-200 h-full flex flex-col items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 group-hover:bg-amber-400/20 text-amber-600 flex items-center justify-center mb-3 transition-colors">
                  <Icon className="w-7 h-7 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{cat.itemCount} items</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default CategorySection;
