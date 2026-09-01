import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  const currentImage = selectedImg || product.image;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden z-10 border border-slate-100 max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Product Image Gallery */}
          <div className="md:w-1/2 bg-slate-50 p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-slate-100">
            <div className="w-full aspect-square relative rounded-2xl overflow-hidden bg-white shadow-xs mb-4">
              <img
                src={currentImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {product.originalPrice && (
                <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </div>
              )}
            </div>

            {product.additionalImages && product.additionalImages.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedImg(product.image)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImage === product.image ? 'border-indigo-600 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={product.image} alt="Thumbnail main" className="w-full h-full object-cover" />
                </button>
                {product.additionalImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImage === img ? 'border-indigo-600 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details info */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 text-xs">({product.reviewCount})</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 leading-snug mb-2">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-extrabold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
              {product.description}
            </p>

            {/* Features preview */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-xs font-semibold text-slate-700 mb-1">Highlights:</div>
                {product.features.slice(0, 2).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity selector & Add to Cart */}
            <div className="mt-auto space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-semibold text-slate-900 bg-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  id="modal-add-to-cart-btn"
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <Link
                  to={`/products/${product.id}`}
                  onClick={onClose}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 text-sm"
                >
                  <span>Full View</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" /> Free Shipping &gt;$99
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> 2-Yr Warranty
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
