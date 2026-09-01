import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order } from '../types';
import {
  User as UserIcon,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  LogOut,
  Calendar,
  CreditCard,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight,
  Search
} from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export const AccountPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderSearchId, setOrderSearchId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const userOrders = await api.getOrders();
        setOrders(userOrders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const handleLookupOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderSearchId.trim()) return;

    setSearchError(null);
    try {
      const ord = await api.getOrderById(orderSearchId.trim());
      setSearchedOrder(ord);
      showToast('Order retrieved successfully!', 'success');
    } catch (err: any) {
      setSearchError(err.message || 'No order found with this ID.');
      setSearchedOrder(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
            <Truck className="w-3.5 h-3.5" /> Shipped & In Transit
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Processing Dispatch
          </span>
        );
      case 'Confirmed':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            <Package className="w-3.5 h-3.5" /> Order Confirmed
          </span>
        );
    }
  };

  if (!isAuthenticated && !searchedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <UserIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Sign In to Your Account</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Please log in to view your complete order history, saved addresses, and profile details.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Guest Order Lookup */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Track a Guest Order</h3>
          <p className="text-xs text-slate-500">
            Placed an order without an account? Enter your Order ID (e.g. ORD-...) to view status.
          </p>

          <form onSubmit={handleLookupOrder} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearchId}
                onChange={e => setOrderSearchId(e.target.value)}
                placeholder="Enter Order ID (e.g. ORD-98124)"
                className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Look Up
            </button>
          </form>

          {searchError && (
            <p className="text-xs text-rose-600 font-semibold">{searchError}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Account Profile Header */}
      {user && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{user.name}</h1>
                <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full uppercase">
                  {user.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 hidden md:block text-right">
              <span>Security</span>
              <p className="font-semibold text-emerald-600 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> JWT Auth Active
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Orders List Container */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            <span>Order History ({orders.length})</span>
          </h2>
          <Link
            to="/products"
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            <span>Shop more</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="md" text="Loading order history..." />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Orders Found Yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              You haven't placed any orders with this account. Browse our catalog to place your first simulated order!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(ord => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-indigo-200 transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Order Placed</span>
                      <span className="font-bold text-slate-800">
                        {new Date(ord.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Total Paid</span>
                      <span className="font-extrabold text-slate-900">${ord.totalAmount.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Order #</span>
                      <span className="font-mono font-bold text-indigo-600">{ord.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(ord.status)}
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      View Receipt
                    </button>
                  </div>
                </div>

                {/* Items in order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0 border border-slate-200">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                        <p className="text-[11px] text-slate-400">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Order Details</h3>
                <p className="text-xs font-mono text-indigo-600 font-bold">{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Tracking Progress */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Shipping Status</span>
                <span>{getStatusBadge(selectedOrder.status)}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all"
                  style={{
                    width:
                      selectedOrder.status === 'Delivered'
                        ? '100%'
                        : selectedOrder.status === 'Shipped'
                        ? '70%'
                        : '35%'
                  }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Items in this shipment</h4>
              <div className="divide-y divide-slate-100">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-slate-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-1 text-slate-600">
              <span className="font-bold text-slate-900 block mb-1">Destination Address</span>
              <p>{selectedOrder.shippingAddress.fullName}</p>
              <p>{selectedOrder.shippingAddress.addressLine1}</p>
              <p>
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                {selectedOrder.shippingAddress.postalCode}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
