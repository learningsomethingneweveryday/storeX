import React from 'react';
import { CartItem as CartItemType } from '../types';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const itemTotal = product.price * quantity;

  return (
    <div
      id={`cart-item-${product.id}`}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors"
    >
      {/* Thumbnail + Details */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Link
          to={`/products/${product.id}`}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100"
        >
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider mb-0.5">
            {product.category}
          </span>
          <Link
            to={`/products/${product.id}`}
            className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate mb-1"
          >
            {product.name}
          </Link>
          <div className="flex items-baseline gap-2 text-xs text-slate-500">
            <span>Unit Price:</span>
            <span className="font-bold text-slate-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="line-through text-slate-400">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {product.stock <= 5 && (
            <span className="text-[11px] text-amber-600 font-medium mt-1">
              Only {product.stock} left in stock!
            </span>
          )}
        </div>
      </div>

      {/* Quantity Controls & Item Subtotal */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        {/* Stepper */}
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            aria-label="Decrease quantity"
            className="p-2 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-30"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs sm:text-sm font-bold text-slate-900 bg-white min-w-[2rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            disabled={quantity >= product.stock}
            aria-label="Increase quantity"
            className="p-2 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-30"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Total */}
        <div className="text-right min-w-[5rem]">
          <div className="text-base sm:text-lg font-extrabold text-slate-900">
            ${itemTotal.toFixed(2)}
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={() => removeFromCart(product.id)}
          aria-label={`Remove ${product.name} from cart`}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
