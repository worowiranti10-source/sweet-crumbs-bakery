import React from 'react';
import { Link } from 'react-router-dom';
import type { Product, Category, Order, StoreSettings } from '../../types';
import { formatRupiah, getStatusStyle } from '../../utils/formatters';
import {
  ShoppingBag,
  Cake,
  FolderTree,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: StoreSettings;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  orders,
  settings,
}) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Menunggu konfirmasi');
  const inProgressOrders = orders.filter((o) => o.status === 'Diproses');
  const completedOrders = orders.filter((o) => o.status === 'Selesai');

  // Status breakdown
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B93838] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Panel Manajemen Toko</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810] mt-1">
            Selamat Datang, Admin {settings.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#705346] mt-1">
            Pantau arus pesanan, kelola ketersediaan kue, dan atur promo spesial toko Anda di sini.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/produk"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#2C1810] text-[#FAF6F0] rounded-xl text-xs font-semibold hover:bg-[#3D2318] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-200" />
            <span>Tambah Kue</span>
          </Link>
          <Link
            to="/admin/pesanan"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#B93838] text-white rounded-xl text-xs font-semibold hover:bg-[#9E2A2A] transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Lihat Pesanan ({pendingOrders.length} Baru)</span>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards (4-column grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD5] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-[#705346]">
            <span>Total Pendapatan Tercatat</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-[#2C1810] tabular-nums">
            {formatRupiah(totalRevenue)}
          </p>
          <p className="text-[11px] text-[#8C7368]">Akumulasi dari {orders.length} transaksi</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD5] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-[#705346]">
            <span>Total Pesanan Masuk</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-[#2C1810] tabular-nums">
            {orders.length}
          </p>
          <p className="text-[11px] text-amber-800 font-semibold">
            {pendingOrders.length} menunggu konfirmasi
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD5] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-[#705346]">
            <span>Jumlah Menu Kue Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Cake className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-[#2C1810] tabular-nums">
            {products.length}
          </p>
          <p className="text-[11px] text-[#8C7368]">Tersebar di {categories.length} kategori</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD5] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-[#705346]">
            <span>Pesanan Selesai / Terkirim</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-[#2C1810] tabular-nums">
            {completedOrders.length}
          </p>
          <p className="text-[11px] text-[#8C7368]">Tingkat penyelesaian tinggi</p>
        </div>
      </div>

      {/* Visual Status Breakdown & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Status Distribution */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#E8DFD5] shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#2C1810]">
            Distribusi Status Pesanan
          </h3>
          <div className="space-y-3">
            {[
              'Menunggu konfirmasi',
              'Dikonfirmasi',
              'Diproses',
              'Siap diambil',
              'Dikirim',
              'Selesai',
              'Dibatalkan',
            ].map((status) => {
              const count = statusCounts[status] || 0;
              const percent = orders.length > 0 ? (count / orders.length) * 100 : 0;
              const style = getStatusStyle(status as any);

              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#705346]">{status}</span>
                    <span className="font-bold text-[#2C1810] tabular-nums">
                      {count} ({percent.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FAF6F0] overflow-hidden">
                    <div
                      className={`h-full ${style.bg.replace('-50', '-500')}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Operations Guide */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#E8DFD5] shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg text-[#2C1810]">
              Panduan Cepat Admin
            </h3>
            <ul className="space-y-2.5 text-xs text-[#705346]">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#2C1810] font-mono">1.</span>
                <span><strong>Pesanan Masuk:</strong> Begitu pelanggan mengirim pesan WhatsApp, cek nomor pesanan di menu <em>Pesanan</em> lalu ubah status ke <em>Dikonfirmasi</em> atau <em>Diproses</em>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#2C1810] font-mono">2.</span>
                <span><strong>Stok & Harga:</strong> Ubah harga atau tandai produk sebagai <em>Habis</em> langsung di menu <em>Katalog Produk</em>. Perubahan langsung tayang di katalog pelanggan.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#2C1810] font-mono">3.</span>
                <span><strong>Promo & Kupon:</strong> Buat kode kupon diskon baru di menu <em>Promo & Ulasan</em> untuk menarik pelanggan saat akhir pekan.</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-[#F0E6D8] flex gap-3">
            <Link
              to="/admin/pengaturan"
              className="flex-1 py-2.5 px-3 bg-[#FAF6F0] hover:bg-[#EAE0D3] text-[#2C1810] text-center rounded-xl text-xs font-semibold transition-colors"
            >
              Pengaturan Kontak & Toko
            </Link>
            <Link
              to="/admin/kategori"
              className="flex-1 py-2.5 px-3 bg-[#FAF6F0] hover:bg-[#EAE0D3] text-[#2C1810] text-center rounded-xl text-xs font-semibold transition-colors"
            >
              Kelola Kategori
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white rounded-3xl border border-[#E8DFD5] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E8DFD5] flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#2C1810]">Pesanan Terbaru</h3>
            <p className="text-xs text-[#705346]">Daftar 5 pesanan terkini yang masuk ke sistem.</p>
          </div>
          <Link
            to="/admin/pesanan"
            className="text-xs font-semibold text-[#B93838] hover:underline flex items-center gap-1"
          >
            <span>Semua Pesanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] text-[#705346] font-semibold border-b border-[#E8DFD5]">
              <tr>
                <th className="p-4">ID Pesanan</th>
                <th className="p-4">Nama Pelanggan</th>
                <th className="p-4">Item & Varian</th>
                <th className="p-4">Total</th>
                <th className="p-4">Pengambilan</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E6D8]">
              {orders.slice(0, 5).map((order) => {
                const style = getStatusStyle(order.status);
                return (
                  <tr key={order.id} className="hover:bg-stone-50">
                    <td className="p-4 font-mono font-bold text-[#2C1810]">{order.id}</td>
                    <td className="p-4">
                      <p className="font-semibold text-[#2C1810]">{order.customerName}</p>
                      <p className="text-[11px] text-[#8C7368]">{order.customerPhone}</p>
                    </td>
                    <td className="p-4 max-w-xs">
                      {order.items.map((it, idx) => (
                        <p key={idx} className="truncate">
                          {it.quantity}x {it.name}
                        </p>
                      ))}
                    </td>
                    <td className="p-4 font-bold text-[#2C1810] tabular-nums">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="p-4 text-[#705346]">
                      {order.deliveryDate} ({order.deliveryTime})
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${style.bg} ${style.text} ${style.border}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
