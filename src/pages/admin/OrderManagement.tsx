import React, { useState } from 'react';
import type { Order, OrderStatus, Product } from '../../types';
import { formatRupiah, getStatusStyle, cleanPhoneForWhatsApp } from '../../utils/formatters';
import {
  Search,
  Filter,
  MessageCircle,
  Eye,
  Plus,
  X,
  Clock,
  Calendar,
  MapPin,
  User,
  Phone,
  FileText,
  CheckCircle2,
} from 'lucide-react';

interface OrderManagementProps {
  orders: Order[];
  products: Product[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onCreateManualOrder: (order: Order) => Promise<void>;
}

export const OrderManagement: React.FC<OrderManagementProps> = ({
  orders,
  products,
  onUpdateStatus,
  onCreateManualOrder,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual Order Form state
  const [mName, setMName] = useState('');
  const [mPhone, setMPhone] = useState('');
  const [mMethod, setMMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [mAddress, setMAddress] = useState('');
  const [mDate, setMDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [mTime, setMTime] = useState('14:00 WIB');
  const [mSelectedProductId, setMSelectedProductId] = useState(products[0]?.id || '');
  const [mQty, setMQty] = useState(1);
  const [mNotes, setMNotes] = useState('');

  const orderStatuses: OrderStatus[] = [
    'Menunggu konfirmasi',
    'Dikonfirmasi',
    'Diproses',
    'Siap diambil',
    'Dikirim',
    'Selesai',
    'Dibatalkan',
  ];

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName.trim() || !mPhone.trim()) return;

    const prod = products.find((p) => p.id === mSelectedProductId) || products[0];
    const price = prod ? prod.discountPrice || prod.price : 50000;
    const subtotal = price * mQty;

    const newManualOrder: Order = {
      id: `SCB-MANUAL-${Date.now().toString().slice(-4)}`,
      customerName: mName.trim(),
      customerPhone: mPhone.trim(),
      deliveryMethod: mMethod,
      deliveryAddress: mMethod === 'delivery' ? mAddress.trim() : undefined,
      deliveryDate: mDate,
      deliveryTime: mTime,
      items: [
        {
          id: `manual-item-${Date.now()}`,
          productId: prod?.id || 'prod-manual',
          name: prod?.name || 'Kue Pesanan Manual',
          price,
          variantSelected: { Tipe: 'Pesanan Kasir' },
          quantity: mQty,
          notes: mNotes.trim(),
          imageUrl: prod?.imageUrl || '',
        },
      ],
      subtotal,
      discount: 0,
      total: subtotal,
      specialNotes: mNotes.trim(),
      status: 'Dikonfirmasi',
      createdAt: new Date().toISOString(),
      source: 'manual',
    };

    await onCreateManualOrder(newManualOrder);
    setIsManualModalOpen(false);
    setMName('');
    setMPhone('');
    setMAddress('');
    setMNotes('');
  };

  const handleSendWhatsAppUpdate = (order: Order) => {
    const cleanPhone = cleanPhoneForWhatsApp(order.customerPhone);
    const msg = `Halo Kak ${order.customerName}! 👋
Update dari Sweet Crumbs Bakery mengenai pesanan *${order.id}*:

Status Pesanan Saat Ini: *${order.status.toUpperCase()}*
Tanggal/Jam: ${order.deliveryDate} (${order.deliveryTime})
Total: ${formatRupiah(order.total)}

Jika ada pertanyaan tambahan, jangan ragu untuk membalas pesan ini ya Kak. Terima kasih banyak! 🍰`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filteredOrders = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
            Manajemen Pesanan
          </h1>
          <p className="text-xs sm:text-sm text-[#705346] mt-0.5">
            Kelola pesanan masuk dari WhatsApp pelanggan dan input pesanan manual dari toko offline.
          </p>
        </div>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C1810] hover:bg-[#3D2318] text-[#FAF6F0] rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-amber-200" />
          <span>Input Pesanan Manual</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#998075] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari ID Pesanan (SCB-...), Nama, atau No HP..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B93838]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#705346]" />
          <span className="text-xs font-semibold text-[#705346]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] text-[#2C1810] focus:outline-none"
          >
            <option value="all">Semua Status ({orders.length})</option>
            {orderStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFD5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] text-[#705346] font-semibold border-b border-[#E8DFD5]">
              <tr>
                <th className="p-4">ID Pesanan & Sumber</th>
                <th className="p-4">Pelanggan</th>
                <th className="p-4">Jadwal Pengambilan</th>
                <th className="p-4">Detail Item</th>
                <th className="p-4">Total</th>
                <th className="p-4">Ubah Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E6D8]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#705346]">
                    Tidak ada pesanan yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const style = getStatusStyle(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-bold text-[#2C1810] block">{order.id}</span>
                        <span className="text-[10px] text-[#8C7368] uppercase">
                          {order.source === 'whatsapp' ? '🟢 WhatsApp' : '🔵 Manual Kasir'}
                        </span>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-[#2C1810]">{order.customerName}</p>
                        <p className="text-[11px] text-[#8C7368] font-mono">{order.customerPhone}</p>
                      </td>

                      <td className="p-4 text-[#705346]">
                        <p className="font-semibold text-[#2C1810]">{order.deliveryDate}</p>
                        <p className="text-[11px]">{order.deliveryTime}</p>
                        <span className="text-[10px] text-stone-500">
                          {order.deliveryMethod === 'pickup' ? 'Ambil di Toko' : 'Kirim ke Alamat'}
                        </span>
                      </td>

                      <td className="p-4 max-w-xs">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="truncate">
                            <span className="font-semibold">{it.quantity}x</span> {it.name}
                          </div>
                        ))}
                        {order.specialNotes && (
                          <p className="text-[10px] text-amber-800 italic mt-0.5 truncate">
                            Note: {order.specialNotes}
                          </p>
                        )}
                      </td>

                      <td className="p-4 font-bold text-[#2C1810] tabular-nums">
                        {formatRupiah(order.total)}
                      </td>

                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none ${style.bg} ${style.text} ${style.border}`}
                        >
                          {orderStatuses.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-stone-600 hover:text-[#2C1810] hover:bg-stone-200/50 rounded-lg transition-colors"
                            title="Lihat Detail Pesanan"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSendWhatsAppUpdate(order)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Chat / Update Status ke WhatsApp Pelanggan"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 border border-[#E8DFD5] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-[#2C1810]">
                  Rincian Pesanan {selectedOrder.id}
                </h3>
                <p className="text-[11px] text-[#8C7368]">
                  Masuk pada: {new Date(selectedOrder.createdAt).toLocaleString('id-ID')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-stone-500 hover:text-stone-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E8DFD5] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#705346]">Nama Pemesan:</span>
                <span className="font-bold text-[#2C1810]">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#705346]">No. WhatsApp:</span>
                <span className="font-mono font-bold text-[#2C1810]">
                  {selectedOrder.customerPhone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#705346]">Metode:</span>
                <span className="font-semibold text-[#2C1810]">
                  {selectedOrder.deliveryMethod === 'pickup'
                    ? 'Ambil Sendiri di Toko'
                    : 'Pengiriman Kurir'}
                </span>
              </div>
              {selectedOrder.deliveryAddress && (
                <div className="pt-1 border-t border-[#E8DFD5]">
                  <span className="text-[#705346] block">Alamat Pengiriman:</span>
                  <span className="text-[#2C1810] font-medium">{selectedOrder.deliveryAddress}</span>
                </div>
              )}
              <div className="flex justify-between pt-1">
                <span className="text-[#705346]">Jadwal:</span>
                <span className="font-semibold text-[#2C1810]">
                  {selectedOrder.deliveryDate} ({selectedOrder.deliveryTime})
                </span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <p className="font-bold text-[#2C1810]">Daftar Item Kue:</p>
              {selectedOrder.items.map((it, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-start"
                >
                  <div>
                    <p className="font-bold text-[#2C1810]">
                      {it.quantity}x {it.name}
                    </p>
                    {it.variantSelected && Object.keys(it.variantSelected).length > 0 && (
                      <p className="text-[11px] text-[#705346]">
                        {Object.entries(it.variantSelected)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ')}
                      </p>
                    )}
                    {it.notes && (
                      <p className="text-[10px] text-amber-800 italic mt-0.5">Catatan: {it.notes}</p>
                    )}
                  </div>
                  <span className="font-bold tabular-nums">
                    {formatRupiah(it.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E8DFD5] space-y-1">
              <div className="flex justify-between text-[#705346]">
                <span>Subtotal</span>
                <span>{formatRupiah(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Diskon Promo ({selectedOrder.promoCode})</span>
                  <span>-{formatRupiah(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-[#2C1810] pt-1 border-t border-[#E8DFD5]">
                <span>Total Pembayaran</span>
                <span>{formatRupiah(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => handleSendWhatsAppUpdate(selectedOrder)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Pelanggan di WA</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 border border-[#E8DFD5] rounded-xl text-stone-700 hover:bg-stone-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Order Creation Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-[#E8DFD5] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
              <h3 className="font-serif font-bold text-base text-[#2C1810]">
                Input Pesanan Toko Manual
              </h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-stone-500 hover:text-stone-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManual} className="space-y-3">
              <div>
                <label className="block font-semibold text-[#2C1810] mb-1">Nama Pelanggan *</label>
                <input
                  type="text"
                  required
                  value={mName}
                  onChange={(e) => setMName(e.target.value)}
                  placeholder="Nama customer"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2C1810] mb-1">No. WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={mPhone}
                  onChange={(e) => setMPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2C1810] mb-1">Pilih Produk Kue *</label>
                <select
                  value={mSelectedProductId}
                  onChange={(e) => setMSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {formatRupiah(p.discountPrice || p.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#2C1810] mb-1">Jumlah *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={mQty}
                    onChange={(e) => setMQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#2C1810] mb-1">Metode</label>
                  <select
                    value={mMethod}
                    onChange={(e) => setMMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                  >
                    <option value="pickup">Ambil di Toko</option>
                    <option value="delivery">Pengiriman Kurir</option>
                  </select>
                </div>
              </div>

              {mMethod === 'delivery' && (
                <div>
                  <label className="block font-semibold text-[#2C1810] mb-1">Alamat Kirim</label>
                  <textarea
                    rows={2}
                    value={mAddress}
                    onChange={(e) => setMAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#2C1810] mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={mDate}
                    onChange={(e) => setMDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#2C1810] mb-1">Jam</label>
                  <input
                    type="text"
                    value={mTime}
                    onChange={(e) => setMTime(e.target.value)}
                    placeholder="14:00 WIB"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2C1810] mb-1">Catatan</label>
                <input
                  type="text"
                  value={mNotes}
                  onChange={(e) => setMNotes(e.target.value)}
                  placeholder="Catatan pesanan"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                />
              </div>

              <div className="pt-3 border-t border-[#E8DFD5] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2C1810] text-white rounded-xl font-semibold"
                >
                  Simpan Pesanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
