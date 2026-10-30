export type OrderStatus =
  | 'Menunggu konfirmasi'
  | 'Dikonfirmasi'
  | 'Diproses'
  | 'Siap diambil'
  | 'Dikirim'
  | 'Selesai'
  | 'Dibatalkan';

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  price: number;
  discountPrice?: number;
  stock: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  description: string;
  imageUrl: string;
  variants: ProductVariant[];
  badge?: 'Best Seller' | 'Baru' | 'Promo' | null;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  ingredients?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  iconName: string;
}

export interface CartItem {
  id: string; // unique cart line item id
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  variantSelected: Record<string, string>;
  quantity: number;
  notes: string;
  imageUrl: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress?: string;
  deliveryDate: string;
  deliveryTime: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  total: number;
  specialNotes?: string;
  status: OrderStatus;
  createdAt: string;
  source: 'whatsapp' | 'manual' | 'online';
}

export interface StoreSettings {
  name: string;
  slogan: string;
  whatsappNumber: string; // Clean numerical, e.g. "6281234567890"
  whatsappDisplay: string; // Formatted display, e.g. "0812-3456-7890"
  address: string;
  operatingHours: string;
  instagram: string;
  mapsUrl: string;
  mapsEmbedQuery: string;
  promoBannerText: string;
  isPromoBannerActive: boolean;
  storeDescription: string;
  logoUrl: string;
}

export interface Promo {
  id: string;
  code: string;
  title: string;
  discountPercent: number;
  validUntil: string;
  isActive: boolean;
  minPurchase: number;
}

export interface Testimonial {
  id: string;
  customerName: string;
  roleOrEvent: string;
  rating: number;
  comment: string;
  date: string;
  avatarUrl?: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'superadmin' | 'admin';
}
