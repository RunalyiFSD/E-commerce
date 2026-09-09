import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Hero from '../../components/landing/Hero';
import CategorySection from '../../components/landing/CategorySection';
import Deals from '../../components/landing/Deals';
import FeaturedProducts from '../../components/landing/FeaturedProducts';
import BestSellers from '../../components/landing/BestSellers';
import Benefits from '../../components/landing/Benefits';
import ToastProvider, { useToast } from '../../components/common/Toast';

function LandingPageContent() {
  const { addToast } = useToast();
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = (product) => {
    setCartCount((prev) => prev + 1);
    addToast({
      message: `Added "${product.name}" to cart!`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar cartCount={cartCount} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <Hero />
        <CategorySection />
        <Deals onAddToCart={handleAddToCart} />
        <FeaturedProducts onAddToCart={handleAddToCart} />
        <BestSellers onAddToCart={handleAddToCart} />
        <Benefits />
      </main>

      <Footer />
    </div>
  );
}

export function LandingPage() {
  return (
    <ToastProvider>
      <LandingPageContent />
    </ToastProvider>
  );
}

export default LandingPage;
