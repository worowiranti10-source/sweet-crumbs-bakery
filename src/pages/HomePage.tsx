import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { CategoryBar } from '../components/CategoryBar';
import { ProductCard } from '../components/ProductCard';
import { StorySection } from '../components/StorySection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { ContactSection } from '../components/ContactSection';
import { ProductDetailModal } from '../components/ProductDetailModal';
import type { Product, Category, StoreSettings, Testimonial } from '../types';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  testimonials: Testimonial[];
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  settings,
  testimonials,
}) => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const featuredProducts = products.filter((p) => p.isFeatured || p.badge === 'Best Seller').slice(0, 6);

  const handleCategorySelect = (slug: string) => {
    if (slug === 'all') {
      navigate('/katalog');
    } else {
      navigate(`/katalog?cat=${slug}`);
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C1810] text-[#FAF6F0] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-medium border border-amber-900/40 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      <Hero settings={settings} />

      {/* Interactive Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#B93838] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Jelajahi Pilihan</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810] mt-1">
              Kategori Kue & Patisserie
            </h2>
          </div>
          <Link
            to="/katalog"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#B93838] hover:text-[#9E2A2A] hover:underline"
          >
            <span>Lihat Semua Katalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <CategoryBar
          categories={categories}
          selectedCategory="all"
          onSelectCategory={handleCategorySelect}
        />
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#B93838]">
              Pilihan Favorit Pelanggan
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810] mt-1">
              Produk Paling Banyak Dipesan
            </h2>
            <p className="text-xs sm:text-sm text-[#705346] mt-1">
              Setiap produk dibuat dengan bahan premium bersertifikat dan dipanggang segar.
            </p>
          </div>
          <Link
            to="/katalog"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#2C1810] hover:text-[#B93838] border-b border-[#2C1810] pb-0.5"
          >
            <span>Eksplorasi Semua ({products.length} Menu)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenDetail={(p) => setSelectedProduct(p)}
              onQuickAddToast={(name) => showToast(`${name} ditambahkan ke keranjang!`)}
            />
          ))}
        </div>
      </section>

      {/* Special Artisanal Promo Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#2C1810] to-[#45271D] rounded-3xl p-8 sm:p-12 text-[#FAF6F0] relative overflow-hidden shadow-xl border border-[#523328]">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-semibold tracking-wider text-amber-300 uppercase">
              Pemesanan Khusus & Custom Kue
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
              Butuh Kue Tart Custom untuk Ulang Tahun atau Resepsi?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Konsultasikan tema warna, tulisan nama, dan dekorasi impian Anda langsung dengan pastry
              chef kami melalui WhatsApp. Kami siap mewujudkannya dengan sempurna.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=Halo%20Sweet%20Crumbs%20Bakery,%20saya%20ingin%20konsultasi%20kue%20custom.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#B93838] hover:bg-[#9E2A2A] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95"
              >
                <span>Konsultasi Kue Custom Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <StorySection />

      {/* Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Contact Section */}
      <ContactSection settings={settings} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddedSuccess={(msg) => showToast(msg)}
      />
    </div>
  );
};
