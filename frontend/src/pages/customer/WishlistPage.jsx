import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Star, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export function WishlistPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 'p1',
      name: 'Wireless Noise Canceling Headphones Pro',
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.8,
      reviewCount: 342,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      category: 'Electronics',
    },
    {
      id: 'p2',
      name: 'Ergonomic Executive Leather Gaming Chair',
      price: 149.50,
      originalPrice: 189.00,
      rating: 4.6,
      reviewCount: 128,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=500&q=80',
      category: 'Furniture',
    },
    {
      id: 'p3',
      name: 'Ultra-Slim Mechanical Wireless Keyboard',
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.9,
      reviewCount: 512,
      inStock: false,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
      category: 'Electronics',
    },
  ]);

  const handleRemove = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar user={user} wishlistCount={wishlistItems.length} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">My Wishlist</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl">
                <Heart className="w-6 h-6 fill-rose-500" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Saved Items & Wishlist</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Keep track of products you love and move them to cart anytime.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="amber" size="md">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} Saved
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
            <EmptyState
              title="Your Wishlist is Empty"
              message="You haven't saved any items yet. Explore our top products and save your favorites!"
              actionLabel="Discover Products"
              onAction={() => navigate('/products')}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100 group">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all shadow-xs"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute top-3 left-3">
                    <Badge variant="info" size="xs">
                      {item.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 line-clamp-2 text-sm hover:text-amber-600 transition-colors cursor-pointer" onClick={() => navigate(`/products/${item.id}`)}>
                      {item.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex items-center text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="text-xs font-bold text-slate-800 ml-1">{item.rating}</span>
                      </div>
                      <span className="text-xs text-slate-400">({item.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-lg font-black text-slate-900">₹{item.price.toFixed(2)}</span>
                        {item.originalPrice > item.price && (
                          <span className="text-xs text-slate-400 line-through ml-2">
                            ₹{item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Badge variant={item.inStock ? 'success' : 'danger'} size="xs">
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>

                    <Button
                      variant="amber"
                      size="sm"
                      className="w-full justify-center"
                      disabled={!item.inStock}
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default WishlistPage;
