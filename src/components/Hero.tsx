import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Clock, Heart, Award, MessageCircle } from 'lucide-react';
import type { StoreSettings } from '../types';

interface HeroProps {
  settings: StoreSettings;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF6F0] via-[#FAF6F0] to-[#F5ECE0] pt-6 pb-16 lg:py-20 border-b border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Subtle editorial kicker without pills */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold tracking-wider text-[#B93838] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Artisanal Bakery & Patisserie</span>
              <span aria-hidden="true">·</span>
              <span>100% Halal & Fresh</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2C1810] tracking-tight leading-[1.15] text-balance">
              Temukan <span className="italic font-normal text-[#B93838]">Manis Favoritmu</span>
            </h1>

            {/* Slogan and Description */}
            <p className="text-lg sm:text-xl font-medium text-[#705346] font-serif italic">
              "{settings.slogan}"
            </p>

            <p className="text-base text-[#705346] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Dari kue ulang tahun bertabur cinta, brownies cokelat lumer Belgia, hingga croissant
              berlapis mentega murni. Setiap kreasi dipanggang segar setiap pagi untuk menemani setiap
              momen bahagiamu.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                to="/katalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#B93838] hover:bg-[#9E2A2A] text-white rounded-xl text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <span>Lihat Menu Kue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=Halo%20Sweet%20Crumbs%20Bakery!%20Saya%20tertarik%20untuk%20pesan%20kue.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-stone-50 text-[#2C1810] border border-[#E8DFD5] rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Pesan Cepat WhatsApp</span>
              </a>
            </div>

            {/* Trust Assurances */}
            <div className="pt-6 border-t border-[#E8DFD5] grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-xl sm:text-2xl font-bold font-serif text-[#2C1810] tabular-nums">100%</p>
                <p className="text-xs text-[#705346] mt-0.5">Bahan Alami & Halal</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-serif text-[#2C1810] tabular-nums">08:00</p>
                <p className="text-xs text-[#705346] mt-0.5">Dipanggang Fresh Harian</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-serif text-[#2C1810] tabular-nums">4.9 / 5.0</p>
                <p className="text-xs text-[#705346] mt-0.5">Dari 500+ Pelanggan</p>
              </div>
            </div>
          </div>

          {/* Right Hero Image Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-stone-200">
                <img
                  src="/src/assets/images/hero_bakery_spread_1793363737190.jpg"
                  alt="Sweet Crumbs Bakery display fresh cakes and pastries"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
              </div>

              {/* Floating Highlight Card */}
              <div className="absolute -bottom-6 -left-4 sm:left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-[#E8DFD5] max-w-[240px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg">
                    ✨
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2C1810]">Pilihan Terfavorit</p>
                    <p className="text-[11px] text-[#705346]">Red Velvet & Fudgy Brownies</p>
                  </div>
                </div>
              </div>

              {/* Small delivery badge */}
              <div className="absolute -top-4 -right-2 sm:right-4 bg-[#2C1810] text-[#FAF6F0] px-3.5 py-1.5 rounded-full shadow-md text-xs font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>Bisa Kirim Hari Ini</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
