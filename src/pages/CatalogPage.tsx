import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CategoryBar } from '../components/CategoryBar';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Search, SlidersHorizontal, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface CatalogPageProps {
  products: Product[];
  categories: Category[];
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ products, categories }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync category state with URL param
  useEffect(() => {
    const cat = searchParams.get('cat') || 'all';
    setSelectedCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('cat');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ cat: slug });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Product counts per category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          (p.ingredients && p.ingredients.some((ing) => ing.toLowerCase().includes(q)))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C1810] text-[#FAF6F0] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-medium border border-amber-900/40 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#B93838] uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Menu & Katalog Lengkap</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
          Pilihan Kue & Patisserie Terbaik
        </h1>
        <p className="text-sm text-[#705346] max-w-2xl leading-relaxed">
          Temukan aneka kreasi kue tart ulang tahun custom, fudge brownies, roti croissant renyah,
          dan paket hampers spesial. Seluruh produk dibuat setiap hari tanpa bahan pengawet.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
        productCounts={productCounts}
      />

      {/* Search & Sort Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#998075] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kue, brownies, croissant, rasa cokelat, matcha..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B93838]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-[#998075] hover:text-[#2C1810]"
            >
              Reset
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-[#705346] shrink-0" />
          <span className="text-xs font-semibold text-[#705346] whitespace-nowrap">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#B93838]"
          >
            <option value="featured">Paling Populer (Unggulan)</option>
            <option value="price-asc">Harga: Terendah ke Tertinggi</option>
            <option value="price-desc">Harga: Tertinggi ke Terendah</option>
            <option value="rating">Rating Tertinggi</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-[#E8DFD5] p-8 space-y-4">
          <p className="font-serif text-xl font-bold text-[#2C1810]">
            Tidak Ada Menu yang Sesuai
          </p>
          <p className="text-xs sm:text-sm text-[#705346] max-w-sm mx-auto">
            Kami tidak menemukan kue dengan kata kunci atau filter yang Anda pilih. Coba ubah pencarian atau tampilkan semua menu.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              searchParams.delete('cat');
              setSearchParams(searchParams);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C1810] text-white rounded-xl text-xs font-semibold hover:bg-[#3D2318] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tampilkan Semua Menu</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenDetail={(p) => setSelectedProduct(p)}
              onQuickAddToast={(name) => showToast(`${name} ditambahkan ke keranjang!`)}
            />
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddedSuccess={(msg) => showToast(msg)}
      />
    </div>
  );
};
