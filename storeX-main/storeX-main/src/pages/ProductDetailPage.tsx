import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Star,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  ArrowLeft,
  Share2,
  Package,
  ThumbsUp,
  MessageSquarePlus
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<(Product & { related?: Product[] }) | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');

  // Customer reviews state
  const [reviews, setReviews] = useState<Array<{ name: string; rating: number; date: string; comment: string; helpful: number }>>([
    {
      name: 'Marcus Vance',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Build quality blew me away. Acoustics and materials are top notch for this price bracket. Fast shipping too.',
      helpful: 24
    },
    {
      name: 'Elena Rostova',
      rating: 5,
      date: '1 month ago',
      comment: 'Exactly as described. Connects instantaneously and battery life exceeds the advertised duration. Highly recommended!',
      helpful: 18
    },
    {
      name: 'David Chen',
      rating: 4,
      date: '1 month ago',
      comment: 'Very sleek aesthetics and lightweight. Perfect for everyday workflow at my office.',
      helpful: 9
    }
  ]);

  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const loadProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.getProductById(id);
        if (isMounted) {
          setProduct(data);
          setSelectedImage(data.image);
          setQuantity(1);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Product not found.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex justify-center">
        <LoadingSpinner size="lg" text="Loading product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">
          The item you are looking for does not exist or may have been removed from our catalog.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-xs text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const savings = product.originalPrice ? (product.originalPrice - product.price).toFixed(2) : null;
  const allImages = [product.image, ...(product.additionalImages || [])];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Product link copied to clipboard!', 'info');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      showToast('Please provide your name and review comment.', 'error');
      return;
    }

    const newRev = {
      name: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment.trim(),
      helpful: 0
    };

    setReviews([newRev, ...reviews]);
    setNewReviewAuthor('');
    setNewReviewComment('');
    setShowReviewForm(false);
    showToast('Thank you! Your verified review has been posted.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <Link to="/products" className="hover:text-indigo-600 transition-colors">Catalog</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-indigo-600 transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="w-full aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/80 shadow-md relative group">
            <img
              src={selectedImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {savings && (
              <div className="absolute top-4 left-4 bg-rose-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md">
                Save ${savings}
              </div>
            )}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white text-slate-700 hover:text-indigo-600 rounded-full shadow-md backdrop-blur-xs transition-colors"
              title="Share product link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImage === img ? 'border-indigo-600 shadow-md ring-2 ring-indigo-100' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Gallery thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Information & Purchasing Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.brand && (
                <span className="text-xs text-slate-500 font-semibold">
                  Brand: <strong className="text-slate-800">{product.brand}</strong>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviewCount} customer ratings)</span>
            </div>
          </div>

          {/* Pricing Block */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="text-right">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                  Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                  Only {product.stock} units remaining!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} available)
                </span>
              )}
            </div>
          </div>

          {/* Short Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity & Purchasing Controls */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Quantity</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors font-bold text-sm"
                >
                  -
                </button>
                <span className="px-5 py-2 text-sm font-bold text-slate-900 min-w-[3rem] text-center bg-slate-50">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                id="product-detail-add-cart-btn"
                className="py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                id="product-detail-buy-now-btn"
                className="py-3.5 px-6 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Buy Now (Instant Checkout)</span>
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center text-xs">
            <div className="flex flex-col items-center gap-1.5 p-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-slate-800">Free Express</span>
              <span className="text-[10px] text-slate-500">On orders &gt;$99</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 border-x border-slate-200">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-slate-800">2-Year Warranty</span>
              <span className="text-[10px] text-slate-500">Full replacement</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <span className="font-bold text-slate-800">30-Day Returns</span>
              <span className="text-[10px] text-slate-500">Hassle-free moneyback</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications, Features, and Reviews */}
      <div className="pt-8 border-t border-slate-200">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Product Features
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'specs'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Customer Reviews</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
              {reviews.length}
            </span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="py-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="font-bold text-slate-900 text-lg">Key Features & Innovations</h3>
              {product.features && product.features.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                      <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0 mt-0.5">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{feat}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600">{product.description}</p>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="font-bold text-slate-900 text-lg">Technical Specifications</h3>
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                <table className="w-full text-xs sm:text-sm">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="px-5 py-3.5 font-bold text-slate-700 bg-slate-50/70 w-1/3">Category</td>
                      <td className="px-5 py-3.5 text-slate-800">{product.category}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-5 py-3.5 font-bold text-slate-700 bg-slate-50/70">Stock Quantity</td>
                      <td className="px-5 py-3.5 text-slate-800">{product.stock} units</td>
                    </tr>
                    {product.specs &&
                      Object.entries(product.specs).map(([key, val], idx) => (
                        <tr key={idx} className="border-b border-slate-100 last:border-b-0">
                          <td className="px-5 py-3.5 font-bold text-slate-700 bg-slate-50/70">{key}</td>
                          <td className="px-5 py-3.5 text-slate-800">{val}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Customer Ratings & Verified Feedback</h3>
                  <p className="text-xs text-slate-500">Read what real owners say about this item.</p>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>Write a Review</span>
                </button>
              </div>

              {/* Review Submission Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleAddReview}
                  className="p-6 bg-slate-50 rounded-2xl border border-indigo-200/80 space-y-4 max-w-xl"
                >
                  <h4 className="font-bold text-slate-900 text-sm">Submit Your Review</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Your Name</label>
                      <input
                        type="text"
                        value={newReviewAuthor}
                        onChange={e => setNewReviewAuthor(e.target.value)}
                        placeholder="e.g. Sarah Connor"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Rating</label>
                      <select
                        value={newReviewRating}
                        onChange={e => setNewReviewRating(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                      >
                        <option value={5}>5 Stars - Outstanding</option>
                        <option value={4}>4 Stars - Very Good</option>
                        <option value={3}>3 Stars - Average</option>
                        <option value={2}>2 Stars - Poor</option>
                        <option value={1}>1 Star - Unacceptable</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Review Details</label>
                    <textarea
                      rows={3}
                      value={newReviewComment}
                      onChange={e => setNewReviewComment(e.target.value)}
                      placeholder="Share your hands-on experience with this product..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 resize-none"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      Post Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((rev, i) => (
                  <div key={i} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{rev.name}</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                          Verified Purchase
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3.5 h-3.5 ${
                            starIdx < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{rev.comment}</p>

                    <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
                      <button
                        onClick={() => showToast('Thank you for your feedback!', 'info')}
                        className="flex items-center gap-1 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Helpful ({rev.helpful})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {product.related && product.related.length > 0 && (
        <div className="pt-12 border-t border-slate-200">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
            Frequently Bought Together in {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {product.related.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
