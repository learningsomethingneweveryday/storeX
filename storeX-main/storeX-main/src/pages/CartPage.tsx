import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/CartItem';
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Tag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    totalItems,
    subtotal,
    shippingFee,
    discount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    totalAmount,
    clearCart,
    freeShippingThreshold,
    remainingForFreeShipping
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setPromoError(null);
    const result = applyPromoCode(promoInput);
    if (result.success) {
      setPromoInput('');
    } else {
      setPromoError(result.message);
    }
  };

  const freeShippingPercentage = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 shadow-xs flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Your Shopping Cart is Empty
          </h1>
          <p className="text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">
            Looks like you haven't added any products to your cart yet. Explore our top gear and audio peripherals!
          </p>
          <Link
            to="/products"
            id="cart-empty-browse-btn"
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <span>Browse Products Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            You have <strong className="text-slate-900 font-bold">{totalItems}</strong> item{totalItems !== 1 ? 's' : ''} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1.5 self-start sm:self-auto hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-950">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>
                  {remainingForFreeShipping === 0 ? (
                    <strong className="text-emerald-700 font-bold">You unlocked FREE Express Shipping!</strong>
                  ) : (
                    <>
                      Add <strong className="text-indigo-700">${remainingForFreeShipping.toFixed(2)}</strong> more to get <strong className="text-indigo-700">FREE Shipping</strong>!
                    </>
                  )}
                </span>
              </div>
              <span>{freeShippingPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-indigo-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${freeShippingPercentage}%` }}
              />
            </div>
          </div>

          {/* List of items */}
          <div className="space-y-3">
            {cart.map(item => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Link
              to="/products"
              className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-md space-y-6">
            <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  Shipping Fee
                  {shippingFee === 0 && <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 rounded">FREE</span>}
                </span>
                <span className="font-semibold text-slate-900">
                  {shippingFee === 0 ? '$0.00' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({appliedPromo?.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-900">Estimated Total</span>
                <span className="text-2xl font-black text-slate-900">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Coupon Promo Input */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Promo Code</label>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">{appliedPromo.code}</span>
                    <span className="text-emerald-700 font-normal">({appliedPromo.description})</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="p-1 hover:bg-emerald-100 rounded-md text-emerald-700"
                    title="Remove coupon"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value)}
                      placeholder="Try STOREX20 or WELCOME10"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase placeholder:normal-case focus:bg-white outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-rose-500 font-medium">{promoError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => navigate('/checkout')}
              id="proceed-to-checkout-btn"
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="pt-2 text-center space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>256-Bit SSL End-to-End Encrypted Checkout</span>
              </div>
              <p>Simulated secure ordering environment for testing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
