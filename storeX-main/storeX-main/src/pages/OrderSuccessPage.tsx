import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Order } from '../types';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CreditCard,
  MapPin
} from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti not available:', e);
    }

    const loadOrder = async () => {
      if (!id) return;
      try {
        const data = await api.getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <LoadingSpinner size="lg" text="Retrieving your order confirmation..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h2>
        <p className="text-slate-500 text-sm mb-6">
          Your order has been recorded successfully. Check your account order history for updates.
        </p>
        <Link
          to="/products"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors inline-block"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Hero Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
          Payment Confirmed
        </span>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Thank you for your order!
        </h1>

        <p className="text-slate-500 text-sm max-w-md mx-auto">
          We've received your order and are preparing your shipment. A confirmation email has been simulated to{' '}
          <strong className="text-slate-800 font-bold">{order.customerEmail}</strong>.
        </p>

        <div className="inline-flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono">
          <span className="text-slate-500">Order ID:</span>
          <span className="font-extrabold text-indigo-600 text-sm">{order.id}</span>
        </div>
      </div>

      {/* Itemized Receipt & Delivery Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Item Details */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-base">Ordered Items ({order.items.length})</h2>
            <button
              onClick={handlePrint}
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
          </div>

          <div className="space-y-4 divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="pt-4 first:pt-0 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                  <p className="text-xs text-slate-400">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                </div>
                <span className="font-extrabold text-slate-900 text-sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-bold text-slate-900">
                {order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee.toFixed(2)}`}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount Applied</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-sm">
              <span className="font-bold text-slate-900">Total Paid</span>
              <span className="text-2xl font-black text-slate-900">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Shipping & Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100 flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>Delivery Status</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Estimated Arrival</span>
                <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Ship To</span>
                <p className="font-semibold text-slate-800 mt-0.5">{order.shippingAddress.fullName}</p>
                <p className="text-slate-600">{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p className="text-slate-600">{order.shippingAddress.addressLine2}</p>
                )}
                <p className="text-slate-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p className="text-slate-600">{order.shippingAddress.country}</p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[11px]">Payment Method</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  {order.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/account"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-2xl transition-colors text-center shadow-xs"
            >
              View Order History in Account
            </Link>
            <Link
              to="/products"
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-colors text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
