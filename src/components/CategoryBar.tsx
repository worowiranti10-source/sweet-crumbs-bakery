import React from 'react';
import type { Category } from '../types';
import { Cake, Cookie, Sparkles, Coffee, Wheat, Gift, LayoutGrid } from 'lucide-react';

interface CategoryBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  productCounts?: Record<string, number>;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  productCounts = {},
}) => {
  const getIcon = (slug: string) => {
    switch (slug) {
      case 'kue-ulang-tahun':
        return <Cake className="w-4 h-4 shrink-0" />;
      case 'brownies-cake':
        return <Cookie className="w-4 h-4 shrink-0" />;
      case 'cupcake':
        return <Sparkles className="w-4 h-4 shrink-0" />;
      case 'cookies':
        return <Coffee className="w-4 h-4 shrink-0" />;
      case 'roti-pastry':
        return <Wheat className="w-4 h-4 shrink-0" />;
      case 'hampers':
        return <Gift className="w-4 h-4 shrink-0" />;
      default:
        return <LayoutGrid className="w-4 h-4 shrink-0" />;
    }
  };

  const totalAll = Object.values(productCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max p-1 bg-[#F0E6D8]/60 rounded-2xl border border-[#E8DFD5]">
        {/* 'Semua Menu' Option */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#2C1810] text-[#FAF6F0] shadow-sm'
              : 'text-[#705346] hover:text-[#2C1810] hover:bg-white/60'
          }`}
        >
          <LayoutGrid className="w-4 h-4 shrink-0" />
          <span>Semua Menu</span>
          {totalAll > 0 && (
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-stone-200/60 text-stone-700'
              }`}
            >
              {totalAll}
            </span>
          )}
        </button>

        {/* Categories list */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          const count = productCounts[cat.slug] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isSelected
                  ? 'bg-[#2C1810] text-[#FAF6F0] shadow-sm'
                  : 'text-[#705346] hover:text-[#2C1810] hover:bg-white/60'
              }`}
            >
              {getIcon(cat.slug)}
              <span>{cat.name}</span>
              {count > 0 && (
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-stone-200/60 text-stone-700'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
