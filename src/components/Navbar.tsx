import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Shield, Phone, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { StoreSettings } from '../types';

interface NavbarProps {
  settings: StoreSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ settings }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const location = useLocation();

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E8DFD5] transition-all">
      {/* Optional Promo Top Banner */}
      {settings.isPromoBannerActive && !isBannerDismissed && (
        <div className="bg-[#B93838] text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-between">
          <div className="flex-1 flex items-center justify-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0" />
            <span className="truncate">{settings.promoBannerText}</span>
          </div>
          <button
            onClick={() => setIsBannerDismissed(true)}
            className="text-white/80 hover:text-white ml-2 p-0.5 rounded transition-colors"
            aria-label="Tutup banner promo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-[#2C1810] hover:opacity-90 transition-opacity shrink-0"
        >
          <div className="w-10 h-10 rounded-full bg-[#2C1810] text-[#FAF6F0] flex items-center justify-center font-serif text-lg font-bold shadow-sm">
            SC
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2C1810] whitespace-nowrap">
              {settings.name}
            </span>
            <span className="text-[11px] text-[#705346] tracking-wider uppercase hidden sm:inline-block">
              {settings.slogan}
            </span>
          </div>
        </Link>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#705346]">
          <Link
            to="/"
            className={`transition-colors whitespace-nowrap hover:text-[#2C1810] ${
              isCurrent('/') ? 'text-[#B93838] font-semibold' : ''
            }`}
          >
            Beranda
          </Link>
          <Link
            to="/katalog"
            className={`transition-colors whitespace-nowrap hover:text-[#2C1810] ${
              isCurrent('/katalog') ? 'text-[#B93838] font-semibold' : ''
            }`}
          >
            Menu Kue
          </Link>
          <Link
            to="/tentang"
            className={`transition-colors whitespace-nowrap hover:text-[#2C1810] ${
              isCurrent('/tentang') ? 'text-[#B93838] font-semibold' : ''
            }`}
          >
            Tentang Kami
          </Link>
          <Link
            to="/kontak"
            className={`transition-colors whitespace-nowrap hover:text-[#2C1810] ${
              isCurrent('/kontak') ? 'text-[#B93838] font-semibold' : ''
            }`}
          >
            Kontak & Lokasi
          </Link>
        </nav>

        {/* Zone 3: Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {/* WhatsApp Direct Help */}
          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=Halo%20Sweet%20Crumbs%20Bakery,%20saya%20ingin%20tanya%20seputar%20menu%20kue.`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2C1810] bg-white border border-[#E8DFD5] rounded-full hover:bg-stone-50 transition-colors whitespace-nowrap"
            title="Chat WhatsApp"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>{settings.whatsappDisplay}</span>
          </a>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 bg-[#2C1810] text-[#FAF6F0] rounded-xl hover:bg-[#3D2318] transition-colors shadow-sm active:scale-95"
            aria-label="Buka Keranjang Belanja"
          >
            <ShoppingBag className="w-4 h-4 text-amber-200" />
            <span className="text-xs font-medium hidden sm:inline">Keranjang</span>
            {totalItems > 0 && (
              <span className="bg-[#B93838] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-[20px] text-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Admin Link */}
          <Link
            to="/admin"
            className="p-2 text-[#705346] hover:text-[#2C1810] hover:bg-stone-200/50 rounded-lg transition-colors"
            title="Admin Control Panel"
            aria-label="Admin Control Panel"
          >
            <Shield className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#2C1810] hover:bg-stone-200/50 rounded-lg transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8DFD5] bg-[#FAF6F0] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-150">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 px-3 rounded-lg text-base font-medium ${
              isCurrent('/') ? 'bg-[#EFE8DE] text-[#2C1810] font-semibold' : 'text-[#705346]'
            }`}
          >
            Beranda
          </Link>
          <Link
            to="/katalog"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 px-3 rounded-lg text-base font-medium ${
              isCurrent('/katalog') ? 'bg-[#EFE8DE] text-[#2C1810] font-semibold' : 'text-[#705346]'
            }`}
          >
            Menu Kue & Produk
          </Link>
          <Link
            to="/tentang"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 px-3 rounded-lg text-base font-medium ${
              isCurrent('/tentang') ? 'bg-[#EFE8DE] text-[#2C1810] font-semibold' : 'text-[#705346]'
            }`}
          >
            Tentang Kami & Cerita
          </Link>
          <Link
            to="/kontak"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 px-3 rounded-lg text-base font-medium ${
              isCurrent('/kontak') ? 'bg-[#EFE8DE] text-[#2C1810] font-semibold' : 'text-[#705346]'
            }`}
          >
            Kontak & Lokasi Toko
          </Link>
          <Link
            to="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-medium text-[#705346] border border-[#E8DFD5] bg-white"
          >
            <Shield className="w-4 h-4 text-[#B93838]" />
            <span>Admin Control Panel</span>
          </Link>
        </div>
      )}
    </header>
  );
};
