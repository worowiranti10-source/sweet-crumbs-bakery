import React from 'react';
import { Heart, Award, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StorySection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image composition */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl bg-stone-100 border border-[#E8DFD5]">
                <img
                  src="/src/assets/images/pastry_croissants_1793363737837.jpg"
                  alt="Pastry artisan Sweet Crumbs Bakery"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-[#2C1810] text-[#FAF6F0] p-5 rounded-2xl shadow-xl max-w-[220px]">
                <p className="font-serif text-2xl font-bold text-amber-200">Sejak 2021</p>
                <p className="text-xs text-stone-300 mt-1">
                  Menghadirkan senyum manis di setiap gigitan kue artisan.
                </p>
              </div>
            </div>
          </div>

          {/* Text and story */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#B93838] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cerita Kami</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810] leading-tight">
              Dedikasi Rasa, Dari Dapur Kecil Menuju Momen Bahagiamu
            </h2>

            <p className="text-base text-[#705346] leading-relaxed">
              Sweet Crumbs Bakery lahir dari kecintaan mendalam terhadap aroma mentega panggangan
              segar di pagi hari. Kami percaya bahwa sebuah kue bukan sekadar hidangan penutup,
              melainkan ungkapan kasih, selebrasi pencapaian, dan kenangan manis yang tak terlupakan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD5] space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-[#2C1810] text-amber-200 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#2C1810]">Bahan Baku Kelas Satu</h4>
                <p className="text-xs text-[#705346] leading-relaxed">
                  Menggunakan butter murni impor, couverture cokelat Belgia 70%, dan vanila asli tanpa perisa buatan.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD5] space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-[#2C1810] text-amber-200 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#2C1810]">100% Halal & Higienis</h4>
                <p className="text-xs text-[#705346] leading-relaxed">
                  Semua bahan baku, proses produksi, dan peralatan dijamin 100% halal dan steril bersertifikat.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/tentang"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#B93838] hover:text-[#9E2A2A] hover:underline"
              >
                <span>Baca kisah selengkapnya tentang Sweet Crumbs</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
