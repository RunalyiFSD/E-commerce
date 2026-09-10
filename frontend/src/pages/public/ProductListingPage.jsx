import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Grid, List, Star, RotateCcw, X } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import EmptyState from '../../components/common/EmptyState';
import ToastProvider, { useToast } from '../../components/common/Toast';
import { PRODUCTS, CATEGORIES } from '../../services/mockData';
import { useCart } from '../../context/CartContext';

function ProductListingContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();
  const { addToCart } = useCart();

  const queryCategory = searchParams.get('category') || 'All';
  const querySearch = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState(queryCategory);
  const [searchQuery, setSearchQuery] = useState(querySearch);
  const [maxPrice, setMaxPrice] = useState(1500);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync category & search query from URL params when navigation occurs
  React.useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category'));
    }
    if (searchParams.get('q') !== null) {
      setSearchQuery(searchParams.get('q') || '');
    }
  }, [searchParams]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category & Today's Deals Filter
      if (selectedCategory === 'Deals' || selectedCategory === 'Today\'s Deals') {
        if (!p.isDeal && (!p.discountPrice || p.discountPrice >= p.price)) return false;
      } else if (selectedCategory !== 'All') {
        const catLower = selectedCategory.toLowerCase();
        const pCatLower = (p.category || '').toLowerCase();
        if (catLower === 'beauty' || catLower === 'beauty & care') {
          if (!pCatLower.includes('beauty')) return false;
        } else if (catLower === 'fashion') {
          if (!pCatLower.includes('fashion')) return false;
        } else if (catLower === 'electronics') {
          if (!pCatLower.includes('electronics')) return false;
        } else if (p.category !== selectedCategory) {
          return false;
        }
      }

      // Search Query Filter
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      // Max Price Filter
      const currentPrice = p.discountPrice || p.price;
      if (currentPrice > maxPrice) return false;
      // Min Rating Filter
      if (p.rating < minRating) return false;
      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // Default featured
    });
  }, [selectedCategory, searchQuery, maxPrice, minRating, sortBy]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    addToast({
      message: `Added "${product.name}" to cart`,
      type: 'success',
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMaxPrice(1500);
    setMinRating(0);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-xs uppercase font-extrabold text-brand-600 tracking-wider">Product Catalog</span>
            <h1 className="text-2xl font-black text-slate-900 mt-0.5">
              {selectedCategory !== 'All' ? selectedCategory : 'All Products'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing {filteredProducts.length} results
              {searchQuery && <span> for "<strong className="text-slate-800">{searchQuery}</strong>"</span>}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            {/* Sort Dropdown */}
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 text-xs font-semibold"
              containerClassName="w-44"
              placeholder=""
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </Select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block bg-white p-6 rounded-2xl border border-slate-200 space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xs uppercase font-extrabold text-slate-700 tracking-wider">Filter Products</h3>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-brand-600 font-bold hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Search Input */}
            <Input
              label="Keywords Search"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />

            {/* Categories list */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">Category</label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === 'All' ? 'bg-brand-50 text-brand-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat.name ? 'bg-brand-50 text-brand-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>Max Price:</span>
                <span className="font-extrabold text-slate-900">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="20"
                max="1500"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">Minimum Rating</label>
              <div className="space-y-1">
                {[4, 3, 2].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      minRating === stars ? 'bg-brand-50 text-brand-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{stars} Stars & Up</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Results Grid / Fallback Empty State */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
                <EmptyState
                  title="No Matching Products Found"
                  description="Try adjusting your filters or keyword search query."
                  action={
                    <Button variant="amber" size="sm" onClick={handleResetFilters}>
                      Reset Filters
                    </Button>
                  }
                />
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function ProductListingPage() {
  return (
    <ToastProvider>
      <ProductListingContent />
    </ToastProvider>
  );
}

export default ProductListingPage;
