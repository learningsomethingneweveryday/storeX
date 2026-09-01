import React from 'react';
import { FilterState } from '../types';
import { CATEGORIES } from '../data/sampleProducts';
import { RotateCcw, SlidersHorizontal, Star, Check } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalResults: number;
  className?: string;
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalResults,
  className = '',
  isMobileDrawer = false,
  onCloseMobile
}) => {
  const ratingOptions = [
    { value: 4.5, label: '4.5 & up' },
    { value: 4.0, label: '4.0 & up' },
    { value: 3.5, label: '3.5 & up' }
  ];

  return (
    <aside
      id="storex-filter-panel"
      className={`bg-white rounded-3xl border-2 border-indigo-100/90 p-6 shadow-xs flex flex-col gap-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-indigo-50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <h3 className="font-extrabold text-slate-900 text-sm">Refine Catalog</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Category Section */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Categories
        </label>
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map(cat => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ category: cat.id })}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-indigo-100 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </div>
                  <span>{cat.name}</span>
                </div>
                <span className="text-[11px] text-slate-400">{cat.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Price Range
          </label>
          <span className="text-xs text-indigo-600 font-bold">
            ${filters.minPrice} - ${filters.maxPrice}
          </span>
        </div>

        <div className="space-y-2.5">
          <input
            type="range"
            min="0"
            max="600"
            step="10"
            value={filters.maxPrice}
            onChange={e => onFilterChange({ maxPrice: Number(e.target.value) })}
            className="w-full h-2 bg-indigo-50 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
              <input
                type="number"
                min="0"
                max={filters.maxPrice}
                value={filters.minPrice}
                onChange={e => onFilterChange({ minPrice: Math.max(0, Number(e.target.value)) })}
                placeholder="Min"
                className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border-2 border-indigo-50 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
            <span className="text-slate-400 text-xs">to</span>
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
              <input
                type="number"
                min={filters.minPrice}
                max="1000"
                value={filters.maxPrice}
                onChange={e => onFilterChange({ maxPrice: Number(e.target.value) })}
                placeholder="Max"
                className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border-2 border-indigo-50 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Rating */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Customer Rating
        </label>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onFilterChange({ minRating: 0 })}
            className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
              filters.minRating === 0
                ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${
                  filters.minRating === 0
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-indigo-100 bg-white'
                }`}
              >
                {filters.minRating === 0 && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
              </div>
              <span>All Ratings</span>
            </div>
          </button>
          {ratingOptions.map(opt => {
            const isSelected = filters.minRating === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onFilterChange({ minRating: opt.value })}
                className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-indigo-100 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{opt.label}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="pt-3 border-t-2 border-indigo-50">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-semibold text-slate-700">In Stock Only</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={e => onFilterChange({ inStockOnly: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded border-indigo-200 focus:ring-indigo-500 cursor-pointer"
          />
        </label>
      </div>

      {/* Pro Member Callout Box */}
      <div className="mt-auto pt-2">
        <div className="bg-indigo-50/80 p-4 rounded-2xl border border-indigo-100">
          <div className="font-extrabold text-indigo-600 text-sm">Pro Member?</div>
          <div className="text-xs text-slate-600 mt-1 leading-relaxed">
            Get free express shipping on all orders over $99.
          </div>
        </div>
      </div>

      {isMobileDrawer && onCloseMobile && (
        <button
          onClick={onCloseMobile}
          className="mt-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md cursor-pointer"
        >
          View {totalResults} Results
        </button>
      )}
    </aside>
  );
};
