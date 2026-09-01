import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string; className?: string }> = ({
  size = 'md',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-indigo-600 mb-2`} />
      {text && <p className="text-sm font-medium text-slate-600 animate-pulse">{text}</p>}
    </div>
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 animate-pulse flex flex-col h-full shadow-xs">
      <div className="w-full aspect-square bg-slate-200 rounded-xl mb-4" />
      <div className="h-3 bg-slate-200 rounded-full w-1/3 mb-2" />
      <div className="h-5 bg-slate-200 rounded-full w-3/4 mb-3" />
      <div className="h-4 bg-slate-200 rounded-full w-1/2 mb-4" />
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-6 bg-slate-200 rounded-full w-1/3" />
        <div className="h-9 bg-slate-200 rounded-xl w-24" />
      </div>
    </div>
  );
};
