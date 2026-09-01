import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Product, FilterState } from '../types';
import { ProductGrid } from '../components/ProductGrid';
import { FilterPanel } from '../components/FilterPanel';
import { SearchBar } from '../components/SearchBar';
import {
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Sparkles,
  Layers,
  Filter
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Parse state from search params
  const currentFilters: FilterState = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 1000,
    minRating: Number(searchParams.get('rating')) || 0,
    inStockOnly: searchParams.get('inStock') === 'true',
    sortBy: (searchParams.get('sort') as FilterState['sortBy']) || 'newest'
  };

  const updateFilters = useCallback(
    (newFilters: Partial<FilterState>) => {
      const next: FilterState = { ...currentFilters, ...newFilters };
      const params = new URLSearchParams();

      if (next.search) params.set('search', next.search);
      if (next.category && next.category !== 'All') params.set('category', next.category);
      if (next.minPrice > 0) params.set('minPrice', next.minPrice.toString());
      if (next.maxPrice < 1000) params.set('maxPrice', next.maxPrice.toString());
      if (next.minRating > 0) params.set('rating', next.minRating.toString());
      if (next.inStockOnly) params.set('inStock', 'true');
      if (next.sortBy && next.sortBy !== 'newest') params.set('sort', next.sortBy);

      setSearchParams(params);
    },
    [currentFilters, setSearchParams]
  );

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const { products: data, total } = await api.getProducts(currentFilters);
        if (isMounted) {
          setProducts(data);
          setTotalCount(total);
        }
      } catch (err) {
        console.error('Failed to fetch catalog:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // Active filter count for badge
  const activeFiltersList: Array<{ label: string; key: keyof FilterState; value: any }> = [];
  if (currentFilters.search) activeFiltersList.push({ label: `Search: "${currentFilters.search}"`, key: 'search', value: '' });
  if (currentFilters.category !== 'All') activeFiltersList.push({ label: `Category: ${currentFilters.category}`, key: 'category', value: 'All' });
  if (currentFilters.minPrice > 0 || currentFilters.maxPrice < 1000) {
    activeFiltersList.push({ label: `$${currentFilters.minPrice} - $${currentFilters.maxPrice}`, key: 'maxPrice', value: 1000 });
  }
  if (currentFilters.minRating > 0) activeFiltersList.push({ label: `${currentFilters.minRating}★ & Above`, key: 'minRating', value: 0 });
  if (currentFilters.inStockOnly) activeFiltersList.push({ label: 'In Stock Only', key: 'inStockOnly', value: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Product Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse our full range of hardware, audio equipment, wearables, and accessories.
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50"
          >
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Filters {activeFiltersList.length > 0 && `(${activeFiltersList.length})`}</span>
          </button>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={currentFilters.sortBy}
              onChange={e => updateFilters({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer pr-2"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterPanel
            filters={currentFilters}
            onFilterChange={updateFilters}
            onReset={handleResetFilters}
            totalResults={totalCount}
          />
        </div>

        {/* Product Catalog Grid Container */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filters Chips Bar */}
          {activeFiltersList.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-100/70 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 mr-1">Active:</span>
              {activeFiltersList.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-slate-800 rounded-lg text-xs font-medium border border-slate-200 shadow-2xs"
                >
                  <span>{tag.label}</span>
                  <button
                    onClick={() => {
                      if (tag.key === 'maxPrice') {
                        updateFilters({ minPrice: 0, maxPrice: 1000 });
                      } else {
                        updateFilters({ [tag.key]: tag.value });
                      }
                    }}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}

              <button
                onClick={handleResetFilters}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold ml-auto px-2 py-1 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Results Count Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>
              Showing <strong className="text-slate-800 font-bold">{products.length}</strong> of{' '}
              <strong className="text-slate-800 font-bold">{totalCount}</strong> products
            </span>
            {currentFilters.search && (
              <span>
                Search results for <strong className="text-indigo-600">"{currentFilters.search}"</strong>
              </span>
            )}
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={products}
            isLoading={isLoading}
            onResetFilters={handleResetFilters}
            emptyMessage={
              currentFilters.search
                ? `No products found matching "${currentFilters.search}". Try checking your spelling or adjusting your category filters.`
                : 'No products match your chosen filter criteria.'
            }
          />
        </div>
      </div>

      {/* Mobile Drawer Filters Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Filter Catalog</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterPanel
              filters={currentFilters}
              onFilterChange={updateFilters}
              onReset={handleResetFilters}
              totalResults={totalCount}
              isMobileDrawer
              onCloseMobile={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
