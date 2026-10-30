import React, { useState } from 'react';
import type { Product } from '../types';
import { formatRupiah } from '../utils/formatters';
import { normalizeImageUrl } from '../utils/imageUtils';
import { Star, Plus, Eye, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onQuickAddToast?: (name: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onQuickAddToast,
}) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If product has complex variants, open detail modal so customer can choose
    if (product.variants && product.variants.length > 0) {
      onOpenDetail(product);
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: displayPrice,
      originalPrice: product.discountPrice ? product.price : undefined,
      variantSelected: {},
      quantity: 1,
      notes: '',
      imageUrl: product.imageUrl,
    });

    if (onQuickAddToast) {
      onQuickAddToast(product.name);
    }
  };

  return (
    <div
      onClick={() => onOpenDetail(product)}
      className="group relative bg-white rounded-2xl border border-[#E8DFD5] overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full bg-[#FAF6F0] overflow-hidden">
        {!imageError ? (
          <img
            src={normalizeImageUrl(product.imageUrl)}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.triedFallback) {
                target.dataset.triedFallback = 'true';
                target.src = '/images/hero_bakery.jpg';
              } else {
                setImageError(true);
              }
            }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#FAF6F0] to-[#EAE0D3] text-[#705346]">
            <Sparkles className="w-10 h-10 mb-2 text-[#B93838]" />
            <span className="text-xs font-semibold text-center">{product.name}</span>
          </div>
        )}

        {/* Subtle Tag Overlay (Max 1 subtle tag per rules) */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-[#2C1810]/90 backdrop-blur-sm text-[#FAF6F0] text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-md shadow-sm">
            {product.badge}
          </div>
        )}

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(product);
          }}
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          aria-label="Lihat Detail Produk"
        >
          <span className="px-4 py-2 bg-white/95 text-[#2C1810] text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>Lihat Detail</span>
          </span>
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Zero-Pill Rule) */}
          <div className="flex items-center gap-2 text-xs text-[#705346] mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[11px] text-[#B93838]">
              {product.categoryName}
            </span>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-0.5 text-amber-600 font-medium tabular-nums">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-[#998075]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#2C1810] line-clamp-1 group-hover:text-[#B93838] transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#705346] mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Variant preview if any */}
          {product.variants && product.variants.length > 0 && (
            <p className="text-[11px] text-[#8C7368] mt-2 italic">
              Tersedia {product.variants.length} pilihan varian
            </p>
          )}
        </div>

        {/* Bottom Price & Add Action */}
        <div className="mt-4 pt-3 border-t border-[#F0E6D8] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-[#2C1810] font-sans tabular-nums">
                {formatRupiah(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-[#998075] line-through tabular-nums">
                  {formatRupiah(product.price)}
                </span>
              )}
            </div>
            {product.stockStatus === 'low_stock' && (
              <span className="text-[10px] text-amber-700 font-medium">Stok terbatas</span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FAF6F0] hover:bg-[#B93838] text-[#2C1810] hover:text-white border border-[#E8DFD5] hover:border-[#B93838] rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95"
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pesan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
