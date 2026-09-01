import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { SearchBar } from './SearchBar';
import { ApiDocsModal } from './ApiDocsModal';
import {
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Server,
  LogOut,
  ChevronDown,
  Sparkles,
  Package,
  Layers
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isProductsPage = location.pathname === '/products';

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-indigo-100/80 transition-all">
        {/* Top Banner */}
        <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" /> Special Launch:
          </span>
          <span>
            Use code <strong className="text-white font-bold tracking-wide">STOREX20</strong> for $20 off on orders over $80! Free shipping on orders $99+
          </span>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm group-hover:bg-indigo-700 transition-colors">
                X
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-indigo-600 group-hover:text-indigo-700 transition-colors">
                  Store<span className="text-slate-900">X</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'text-indigo-600 font-bold' : 'hover:text-indigo-600 text-slate-700 transition-colors'
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  isActive ? 'text-indigo-600 font-bold' : 'hover:text-indigo-600 text-slate-700 transition-colors'
                }
              >
                Catalog
              </NavLink>
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  isActive ? 'text-indigo-600 font-bold' : 'hover:text-indigo-600 text-slate-700 transition-colors'
                }
              >
                Orders
              </NavLink>
              <button
                onClick={() => setIsApiModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>REST API Live</span>
              </button>
            </nav>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:block flex-1 max-w-md mx-4">
            <SearchBar isStandalone={!isProductsPage} />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link
              to="/cart"
              id="navbar-cart-btn"
              className="relative p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl border border-indigo-100 transition-colors flex items-center justify-center"
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Account / Auth menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 border-2 border-indigo-500 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate text-xs font-bold text-slate-800">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border-2 border-indigo-50 py-2 z-40 text-xs font-medium">
                      <div className="px-4 py-2 border-b border-indigo-50">
                        <p className="font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-slate-500 text-[11px] truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-indigo-500" />
                        My Account & Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-rose-600 hover:bg-rose-50 transition-colors text-left font-semibold"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden px-4 pb-3 pt-1">
          <SearchBar isStandalone={!isProductsPage} />
        </div>

        {/* Mobile Dropdown Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800 hover:text-indigo-600"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800 hover:text-indigo-600"
            >
              All Products Catalog
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800 hover:text-indigo-600"
            >
              Shopping Cart ({totalItems})
            </Link>
            {isAuthenticated ? (
              <Link
                to="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-800 hover:text-indigo-600"
              >
                My Account & Past Orders
              </Link>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-bold text-slate-700 border border-slate-200 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl"
                >
                  Create Account
                </Link>
              </div>
            )}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsApiModalOpen(true);
                }}
                className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Server className="w-3.5 h-3.5" />
                View Full-Stack REST API & DB Docs
              </button>
            </div>
          </div>
        )}
      </header>

      <ApiDocsModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />
    </>
  );
};
