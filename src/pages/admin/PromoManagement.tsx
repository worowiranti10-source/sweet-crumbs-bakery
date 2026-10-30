import React, { useState } from 'react';
import type { Promo, Testimonial } from '../../types';
import { Plus, Edit2, Trash2, X, Tag, Star, MessageSquare } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

interface PromoManagementProps {
  promos: Promo[];
  testimonials: Testimonial[];
  onSavePromo: (promo: Promo) => Promise<void>;
  onDeletePromo: (promoId: string) => Promise<void>;
  onSaveTestimonial: (testi: Testimonial) => Promise<void>;
  onDeleteTestimonial: (testiId: string) => Promise<void>;
}

export const PromoManagement: React.FC<PromoManagementProps> = ({
  promos,
  testimonials,
  onSavePromo,
  onDeletePromo,
  onSaveTestimonial,
  onDeleteTestimonial,
}) => {
  // Promo state
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [pCode, setPCode] = useState('');
  const [pTitle, setPTitle] = useState('');
  const [pDiscount, setPDiscount] = useState<number>(10);
  const [pValidUntil, setPValidUntil] = useState('2026-12-31');
  const [pMinPurchase, setPMinPurchase] = useState<number>(100000);
  const [pIsActive, setPIsActive] = useState(true);

  // Testimonial state
  const [isTestiModalOpen, setIsTestiModalOpen] = useState(false);
  const [editingTesti, setEditingTesti] = useState<Testimonial | null>(null);
  const [tName, setTName] = useState('');
  const [tEvent, setTEvent] = useState('');
  const [tRating, setTRating] = useState<number>(5);
  const [tComment, setTComment] = useState('');

  // Promo Handlers
  const openAddPromo = () => {
    setEditingPromo(null);
    setPCode('');
    setPTitle('');
    setPDiscount(10);
    setPValidUntil('2026-12-31');
    setPMinPurchase(100000);
    setPIsActive(true);
    setIsPromoModalOpen(true);
  };

  const openEditPromo = (promo: Promo) => {
    setEditingPromo(promo);
    setPCode(promo.code);
    setPTitle(promo.title);
    setPDiscount(promo.discountPercent);
    setPValidUntil(promo.validUntil);
    setPMinPurchase(promo.minPurchase);
    setPIsActive(promo.isActive);
    setIsPromoModalOpen(true);
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pCode.trim()) return;

    const saved: Promo = {
      id: editingPromo ? editingPromo.id : `promo-${Date.now()}`,
      code: pCode.trim().toUpperCase(),
      title: pTitle.trim() || `Diskon ${pDiscount}%`,
      discountPercent: Number(pDiscount),
      validUntil: pValidUntil,
      minPurchase: Number(pMinPurchase),
      isActive: pIsActive,
    };

    await onSavePromo(saved);
    setIsPromoModalOpen(false);
  };

  // Testimonial Handlers
  const openAddTesti = () => {
    setEditingTesti(null);
    setTName('');
    setTEvent('Pesanan Ulang Tahun');
    setTRating(5);
    setTComment('');
    setIsTestiModalOpen(true);
  };

  const openEditTesti = (testi: Testimonial) => {
    setEditingTesti(testi);
    setTName(testi.customerName);
    setTEvent(testi.roleOrEvent);
    setTRating(testi.rating);
    setTComment(testi.comment);
    setIsTestiModalOpen(true);
  };

  const handleSaveTesti = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim() || !tComment.trim()) return;

    const saved: Testimonial = {
      id: editingTesti ? editingTesti.id : `testi-${Date.now()}`,
      customerName: tName.trim(),
      roleOrEvent: tEvent.trim(),
      rating: Number(tRating),
      comment: tComment.trim(),
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };

    await onSaveTestimonial(saved);
    setIsTestiModalOpen(false);
  };

  return (
    <div className="space-y-10">
      {/* 1. Promo Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#2C1810]">
              Manajemen Voucher & Kode Promo
            </h2>
            <p className="text-xs sm:text-sm text-[#705346] mt-0.5">
              Kode kupon ini dapat digunakan pelanggan saat checkout keranjang.
            </p>
          </div>
          <button
            onClick={openAddPromo}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#B93838] text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-[#9E2A2A] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kode Promo</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-[#E8DFD5] shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] text-[#705346] font-semibold border-b border-[#E8DFD5]">
              <tr>
                <th className="p-4">Kode Kupon</th>
                <th className="p-4">Judul Promo</th>
                <th className="p-4">Diskon</th>
                <th className="p-4">Minimal Belanja</th>
                <th className="p-4">Berlaku Hingga</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E6D8]">
              {promos.map((promo) => (
                <tr key={promo.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-sm text-[#2C1810]">{promo.code}</td>
                  <td className="p-4 font-medium text-[#2C1810]">{promo.title}</td>
                  <td className="p-4 font-bold text-emerald-700">{promo.discountPercent}% OFF</td>
                  <td className="p-4 text-[#705346] tabular-nums">
                    {formatRupiah(promo.minPurchase)}
                  </td>
                  <td className="p-4 text-[#705346]">{promo.validUntil}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        promo.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {promo.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditPromo(promo)}
                        className="p-1.5 text-stone-600 hover:text-[#2C1810] rounded-lg hover:bg-stone-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeletePromo(promo.id)}
                        className="p-1.5 text-stone-600 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Testimonials Section */}
      <div className="space-y-4 pt-6 border-t border-[#E8DFD5]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#2C1810]">
              Manajemen Ulasan & Testimoni Pelanggan
            </h2>
            <p className="text-xs sm:text-sm text-[#705346] mt-0.5">
              Tampilkan apresiasi pelanggan di halaman beranda toko.
            </p>
          </div>
          <button
            onClick={openAddTesti}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2C1810] text-[#FAF6F0] rounded-xl text-xs font-semibold shadow-sm hover:bg-[#3D2318] transition-colors"
          >
            <Plus className="w-4 h-4 text-amber-200" />
            <span>Tambah Testimoni</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testi) => (
            <div
              key={testi.id}
              className="bg-white p-5 rounded-2xl border border-[#E8DFD5] shadow-sm flex flex-col justify-between space-y-4 text-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < testi.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-400">{testi.date}</span>
                </div>
                <p className="text-stone-700 italic leading-relaxed">"{testi.comment}"</p>
              </div>

              <div className="pt-2 border-t border-[#F0E6D8] flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2C1810]">{testi.customerName}</p>
                  <p className="text-[10px] text-stone-500">{testi.roleOrEvent}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditTesti(testi)}
                    className="p-1 text-stone-600 hover:text-[#2C1810]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteTestimonial(testi.id)}
                    className="p-1 text-stone-600 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Modal */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-[#E8DFD5] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-base text-[#2C1810]">
                {editingPromo ? 'Edit Kode Promo' : 'Tambah Kode Promo'}
              </h3>
              <button
                onClick={() => setIsPromoModalOpen(false)}
                className="text-stone-500 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Kode Promo *</label>
                <input
                  type="text"
                  required
                  value={pCode}
                  onChange={(e) => setPCode(e.target.value)}
                  placeholder="Cth: WEEKENDSERU"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Judul / Keterangan</label>
                <input
                  type="text"
                  value={pTitle}
                  onChange={(e) => setPTitle(e.target.value)}
                  placeholder="Diskon Pembukaan Toko"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Diskon (%)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={pDiscount}
                    onChange={(e) => setPDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Min. Belanja (Rp)</label>
                  <input
                    type="number"
                    min={0}
                    value={pMinPurchase}
                    onChange={(e) => setPMinPurchase(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Berlaku Hingga</label>
                <input
                  type="date"
                  value={pValidUntil}
                  onChange={(e) => setPValidUntil(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pActive"
                  checked={pIsActive}
                  onChange={(e) => setPIsActive(e.target.checked)}
                  className="rounded text-[#B93838]"
                />
                <label htmlFor="pActive" className="font-semibold cursor-pointer">
                  Kupon Aktif & Bisa Digunakan
                </label>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B93838] text-white rounded-xl font-semibold"
                >
                  Simpan Kupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {isTestiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-[#E8DFD5] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-base text-[#2C1810]">
                {editingTesti ? 'Edit Testimoni' : 'Tambah Testimoni'}
              </h3>
              <button
                onClick={() => setIsTestiModalOpen(false)}
                className="text-stone-500 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTesti} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Nama Pelanggan *</label>
                <input
                  type="text"
                  required
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  placeholder="Nama customer"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Konteks / Acara</label>
                  <input
                    type="text"
                    value={tEvent}
                    onChange={(e) => setTEvent(e.target.value)}
                    placeholder="Ulang Tahun Anak / Wedding"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Rating Bintang (1 - 5)</label>
                  <select
                    value={tRating}
                    onChange={(e) => setTRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Bintang)</option>
                    <option value={3}>⭐⭐⭐ (3 Bintang)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Ulasan / Testimoni *</label>
                <textarea
                  rows={3}
                  required
                  value={tComment}
                  onChange={(e) => setTComment(e.target.value)}
                  placeholder="Kesan pelanggan terhadap kue dan pelayanan..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTestiModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2C1810] text-white rounded-xl font-semibold"
                >
                  Simpan Ulasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
