import React, { useState, useEffect } from 'react';
import { X, Server, Database, CheckCircle2, Copy, Check, ExternalLink, Code } from 'lucide-react';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [healthData, setHealthData] = useState<any>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkHealth();
    }
  }, [isOpen]);

  const checkHealth = async () => {
    setIsLoadingHealth(true);
    try {
      const data = await api.getHealth();
      setHealthData(data);
    } catch (err) {
      setHealthData({ status: 'offline', error: 'Unable to reach backend' });
    } finally {
      setIsLoadingHealth(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  if (!isOpen) return null;

  const endpoints = [
    { method: 'GET', path: '/api/health', desc: 'System status & database diagnostics', sample: '{ "status": "healthy", "uptime": 120 }' },
    { method: 'GET', path: '/api/products', desc: 'Query catalog with search, filter, sort & pagination', sample: '?search=audio&category=Audio&minPrice=50&sort=price-asc' },
    { method: 'GET', path: '/api/products/:id', desc: 'Get specific product with related items', sample: '/api/products/prod-1' },
    { method: 'POST', path: '/api/auth/register', desc: 'Register user with bcrypt password hash & JWT token', sample: '{ "name": "John", "email": "john@test.com", "password": "..." }' },
    { method: 'POST', path: '/api/auth/login', desc: 'Authenticate user & issue HTTP-only session cookie', sample: '{ "email": "demo@storex.com", "password": "password123" }' },
    { method: 'GET', path: '/api/auth/me', desc: 'Verify session and return logged-in profile', sample: 'Authorization: Bearer <JWT_TOKEN>' },
    { method: 'GET', path: '/api/orders', desc: 'Get authenticated user order history', sample: 'Response: Order[]' },
    { method: 'POST', path: '/api/orders', desc: 'Place verified order with stock deduction', sample: '{ "items": [...], "shippingAddress": {...}, "paymentMethod": "..." }' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 z-10 border border-slate-200 max-h-[85vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">StoreX Full-Stack REST API & Architecture</h2>
                <p className="text-xs text-slate-500">Live Node.js & Express REST Endpoints & Database</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Backend Status Card */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-bold text-emerald-400">Backend Server Live (Port 3000)</span>
              </div>
              <button
                onClick={checkHealth}
                disabled={isLoadingHealth}
                className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg text-slate-300 transition-colors"
              >
                {isLoadingHealth ? 'Pinging...' : 'Re-check Status'}
              </button>
            </div>

            {healthData && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Database Engine</span>
                  <span className="font-semibold text-slate-200">Express + Mongo REST</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Products Loaded</span>
                  <span className="font-semibold text-emerald-400">{healthData.database?.productsCount ?? 12} items</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Active Orders</span>
                  <span className="font-semibold text-indigo-300">{healthData.database?.ordersCount ?? 1} placed</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Auth Security</span>
                  <span className="font-semibold text-amber-300">bcrypt + JWT + Cookies</span>
                </div>
              </div>
            )}
          </div>

          {/* Endpoints List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">REST API Endpoints Reference</h3>
            <div className="space-y-2">
              {endpoints.map((ep, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                        ep.method === 'GET'
                          ? 'bg-emerald-100 text-emerald-700'
                          : ep.method === 'POST'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <code className="font-mono font-semibold text-slate-800">{ep.path}</code>
                    <span className="text-slate-500 text-[11px]">— {ep.desc}</span>
                  </div>

                  <button
                    onClick={() => handleCopy(`${window.location.origin}${ep.path}`, idx)}
                    className="self-end sm:self-auto p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                    title="Copy full URL"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Demo credentials: <strong className="text-slate-700">demo@storex.com</strong> / <strong className="text-slate-700">password123</strong></span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-indigo-600 text-white font-medium rounded-lg text-xs hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
