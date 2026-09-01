import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isJustAdded, setIsJustAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(product, 1);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 1200);
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div
        id={`product-card-${product.id}`}
        className="group relative bg-white rounded-3xl p-4 border-2 border-transparent hover:border-indigo-500 hover:-translate-y-1 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col h-full overflow-hidden"
      >
        {/* Product Image Box */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-50/70 via-indigo-50/30 to-white mb-3 flex items-center justify-center">
          <Link to={`/products/${product.id}`} className="block w-full h-full">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {hasDiscount && (
              <span className="bg-rose-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs tracking-wide">
                SALE
              </span>
            )}
            {product.isNew && (
              <span className="bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs tracking-wide">
                NEW
              </span>
            )}
          </div>

          {/* Floating Action Button (Quick View) */}
          <button
            onClick={handleOpenQuickView}
            className="absolute top-3 right-3 p-2 bg-white/95 hover:bg-white text-slate-700 hover:text-indigo-600 rounded-full shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 cursor-pointer"
            title="Quick view"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Out of Stock overlay if applicable */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center pointer-events-none">
              <span className="bg-slate-900 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-xl shadow-md tracking-wider">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          <Link
            to={`/products/${product.id}`}
            className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2 mb-1.5 leading-snug"
          >
            {product.name}
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Price & Action Section */}
          <div className="mt-auto pt-3 border-t border-indigo-50 flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-slate-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {isOutOfStock ? (
                <span className="text-[10px] text-rose-600 font-semibold">Out of Stock</span>
              ) : isLowStock ? (
                <span className="text-[10px] text-amber-600 font-semibold">
                  Only {product.stock} left
                </span>
              ) : (
                <span className="text-[10px] text-emerald-600 font-semibold">
                  In Stock ({product.stock})
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label={`Add ${product.name} to cart`}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-bold transition-all duration-200 flex items-center justify-center cursor-pointer ${
                isJustAdded
                  ? 'bg-emerald-600 text-white shadow-md'
                  : isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-sm hover:shadow-md'
              }`}
            >
              {isJustAdded ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <span className="text-xl leading-none font-bold">+</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};
