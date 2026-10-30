import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatRupiah, buildWhatsAppOrderMessage, cleanPhoneForWhatsApp } from '../utils/formatters';
import type { StoreSettings, Order, OrderStatus } from '../types';
import { dataService } from '../services/dataService';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  Tag,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface CartDrawerProps {
  settings: StoreSettings;
  onOrderCreated?: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ settings, onOrderCreated }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    total,
    totalItems,
    isCartOpen,
    setIsCartOpen,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  // Checkout form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(() => {
    // Default to tomorrow's date
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [deliveryTime, setDeliveryTime] = useState('11:00 WIB');
  const [specialNotes, setSpecialNotes] = useState('');

  // Promo code input
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form error
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState<Order | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    const res = await applyPromoCode(promoInput);
    if (res.success) {
      setPromoMessage({ type: 'success', text: res.message });
      setPromoInput('');
    } else {
      setPromoMessage({ type: 'error', text: res.message });
    }
  };

  const handleProcessWhatsAppOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (cart.length === 0) {
      setFormError('Keranjang belanja Anda masih kosong.');
      return;
    }

    if (!customerName.trim()) {
      setFormError('Silakan masukkan nama Anda.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.length < 8) {
      setFormError('Silakan masukkan nomor WhatsApp yang valid.');
      return;
    }

    if (deliveryMethod === 'delivery' && !deliveryAddress.trim()) {
      setFormError('Silakan masukkan alamat lengkap pengiriman.');
      return;
    }

    setIsSubmitting(true);

    // Create persistent Order record with status 'Menunggu konfirmasi'
    const orderId = `SCB-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: orderId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress.trim() : undefined,
      deliveryDate,
      deliveryTime,
      items: [...cart],
      subtotal,
      discount,
      promoCode: appliedPromo?.code,
      total,
      specialNotes: specialNotes.trim(),
      status: 'Menunggu konfirmasi' as OrderStatus,
      createdAt: new Date().toISOString(),
      source: 'whatsapp',
    };

    try {
      await dataService.createOrder(newOrder);
      if (onOrderCreated) {
        onOrderCreated(newOrder);
      }
    } catch (err) {
      console.error('Failed to log order in data service', err);
    }

    // Prepare WhatsApp Message
    const whatsappMessage = buildWhatsAppOrderMessage(newOrder, settings.name);
    const destinationNumber = cleanPhoneForWhatsApp(settings.whatsappNumber);
    const waUrl = `https://wa.me/${destinationNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    // Open WhatsApp
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Show confirmation modal
    setLastSubmittedOrder(newOrder);
    setIsSubmitting(false);
  };

  const handleFinishAndClear = () => {
    clearCart();
    setLastSubmittedOrder(null);
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E8DFD5] relative z-10">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 bg-[#FAF6F0] border-b border-[#E8DFD5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2C1810] text-[#FAF6F0] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-amber-200" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C1810]">Keranjang Pesanan</h3>
                <p className="text-xs text-[#705346]">{totalItems} item dipilih</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-[#705346] hover:bg-stone-200/60 transition-colors"
              aria-label="Tutup Keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          {lastSubmittedOrder ? (
            /* Order Submitted State */
            <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2C1810]">
                Pesanan Terkirim ke WhatsApp!
              </h3>
              <p className="text-sm text-[#705346] leading-relaxed">
                ID Pesanan Anda:{' '}
                <span className="font-mono font-bold text-[#2C1810]">{lastSubmittedOrder.id}</span>
              </p>
              <div className="p-4 bg-[#FAF6F0] rounded-2xl text-left border border-[#E8DFD5] text-xs text-[#705346] space-y-2 w-full">
                <p className="font-semibold text-[#2C1810]">Langkah Selanjutnya:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Pastikan Anda telah mengirimkan draft pesan di WhatsApp kami.</li>
                  <li>Admin kami akan segera mengecek ketersediaan & mengirimkan nomor rekening.</li>
                  <li>Pesanan resmi diproses setelah pembayaran terkonfirmasi.</li>
                </ol>
              </div>
              <div className="pt-4 w-full">
                <button
                  onClick={handleFinishAndClear}
                  className="w-full py-3 bg-[#2C1810] text-white rounded-xl text-sm font-semibold hover:bg-[#3D2318] transition-colors"
                >
                  Selesai & Tutup
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            /* Empty State */
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF6F0] border border-[#E8DFD5] flex items-center justify-center text-[#998075]">
                <ShoppingBag className="w-8 h-8 stroke-1" />
              </div>
              <p className="font-serif text-xl font-bold text-[#2C1810]">Keranjang Masih Kosong</p>
              <p className="text-xs text-[#705346] max-w-xs leading-relaxed">
                Pilih aneka kue tart lezat, brownies, cookies, atau hampers kami untuk memulai pesanan.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 bg-[#B93838] text-white rounded-xl text-xs font-semibold hover:bg-[#9E2A2A] transition-colors"
              >
                Lihat Menu Kue
              </button>
            </div>
          ) : (
            /* Active Cart Items & Form */
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#705346] font-semibold border-b border-[#F0E6D8] pb-1.5">
                  <span>Daftar Kue</span>
                  <button
                    onClick={clearCart}
                    className="text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    Kosongkan
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-[#FAF6F0] rounded-xl border border-[#E8DFD5] text-xs"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-serif font-bold text-[#2C1810] text-sm leading-snug line-clamp-1">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#998075] hover:text-rose-600 p-1"
                            aria-label="Hapus item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Variant details */}
                        {item.variantSelected && Object.keys(item.variantSelected).length > 0 && (
                          <p className="text-[11px] text-[#705346] mt-0.5">
                            {Object.entries(item.variantSelected)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(' · ')}
                          </p>
                        )}

                        {/* Custom notes */}
                        {item.notes && (
                          <p className="text-[10px] text-amber-800 italic mt-0.5 line-clamp-1">
                            Note: {item.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#E8DFD5]">
                        <span className="font-bold text-[#2C1810] tabular-nums">
                          {formatRupiah(item.price * item.quantity)}
                        </span>

                        <div className="flex items-center bg-white border border-[#E8DFD5] rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-[#705346] hover:bg-stone-100"
                            aria-label="Kurangi"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-[#705346] hover:bg-stone-100"
                            aria-label="Tambah"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Voucher Section */}
              <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E8DFD5] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C1810]">
                  <Tag className="w-3.5 h-3.5 text-[#B93838]" />
                  <span>Kupon / Voucher Diskon</span>
                </div>

                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 p-2 rounded-lg text-xs border border-emerald-200">
                    <div>
                      <span className="font-bold">{appliedPromo.code}</span> (Diskon {appliedPromo.discountPercent}%)
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Cth: SWEETCRUMBS10"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#E8DFD5] uppercase focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B93838]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3 py-1.5 bg-[#2C1810] text-white text-xs font-semibold rounded-lg hover:bg-[#3D2318] transition-colors"
                    >
                      Terapkan
                    </button>
                  </div>
                )}

                {promoMessage && (
                  <p
                    className={`text-[11px] ${
                      promoMessage.type === 'success' ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Checkout Customer Form */}
              <form onSubmit={handleProcessWhatsAppOrder} className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-[#2C1810] uppercase tracking-wider">
                  Informasi Pemesan & Pengambilan
                </h4>

                {formError && (
                  <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                    Nama Pemesan <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#998075] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nama lengkap Anda"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B93838]"
                    />
                  </div>
                </div>

                {/* WhatsApp Phone */}
                <div>
                  <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                    Nomor WhatsApp <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#998075] absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Contoh: 08123456789"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B93838]"
                    />
                  </div>
                </div>

                {/* Delivery Method */}
                <div>
                  <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                    Metode Pengambilan
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                        deliveryMethod === 'pickup'
                          ? 'bg-[#2C1810] text-[#FAF6F0] border-[#2C1810]'
                          : 'bg-[#FAF6F0] text-[#705346] border-[#E8DFD5]'
                      }`}
                    >
                      Ambil di Toko (Self Pickup)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                        deliveryMethod === 'delivery'
                          ? 'bg-[#2C1810] text-[#FAF6F0] border-[#2C1810]'
                          : 'bg-[#FAF6F0] text-[#705346] border-[#E8DFD5]'
                      }`}
                    >
                      Pengiriman Kurir
                    </button>
                  </div>
                </div>

                {/* Delivery Address if delivery */}
                {deliveryMethod === 'delivery' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                      Alamat Pengiriman <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#998075] absolute left-3 top-2.5" />
                      <textarea
                        rows={2}
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, patokan lokasi"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B93838]"
                      />
                    </div>
                  </div>
                )}

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                      Tanggal
                    </label>
                    <div className="relative">
                      <Calendar className="w-3.5 h-3.5 text-[#998075] absolute left-3 top-2.5" />
                      <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 text-xs rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                      Estimasi Jam
                    </label>
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 text-[#998075] absolute left-3 top-2.5" />
                      <select
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 text-xs rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                      >
                        <option value="09:00 WIB">09:00 WIB (Pagi)</option>
                        <option value="11:00 WIB">11:00 WIB (Siang)</option>
                        <option value="14:00 WIB">14:00 WIB (Siang)</option>
                        <option value="16:00 WIB">16:00 WIB (Sore)</option>
                        <option value="18:30 WIB">18:30 WIB (Malam)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Special Notes */}
                <div>
                  <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                    Catatan Pesanan Tambahan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Contoh: Harap pisahkan saus, mohon tepat waktu"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Order Summary */}
                <div className="pt-3 border-t border-[#F0E6D8] space-y-1.5 text-xs text-[#705346]">
                  <div className="flex justify-between">
                    <span>Subtotal Produk</span>
                    <span className="font-semibold text-[#2C1810] tabular-nums">
                      {formatRupiah(subtotal)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Diskon Promo</span>
                      <span className="font-semibold tabular-nums">-{formatRupiah(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-[#2C1810] pt-2 border-t border-[#E8DFD5]">
                    <span>Total Pembayaran</span>
                    <span className="tabular-nums font-sans">{formatRupiah(total)}</span>
                  </div>
                </div>

                {/* WhatsApp Notice & Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Lanjut Pesan via WhatsApp</span>
                  </button>
                  <p className="text-[11px] text-[#8C7368] text-center mt-2 leading-relaxed">
                    Pesanan Anda akan dicatat dan diteruskan ke WhatsApp resmi toko kami untuk konfirmasi ketersediaan & pembayaran.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
