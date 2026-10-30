import React, { useState } from 'react';
import type { Product } from '../types';
import { formatRupiah } from '../utils/formatters';
import { normalizeImageUrl } from '../utils/imageUtils';
import { X, Star, ShoppingBag, Plus, Minus, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddedSuccess?: (message: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddedSuccess,
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const displayPrice = product.discountPrice || product.price;

  // Initial variant selection
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.variants) {
      product.variants.forEach((v) => {
        if (v.options && v.options.length > 0) {
          initial[v.name] = v.options[0];
        }
      });
    }
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSuccessFeedback, setIsSuccessFeedback] = useState(false);

  const handleVariantChange = (variantName: string, option: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: option,
    }));
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: displayPrice,
      originalPrice: product.discountPrice ? product.price : undefined,
      variantSelected: selectedVariants,
      quantity,
      notes: notes.trim(),
      imageUrl: normalizeImageUrl(product.imageUrl),
    });

    setIsSuccessFeedback(true);
    if (onAddedSuccess) {
      onAddedSuccess(`${quantity}x ${product.name} berhasil ditambahkan ke keranjang!`);
    }

    setTimeout(() => {
      setIsSuccessFeedback(false);
      onClose();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[#E8DFD5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 text-[#2C1810] hover:bg-stone-100 flex items-center justify-center shadow-md transition-colors"
          aria-label="Tutup Detail Produk"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left: Product Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#FAF6F0] border border-[#E8DFD5]">
              <img
                src={normalizeImageUrl(product.imageUrl)}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallbackApplied) {
                    target.dataset.fallbackApplied = 'true';
                    target.src = '/images/hero_bakery.jpg';
                  }
                }}
              />
            </div>

            {/* Right: Info Header */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#705346] mb-1">
                  <span className="uppercase tracking-wider font-semibold text-[#B93838]">
                    {product.categoryName}
                  </span>
                  <span aria-hidden="true">·</span>
                  <div className="flex items-center gap-0.5 text-amber-600 font-medium tabular-nums">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-[#998075]">({product.reviewCount} ulasan)</span>
                  </div>
                </div>

                <h2 className="font-serif text-2xl font-bold text-[#2C1810] leading-tight">
                  {product.name}
                </h2>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#2C1810] font-sans tabular-nums">
                    {formatRupiah(displayPrice)}
                  </span>
                  {product.discountPrice && (
                    <span className="text-sm text-[#998075] line-through tabular-nums">
                      {formatRupiah(product.price)}
                    </span>
                  )}
                </div>

                {product.badge && (
                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#B93838] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    <Sparkles className="w-3 h-3" />
                    <span>{product.badge}</span>
                  </div>
                )}
              </div>

              {/* Ingredients / Highlights */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#F0E6D8]">
                  <p className="text-xs font-semibold text-[#2C1810] mb-1.5">Bahan Berkualitas:</p>
                  <p className="text-xs text-[#705346] leading-relaxed">
                    {product.ingredients.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Full Description */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1.5">
              Deskripsi Menu
            </h4>
            <p className="text-sm text-[#705346] leading-relaxed">{product.description}</p>
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-[#F0E6D8]">
              {product.variants.map((variant) => (
                <div key={variant.name}>
                  <label className="block text-xs font-bold text-[#2C1810] mb-2">
                    {variant.name}:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option) => {
                      const isSelected = selectedVariants[variant.name] === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleVariantChange(variant.name, option)}
                          className={`px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                            isSelected
                              ? 'bg-[#2C1810] text-[#FAF6F0] shadow-sm'
                              : 'bg-[#FAF6F0] text-[#705346] border border-[#E8DFD5] hover:border-stone-400'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Custom Cake Message & Special Notes */}
          <div className="space-y-1.5 pt-2 border-t border-[#F0E6D8]">
            <label className="block text-xs font-bold text-[#2C1810]">
              Catatan Khusus / Tulisan di Kue (Opsional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Tulisan 'Happy Birthday Sarah ke-20' / Lilin angka 20"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B93838]"
            />
          </div>
        </div>

        {/* Bottom Contiguous Purchase Module */}
        <div className="p-4 sm:p-5 bg-[#FAF6F0] border-t border-[#E8DFD5] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-bold text-[#705346] uppercase">Jumlah:</span>
            <div className="flex items-center bg-white border border-[#E8DFD5] rounded-xl overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-[#705346] hover:bg-stone-100 transition-colors"
                aria-label="Kurangi Jumlah"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-sm font-sans tabular-nums text-[#2C1810]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center text-[#705346] hover:bg-stone-100 transition-colors"
                aria-label="Tambah Jumlah"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-right sm:hidden">
              <p className="text-xs text-[#705346]">Subtotal</p>
              <p className="text-base font-bold text-[#2C1810] font-sans tabular-nums">
                {formatRupiah(displayPrice * quantity)}
              </p>
            </div>
          </div>

          {/* Add to Cart CTA */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-[#705346]">Total Harga</p>
              <p className="text-lg font-bold text-[#2C1810] font-sans tabular-nums">
                {formatRupiah(displayPrice * quantity)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-md active:scale-95 ${
                isSuccessFeedback
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#B93838] hover:bg-[#9E2A2A] text-white'
              }`}
            >
              {isSuccessFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Berhasil Ditambahkan!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Tambah ke Keranjang</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
