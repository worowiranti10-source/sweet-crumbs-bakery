import React from 'react';
import { Link } from 'react-router-dom';
import type { StoreSettings } from '../types';
import { Shield, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  settings: StoreSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  return (
    <footer className="bg-[#21110A] text-[#FAF6F0] pt-16 pb-12 border-t border-[#3D2318]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] text-[#2C1810] flex items-center justify-center font-serif text-lg font-bold">
                SC
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FAF6F0]">
                {settings.name}
              </span>
            </div>
            <p className="text-xs text-stone-300 font-serif italic text-amber-200">
              "{settings.slogan}"
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              Toko kue online modern dengan sajian kue ulang tahun, brownies legit, pastry berlapis butter murni, cupcake anggun, dan paket hampers eksklusif.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <p className="font-serif font-bold text-sm text-[#FAF6F0]">Navigasi Cepat</p>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <Link to="/" className="hover:text-amber-200 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/katalog" className="hover:text-amber-200 transition-colors">
                  Katalog Kue Lengkap
                </Link>
              </li>
              <li>
                <Link to="/tentang" className="hover:text-amber-200 transition-colors">
                  Cerita & Kualitas Bahan
                </Link>
              </li>
              <li>
                <Link to="/kontak" className="hover:text-amber-200 transition-colors">
                  Kontak & Lokasi Toko
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3 space-y-3">
            <p className="font-serif font-bold text-sm text-[#FAF6F0]">Kategori Pilihan</p>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <Link to="/katalog?cat=kue-ulang-tahun" className="hover:text-amber-200 transition-colors">
                  Kue Ulang Tahun & Custom
                </Link>
              </li>
              <li>
                <Link to="/katalog?cat=brownies-cake" className="hover:text-amber-200 transition-colors">
                  Fudgy Brownies & Cake
                </Link>
              </li>
              <li>
                <Link to="/katalog?cat=cupcake" className="hover:text-amber-200 transition-colors">
                  Artisan Cupcake Set
                </Link>
              </li>
              <li>
                <Link to="/katalog?cat=roti-pastry" className="hover:text-amber-200 transition-colors">
                  Croissant & Pastry Perancis
                </Link>
              </li>
              <li>
                <Link to="/katalog?cat=hampers" className="hover:text-amber-200 transition-colors">
                  Paket Hampers Perayaan
                </Link>
              </li>
            </ul>
          </div>

          {/* Operational & Admin */}
          <div className="lg:col-span-3 space-y-3 text-xs text-stone-300">
            <p className="font-serif font-bold text-sm text-[#FAF6F0]">Informasi Toko</p>
            <p className="text-stone-300 leading-relaxed">
              {settings.address}
            </p>
            <p className="text-amber-200 font-medium">
              ⏰ {settings.operatingHours}
            </p>
            <p className="text-stone-300">
              💬 WhatsApp: <span className="font-mono">{settings.whatsappDisplay}</span>
            </p>
            <div className="pt-2">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-medium transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-amber-300" />
                <span>Admin Control Panel</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© 2026 {settings.name}. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <span>Dibuat dengan bahan alami 100% halal</span>
            <span aria-hidden="true">·</span>
            <span>Netlify & PWA Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
