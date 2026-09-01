import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShieldCheck, Truck, RotateCcw, Headphones, Heart, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setIsSubscribed(true);
    showToast('Thank you for subscribing! Check your inbox for your 10% coupon.', 'success');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-20">
      {/* Value Proposition Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 sm:p-8 bg-slate-800/50 rounded-3xl border border-slate-700/60 backdrop-blur-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Free Express Shipping</h4>
              <p className="text-xs text-slate-400">On all orders over $99</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">2-Year Full Warranty</h4>
              <p className="text-xs text-slate-400">100% replacement guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">30-Day Hassle-Free Returns</h4>
              <p className="text-xs text-slate-400">Instant full refunds</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">24/7 Priority Support</h4>
              <p className="text-xs text-slate-400">Expert human support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
        {/* Brand */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Package className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Store<span className="text-indigo-400">X</span>
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
            StoreX is a high-performance, full-stack E-Commerce product catalog built with React, Vite, Tailwind CSS, and a RESTful Node/Express backend.
          </p>
          <div className="text-xs text-slate-500 pt-2">
            REST API: <code className="text-indigo-400 font-mono">/api/products</code> • <code className="text-indigo-400 font-mono">/api/auth</code> • <code className="text-indigo-400 font-mono">/api/orders</code>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Categories</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/products?category=Audio" className="hover:text-white transition-colors">Audio & Sound</Link></li>
            <li><Link to="/products?category=Computing" className="hover:text-white transition-colors">Computing & Laptops</Link></li>
            <li><Link to="/products?category=Wearables" className="hover:text-white transition-colors">Smart Watches</Link></li>
            <li><Link to="/products?category=Accessories" className="hover:text-white transition-colors">Accessories & Hubs</Link></li>
            <li><Link to="/products?category=Smart%20Home" className="hover:text-white transition-colors">Smart Home Tech</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/products" className="hover:text-white transition-colors">Browse Catalog</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
            <li><Link to="/account" className="hover:text-white transition-colors">Order History</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Customer Login</Link></li>
            <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Stay Updated</h4>
          <p className="text-xs text-slate-400">
            Subscribe for exclusive discounts, new product arrivals, and tech reviews.
          </p>
          {isSubscribed ? (
            <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-400 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Subscribed! Use code <strong>WELCOME10</strong> for 10% off.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2 text-xs bg-slate-800 border border-slate-700 text-white rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
              >
                Join StoreX Club
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 StoreX Capstone E-Commerce Inc. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span>Production-Ready REST Architecture</span>
          <span>•</span>
          <span>React 19 + Vite + Express + MongoDB Schema</span>
        </div>
      </div>
    </footer>
  );
};
