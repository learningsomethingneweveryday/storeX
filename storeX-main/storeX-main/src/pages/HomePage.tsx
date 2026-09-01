import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import { CATEGORIES } from '../data/sampleProducts';
import { ProductGrid } from '../components/ProductGrid';
import {
  ArrowRight,
  Sparkles,
  Headphones,
  Laptop,
  Watch,
  PlugZap,
  Home as HomeIcon,
  ShieldCheck,
  Zap,
  TrendingUp,
  Tag,
  Star
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { products } = await api.getProducts();
        setFeaturedProducts(products.filter(p => p.isFeatured).slice(0, 4));
        setNewArrivals(products.filter(p => p.isNew).slice(0, 4));
      } catch (err) {
        console.error('Failed to load homepage products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Headphones': return <Headphones className="w-6 h-6" />;
      case 'Laptop': return <Laptop className="w-6 h-6" />;
      case 'Watch': return <Watch className="w-6 h-6" />;
      case 'PlugZap': return <PlugZap className="w-6 h-6" />;
      case 'Home': return <HomeIcon className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Coupon code "${code}" copied to clipboard!`, 'success');
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Generation Tech Essentials</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Elevate Your Setup With <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">StoreX</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
              Explore our curated catalog of audiophile headphones, mechanical keyboards, titanium wearables, and studio accessories — backed by real REST APIs and rapid fulfillment.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/products"
                id="hero-explore-catalog-btn"
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 flex items-center gap-2"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products?category=Audio"
                className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm sm:text-base rounded-xl transition-colors"
              >
                Audio & ANC Gear
              </Link>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-8 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>2-Year Full Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>Free Express Shipping &gt;$99</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>4.8/5 Customer Rating</span>
              </div>
            </div>
          </div>

          {/* Hero Featured Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-2xl backdrop-blur-md group hover:border-indigo-500/50 transition-all duration-300">
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                BESTSELLER
              </div>

              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-900 mb-5 relative">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                  alt="AeroPulse Wireless Headphones"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold">
                  <span>PREMIUM AUDIO</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>4.8 (342 reviews)</span>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-white">AeroPulse ANC Headphones</h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  40-Hour Battery, Hybrid Active Noise Cancellation, and Titanium drivers.
                </p>

                <div className="pt-3 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-white">$199.99</span>
                    <span className="text-sm text-slate-400 line-through">$249.99</span>
                  </div>
                  <Link
                    to="/products/prod-1"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Browse by Category
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Explore devices built for creators, gamers, and modern productivity.
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
          >
            <span>All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={cat.id === 'All' ? '/products' : `/products?category=${encodeURIComponent(cat.id)}`}
              className="group bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col items-center text-center shadow-xs hover:border-indigo-300 hover:shadow-lg transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center mb-3 transition-colors duration-200">
                {getCategoryIcon(cat.icon)}
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h3>
              <span className="text-[11px] text-slate-400 mt-1 font-medium">
                {cat.count} items
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Highlights
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Top-rated hardware selected for build quality and performance.
              </p>
            </div>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex text-sm font-bold text-indigo-600 hover:text-indigo-700 items-center gap-1 hover:underline"
          >
            <span>View all products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} isLoading={isLoading} />
      </section>

      {/* Promo Coupon Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-indigo-700/50">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-indigo-200">
              <Tag className="w-3.5 h-3.5" />
              <span>Limited Time Capstone Special</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Get $20 Off Your First Order!
            </h3>
            <p className="text-slate-300 text-sm max-w-lg">
              Apply code <strong className="text-white">STOREX20</strong> at checkout on orders of $80 or more. Valid storewide.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
            <div className="px-4 py-2 bg-white text-indigo-950 font-mono font-extrabold text-lg rounded-xl tracking-wider select-all">
              STOREX20
            </div>
            <button
              onClick={() => copyCoupon('STOREX20')}
              className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md cursor-pointer"
            >
              Copy Code
            </button>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                New Arrivals
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Freshly stocked tech devices and peripherals.
              </p>
            </div>
          </div>
          <Link
            to="/products?sort=newest"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
          >
            <span>See newest</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={newArrivals} isLoading={isLoading} />
      </section>
    </div>
  );
};
