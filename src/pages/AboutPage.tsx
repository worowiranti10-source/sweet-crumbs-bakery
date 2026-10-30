import React from 'react';
import { Award, Heart, Sparkles, ShieldCheck, Clock, Users } from 'lucide-react';
import type { StoreSettings } from '../types';
import { Link } from 'react-router-dom';

interface AboutPageProps {
  settings: StoreSettings;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings }) => {
  return (
    <div className="py-8 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-[#B93838] uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Profil & Filosofi Toko</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2C1810] leading-tight">
          Menghadirkan Kebahagiaan Lewat Setiap Panggangan Kue
        </h1>
        <p className="text-base text-[#705346] font-serif italic">
          "{settings.slogan}"
        </p>
      </div>

      {/* Main Story & Image Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-5 text-[#705346] text-sm sm:text-base leading-relaxed">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
            Kisah Dibalik Sweet Crumbs Bakery
          </h2>
          <p>
            Berawal dari sebuah oven rumahan di kawasan Jakarta Selatan, Sweet Crumbs Bakery didirikan
            dengan satu tujuan sederhana: menghadirkan kue berkualitas patisserie Eropa dengan cita rasa
            yang hangat dan ramah di lidah keluarga Indonesia.
          </p>
          <p>
            Nama <em>Sweet Crumbs</em> terinspirasi dari remah-remah kue yang begitu lezat hingga tak rela
            ditinggalkan di atas piring. Kami mendedikasikan diri untuk meracik tekstur yang pas—mulai dari
            sponge cake yang moist, lapisan kulit croissant yang renyah berongga, hingga fudgy brownies
            dengan cokelat lumer yang pekat.
          </p>
          <p>
            Hingga hari ini, setiap adonan kue kami uleni dengan tangan terampil dan dipanggang di pagi
            buta agar selalu sampai di tangan Anda dalam kondisi sesegar mungkin.
          </p>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
            <img
              src="/src/assets/images/hero_bakery_spread_1793363737190.jpg"
              alt="Dapur pastry Sweet Crumbs Bakery"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* 4 Pillars of Excellence */}
      <div className="pt-8 border-t border-[#E8DFD5]">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
            4 Komitmen Kualitas Kami
          </h3>
          <p className="text-xs sm:text-sm text-[#705346]">
            Standar tanpa kompromi yang selalu kami jaga dalam setiap loyang kue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#2C1810]">Bahan Baku Murni</h4>
            <p className="text-xs text-[#705346] leading-relaxed">
              Mentega murni Lescure & Wijsman, dark chocolate couverture Belgia 70%, dan vanila madagaskar alami tanpa perisa kimiawi.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#2C1810]">100% Halal & Bersih</h4>
            <p className="text-xs text-[#705346] leading-relaxed">
              Semua bahan baku, resep, dan lingkungan dapur bersertifikat halal, bersih, serta memenuhi protokol sanitasi makanan modern.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#B93838] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#2C1810]">Fresh Tiap Pagi</h4>
            <p className="text-xs text-[#705346] leading-relaxed">
              Kami tidak pernah menjual produk sisa hari sebelumnya. Kue dan roti Anda selalu dibuat segar di hari pengiriman atau pengambilan.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#2C1810]">Personalisasi Penuh</h4>
            <p className="text-xs text-[#705346] leading-relaxed">
              Bisa request tulisan tangan di kue, ucapan kartu kado custom, pilihan lilin, dan dekorasi hampers sesuai selera Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-8 sm:p-12 bg-[#2C1810] text-[#FAF6F0] rounded-3xl text-center space-y-4 max-w-3xl mx-auto shadow-xl">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold">
          Ingin Mencicipi Kreasi Spesial Hari Ini?
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto">
          Lihat katalog lengkap kami atau pesan langsung melalui WhatsApp untuk konsultasi pesanan kue pesta.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/katalog"
            className="w-full sm:w-auto px-6 py-3 bg-[#B93838] hover:bg-[#9E2A2A] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors"
          >
            Buka Menu Kue
          </Link>
          <Link
            to="/kontak"
            className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors"
          >
            Kunjungi Toko
          </Link>
        </div>
      </div>
    </div>
  );
};
