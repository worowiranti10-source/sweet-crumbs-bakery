import React from 'react';
import type { StoreSettings } from '../types';
import { MapPin, Clock, Phone, Instagram, ExternalLink, MessageCircle } from 'lucide-react';

interface ContactSectionProps {
  settings: StoreSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#B93838]">
            Kunjungi Dapur & Kontak Kami
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C1810]">
            Kami Senang Menyambut Anda
          </h2>
          <p className="text-sm text-[#705346]">
            Singgah untuk mengambil pesanan langsung, konsultasi kue custom pernikahan, atau sekadar
            menikmati aroma panggangan roti segar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-[#FAF6F0] rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E8DFD5] text-[#B93838] flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#2C1810]">Alamat Toko & Dapur</h4>
                  <p className="text-xs sm:text-sm text-[#705346] mt-0.5 leading-relaxed">
                    {settings.address}
                  </p>
                  <p className="text-[11px] text-[#A68F83] mt-1">
                    (Parkir luas untuk mobil & motor, area ramah kursi roda)
                  </p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E8DFD5] text-amber-700 flex items-center justify-center shrink-0 shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#2C1810]">Jam Operasional</h4>
                  <p className="text-xs sm:text-sm text-[#705346] mt-0.5">
                    {settings.operatingHours}
                  </p>
                  <p className="text-[11px] text-[#A68F83] mt-0.5">
                    Pesanan kue tart custom minimal H-1
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E8DFD5] text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#2C1810]">Customer Care & WhatsApp</h4>
                  <p className="text-xs sm:text-sm text-[#705346] mt-0.5">
                    {settings.whatsappDisplay}
                  </p>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber}?text=Halo%20Sweet%20Crumbs%20Bakery!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline mt-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Mulai Chat Sekarang</span>
                  </a>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E8DFD5] text-rose-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#2C1810]">Instagram Resmi</h4>
                  <p className="text-xs sm:text-sm text-[#705346] mt-0.5">
                    {settings.instagram}
                  </p>
                  <p className="text-[11px] text-[#A68F83] mt-0.5">
                    Ikuti daily stories proses baking harian
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8DFD5]">
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#2C1810] text-white rounded-xl text-xs font-semibold hover:bg-[#3D2318] transition-colors"
              >
                <MapPin className="w-4 h-4 text-amber-200" />
                <span>Buka Rute di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#E8DFD5] shadow-sm relative min-h-[380px] bg-stone-100 flex flex-col">
            <iframe
              title="Lokasi Sweet Crumbs Bakery di Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.257368598917!2d106.8041!3d-6.2307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14309b!2sKebayoran%20Baru!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
              className="w-full h-full flex-1 border-0 min-h-[360px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="p-3 bg-[#FAF6F0] border-t border-[#E8DFD5] text-[11px] text-[#8C7368] flex items-center justify-between">
              <span>📍 Sweet Crumbs Bakery — Jakarta Selatan</span>
              <span>Buka Setiap Hari 08.00 - 20.00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
