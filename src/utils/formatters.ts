import type { Order, OrderStatus } from '../types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cleanPhoneForWhatsApp(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export function buildWhatsAppOrderMessage(order: Order, storeName: string = 'Sweet Crumbs Bakery'): string {
  const itemsText = order.items
    .map((item, idx) => {
      const variantStr = Object.entries(item.variantSelected || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      const variantPart = variantStr ? `\n   └ *Varian:* ${variantStr}` : '';
      const notesPart = item.notes ? `\n   └ *Catatan Kue:* ${item.notes}` : '';
      return `${idx + 1}. *${item.name}* (x${item.quantity}) - ${formatRupiah(item.price * item.quantity)}${variantPart}${notesPart}`;
    })
    .join('\n\n');

  const methodText = order.deliveryMethod === 'pickup' ? 'Ambil di Toko (Pick-up)' : 'Pengiriman (Delivery)';
  const addressPart = order.deliveryAddress ? `\n📍 *Alamat Pengiriman:* ${order.deliveryAddress}` : '';
  const discountPart = order.discount > 0 ? `\n🎉 *Diskon Voucher (${order.promoCode || 'PROMO'}):* -${formatRupiah(order.discount)}` : '';
  const specialNotesPart = order.specialNotes ? `\n📝 *Catatan Khusus:* ${order.specialNotes}` : '';

  return `Halo ${storeName}! 👋
Saya ingin memesan kue manis dengan rincian berikut:

🔖 *ID Pesanan:* ${order.id}
👤 *Nama Pemesan:* ${order.customerName}
📞 *No. WhatsApp:* ${order.customerPhone}
🚚 *Metode:* ${methodText}
📅 *Tanggal & Waktu:* ${order.deliveryDate} | ${order.deliveryTime}${addressPart}

📋 *Daftar Pesanan:*
${itemsText}

──────────────────
💵 *Subtotal:* ${formatRupiah(order.subtotal)}${discountPart}
💰 *TOTAL:* *${formatRupiah(order.total)}*
${specialNotesPart}

Mohon dicek ketersediaannya dan instruksi pembayaran/rekeningnya ya Kak. Terima kasih! 🙏🍰`;
}

export function getStatusStyle(status: OrderStatus): { bg: string; text: string; border: string } {
  switch (status) {
    case 'Menunggu konfirmasi':
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
    case 'Dikonfirmasi':
      return { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' };
    case 'Diproses':
      return { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' };
    case 'Siap diambil':
      return { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' };
    case 'Dikirim':
      return { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' };
    case 'Selesai':
      return { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' };
    case 'Dibatalkan':
      return { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' };
    default:
      return { bg: 'bg-stone-50', text: 'text-stone-800', border: 'border-stone-200' };
  }
}
