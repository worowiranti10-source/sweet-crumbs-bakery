import React, { useState } from 'react';
import type { StoreSettings } from '../types';
import { ContactSection } from '../components/ContactSection';
import { Sparkles, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { cleanPhoneForWhatsApp } from '../utils/formatters';

interface ContactPageProps {
  settings: StoreSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('Pemesanan Kue Ulang Tahun');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const formattedMessage = `Halo Sweet Crumbs Bakery! 👋
Nama: ${name.trim()}
No. HP: ${phone.trim() || '-'}
Topik Pertanyaan: ${topic}

Pesan:
${message.trim()}`;

    const waNum = cleanPhoneForWhatsApp(settings.whatsappNumber);
    const url = `https://wa.me/${waNum}?text=${encodeURIComponent(formattedMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <div className="py-8 sm:py-12 space-y-12">
      {/* Contact Section With Map and Address */}
      <ContactSection settings={settings} />

      {/* Quick Inquiry Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DFD5] shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#B93838] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kirim Pertanyaan Cepat</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
              Ada Pertanyaan atau Request Khusus?
            </h3>
            <p className="text-xs sm:text-sm text-[#705346]">
              Isi formulir di bawah ini dan pesan akan langsung diteruskan ke staf WhatsApp toko kami.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-serif font-bold text-lg text-emerald-900">
                Pesan Diteruskan ke WhatsApp!
              </h4>
              <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                Terima kasih telah menghubungi Sweet Crumbs Bakery. Kami akan segera merespons pertanyaan Anda.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-colors"
              >
                Kirim Pertanyaan Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                    Nama Lengkap <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B93838]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B93838]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                  Topik Pertanyaan
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] text-[#2C1810] focus:bg-white focus:outline-none"
                >
                  <option value="Pemesanan Kue Ulang Tahun Custom">Pemesanan Kue Ulang Tahun Custom</option>
                  <option value="Paket Hampers Perusahaan / Acara">Paket Hampers Perusahaan / Acara</option>
                  <option value="Pengiriman & Kerjasama">Pengiriman & Kerjasama</option>
                  <option value="Lainnya">Pertanyaan Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                  Pesan Anda <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan pertanyaan, tanggal acara, atau kue yang diinginkan..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B93838]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Pesan ke WhatsApp Toko</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
