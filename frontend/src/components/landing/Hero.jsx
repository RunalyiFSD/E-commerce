import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Next-Gen Sound & Audio Innovations',
    subtitle: 'Save up to 30% on flagship noise-canceling headphones & sound systems.',
    badge: 'Deal of the Week',
    buttonText: 'Shop Electronics',
    link: '/products?category=Electronics',
    bgGradient: 'from-slate-950 via-indigo-950/80 to-slate-900',
    accentColor: 'text-brand-400',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  },
  {
    id: 2,
    title: 'Enterprise Computing & M3 Laptops',
    subtitle: 'Unmatched performance for creators, developers, and business teams.',
    badge: 'Top Tech Choice',
    buttonText: 'Discover Laptops',
    link: '/products?category=Electronics',
    bgGradient: 'from-slate-950 via-slate-900 to-indigo-950',
    accentColor: 'text-sky-400',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
  },
  {
    id: 3,
    title: 'Smart Home & Kitchen Essentials',
    subtitle: 'Elevate your daily living with bean-to-cup espresso and smart home gadgets.',
    badge: 'Trending Collection',
    buttonText: 'Explore Home',
    link: '/products?category=Home%20%26%20Kitchen',
    bgGradient: 'from-slate-900 via-violet-950 to-slate-950',
    accentColor: 'text-emerald-400',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl mb-12 border border-slate-800/80">
      {/* Background Gradient Layer */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} transition-all duration-700 opacity-95`} />

      {/* Decorative ambient blur rings */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Slide Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[420px]">
        {/* Left Text Banner */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2">
            <Badge variant="brand" size="md" showDot>
              {slide.badge}
            </Badge>
            <span className="text-xs text-slate-300 flex items-center gap-1 font-medium">
              <Zap className="w-3.5 h-3.5 text-brand-400" /> Fast Delivery
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {slide.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            {slide.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to={slide.link}>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50"
              >
                {slide.buttonText}
              </Button>
            </Link>
            <Link to="/products">
              <Button
                variant="outline"
                size="lg"
                className="text-white border-slate-700 hover:bg-white/10 hover:border-slate-500"
              >
                Browse Catalog
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Image Feature */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden glass-panel border border-white/20 shadow-2xl p-3 group">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-all opacity-80 hover:opacity-100 border border-slate-700/60"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-all opacity-80 hover:opacity-100 border border-slate-700/60"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === idx ? 'w-8 bg-brand-500' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Hero;
