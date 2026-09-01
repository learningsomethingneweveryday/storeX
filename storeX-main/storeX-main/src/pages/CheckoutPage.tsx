import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { ShippingAddress } from '../types';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Building2,
  Wallet
} from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, shippingFee, discount, totalAmount, clearCart, appliedPromo } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'PayPal' | 'UPI / NetBanking' | 'Cash on Delivery'>('Credit Card');

  // Form State
  const [formData, setFormData] = useState<ShippingAddress & { email: string }>({
    fullName: user?.name || 'Alex Johnson',
    email: user?.email || 'alex.johnson@example.com',
    addressLine1: '742 Evergreen Terrace',
    addressLine2: 'Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94107',
    country: 'United States',
    phone: '+1 (555) 234-5678'
  });

  // Simulated card fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Items in Cart</h2>
          <p className="text-slate-500 text-sm mb-6">Please add items to your cart before proceeding to checkout.</p>
          <Link
            to="/products"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors inline-block"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const expressExtraFee = shippingMethod === 'express' ? 14.99 : 0;
  const finalCalculatedTotal = Math.max(0, totalAmount + expressExtraFee);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.addressLine1.trim() || !formData.city.trim()) {
      showToast('Please fill in all required shipping address fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: cart.map(i => ({
          productId: i.product.id,
          quantity: i.quantity
        })),
        shippingAddress: {
          fullName: formData.fullName,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        },
        paymentMethod,
        discount,
        shippingFee: shippingFee + expressExtraFee,
        customerEmail: formData.email
      };

      const createdOrder = await api.createOrder(orderPayload);
      clearCart();
      showToast('Order confirmed successfully!', 'success');
      navigate(`/order-success/${createdOrder.id}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete your shipping and payment details to finalize your order.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Columns: Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Shipping Address */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h2 className="text-lg font-bold text-slate-900">Shipping Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Street Address *</label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  required
                  placeholder="123 Innovation Way"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Apartment / Suite</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  placeholder="Suite 400 (Optional)"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="San Francisco"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    placeholder="CA"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ZIP *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    placeholder="94107"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Speed */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h2 className="text-lg font-bold text-slate-900">Delivery Speed</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setShippingMethod('standard')}
                className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  shippingMethod === 'standard'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Standard Delivery</h4>
                    <p className="text-xs text-slate-500 mt-0.5">3-5 business days</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </span>
              </label>

              <label
                onClick={() => setShippingMethod('express')}
                className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  shippingMethod === 'express'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Express Next-Day</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Guaranteed 24-48h dispatch</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600">+$14.99</span>
              </label>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h2 className="text-lg font-bold text-slate-900">Payment Option</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {(['Credit Card', 'PayPal', 'UPI / NetBanking', 'Cash on Delivery'] as const).map(method => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === method
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {method === 'Credit Card' && <CreditCard className="w-4 h-4" />}
                  {method === 'PayPal' && <Wallet className="w-4 h-4" />}
                  {method === 'UPI / NetBanking' && <Building2 className="w-4 h-4" />}
                  {method === 'Cash on Delivery' && <Truck className="w-4 h-4" />}
                  <span>{method}</span>
                </button>
              ))}
            </div>

            {paymentMethod === 'Credit Card' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                  <span>Simulated Card Details</span>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <Lock className="w-3.5 h-3.5" />
                    <span>256-Bit SSL</span>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Expires (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Checkout Summary & Place Order */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-md space-y-6">
            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
              Order Review ({cart.reduce((a, b) => a + b.quantity, 0)} items)
            </h3>

            {/* Items mini list */}
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-3 text-xs">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{item.product.name}</p>
                    <p className="text-slate-400 text-[11px]">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-slate-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-slate-800">
                  {shippingFee + expressExtraFee === 0 ? 'FREE' : `$${(shippingFee + expressExtraFee).toFixed(2)}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({appliedPromo?.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-sm">
                <span className="font-bold text-slate-900">Total Payable</span>
                <span className="text-2xl font-black text-slate-900">
                  ${finalCalculatedTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              id="checkout-place-order-btn"
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" className="p-0 text-white" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Verified Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-slate-400">
              By placing your order, you agree to StoreX terms of service and simulated checkout policies.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
