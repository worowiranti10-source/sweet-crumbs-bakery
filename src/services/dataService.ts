import type {
  Product,
  Category,
  Order,
  StoreSettings,
  Promo,
  Testimonial,
  OrderStatus,
} from '../types';
import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';

// Default initial data for Sweet Crumbs Bakery
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Kue Ulang Tahun',
    slug: 'kue-ulang-tahun',
    description: 'Kue tart custom & signature untuk momen ulang tahun istimewa.',
    order: 1,
    iconName: 'Cake',
  },
  {
    id: 'cat-2',
    name: 'Brownies & Cake',
    slug: 'brownies-cake',
    description: 'Fudge brownies lumer dan bolu lembut dengan dark chocolate premium.',
    order: 2,
    iconName: 'Cookie',
  },
  {
    id: 'cat-3',
    name: 'Cupcake',
    slug: 'cupcake',
    description: 'Cupcake cantik bertabur buttercream lembut aneka rasa.',
    order: 3,
    iconName: 'Sparkles',
  },
  {
    id: 'cat-4',
    name: 'Cookies & Kue Kering',
    slug: 'cookies',
    description: 'Kue kering renyah dengan butter wisman murni.',
    order: 4,
    iconName: 'Coffee',
  },
  {
    id: 'cat-5',
    name: 'Roti & Pastry',
    slug: 'roti-pastry',
    description: 'Croissant renyah berlapis butter Perancis dan roti artisan fresh.',
    order: 5,
    iconName: 'Wheat',
  },
  {
    id: 'cat-6',
    name: 'Paket Hampers',
    slug: 'hampers',
    description: 'Bingkisan manis elegan untuk hantaran, perayaan, dan hari raya.',
    order: 6,
    iconName: 'Gift',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Signature Red Velvet Birthday Cake',
    slug: 'signature-red-velvet-cake',
    category: 'kue-ulang-tahun',
    categoryName: 'Kue Ulang Tahun',
    price: 285000,
    discountPrice: 255000,
    stock: 12,
    stockStatus: 'in_stock',
    description:
      'Kue Red Velvet klasik dengan bolu lembut berwarna merah marun, diselimuti cream cheese frosting gurih legit dan taburan remah velvet renyah serta buah raspberry segar.',
    imageUrl: '/src/assets/images/cake_red_velvet_1793363737633.jpg',
    variants: [
      { name: 'Ukuran', options: ['Diameter 16cm (4-6 Porsi)', 'Diameter 20cm (8-10 Porsi)', 'Diameter 24cm (12-16 Porsi)'] },
      { name: 'Lilin & Pisau', options: ['Termasuk Pisau + 1 Lilin Angka', 'Termasuk Pisau + 5 Lilin Spiral Emas'] },
    ],
    badge: 'Best Seller',
    rating: 4.9,
    reviewCount: 128,
    isFeatured: true,
    ingredients: ['Tepung Terigu Premium', 'Cream Cheese New Zealand', 'Pure Cocoa', 'Vanilla Extract', 'Fresh Berries'],
  },
  {
    id: 'prod-2',
    name: 'French Butter Croissant & Pain au Chocolat',
    slug: 'french-butter-croissant',
    category: 'roti-pastry',
    categoryName: 'Roti & Pastry',
    price: 32000,
    stock: 25,
    stockStatus: 'in_stock',
    description:
      'Pastry ala Perancis dengan lapisan luar yang super renyah keemasan dan bagian dalam berongga sarang madu yang lembut harum mentega murni Lescure.',
    imageUrl: '/src/assets/images/pastry_croissants_1793363737837.jpg',
    variants: [
      { name: 'Pilihan Varian', options: ['Classic Butter Croissant', 'Pain au Chocolat (Isi Dark Chocolate)', 'Almond Cream Croissant'] },
      { name: 'Penyajian', options: ['Hangat (Freshly Warmed)', 'Suhu Ruangan'] },
    ],
    badge: 'Best Seller',
    rating: 4.8,
    reviewCount: 94,
    isFeatured: true,
    ingredients: ['French Lescure Butter', 'Tepung Protein Tinggi', 'Susu Segar', 'Ragi Alami'],
  },
  {
    id: 'prod-3',
    name: 'Fudgy Dark Chocolate Brownies',
    slug: 'fudgy-dark-chocolate-brownies',
    category: 'brownies-cake',
    categoryName: 'Brownies & Cake',
    price: 95000,
    discountPrice: 85000,
    stock: 18,
    stockStatus: 'in_stock',
    description:
      'Brownies panggang dengan lapisan atas shiny crust tipis renyah dan bagian dalam padat lumer (fudgy), menggunakan dark chocolate couverture Belgia 70% dan taburan garam laut fleur de sel.',
    imageUrl: '/src/assets/images/brownies_fudge_1793363738739.jpg',
    variants: [
      { name: 'Topping', options: ['Sea Salt & Choco Chips', 'Roasted Almond Slice', 'Cream Cheese Swirl', 'Lotus Biscoff Spread'] },
      { name: 'Ukuran Kotak', options: ['Kotak 20x10 cm (10 Potong)', 'Kotak 20x20 cm (20 Potong)'] },
    ],
    badge: 'Promo',
    rating: 4.9,
    reviewCount: 215,
    isFeatured: true,
    ingredients: ['Belgian Dark Chocolate 70%', 'Pure Butter', 'Brown Sugar', 'Telur Omega', 'Fleur de Sel'],
  },
  {
    id: 'prod-4',
    name: 'Pastel Garden Cupcake Box (Isi 6)',
    slug: 'pastel-garden-cupcake-box',
    category: 'cupcake',
    categoryName: 'Cupcake',
    price: 135000,
    stock: 15,
    stockStatus: 'in_stock',
    description:
      'Kotak hampers berisi 6 cupcake artisan dengan base sponge cake lembut dan hiasan buttercream swirl warna pastel yang anggun dengan taburan kelopak bunga kering edible.',
    imageUrl: '/src/assets/images/cupcakes_assorted_1793363738202.jpg',
    variants: [
      { name: 'Kombinasi Rasa', options: ['Mix 3 Rasa (Vanilla, Red Velvet, Matcha)', 'Full Belgian Chocolate', 'Vanilla Bean Dream'] },
      { name: 'Kemasan', options: ['Box Kraft Pita Cantik', 'Box Akrilik Transparan (+Rp 20.000)'] },
    ],
    badge: 'Baru',
    rating: 4.9,
    reviewCount: 62,
    isFeatured: true,
    ingredients: ['Sponge Vanilla', 'Buttercream Swiss Meringue', 'Matcha Uji', 'Edible Flowers'],
  },
  {
    id: 'prod-5',
    name: 'Classic Choco Chip & Walnut Soft Cookies',
    slug: 'classic-choco-chip-cookies',
    category: 'cookies',
    categoryName: 'Cookies & Kue Kering',
    price: 45000,
    stock: 30,
    stockStatus: 'in_stock',
    description:
      'Soft baked cookies gaya New York dengan pinggiran renyah dan bagian tengah chewy yang meleleh di mulut ketika dihangatkan. Diisi penuh cokelat leleh dan kenari panggang.',
    imageUrl: '/src/assets/images/brownies_fudge_1793363738739.jpg',
    variants: [
      { name: 'Paket Jumlah', options: ['Satuan (1 pcs besar)', 'Pack isi 3 pcs', 'Jar isi 6 pcs (+Rp 55.000)'] },
      { name: 'Varian Rasa', options: ['Triple Dark Chocolate', 'Walnut Choco Chip', 'Red Velvet White Chip'] },
    ],
    badge: null,
    rating: 4.8,
    reviewCount: 78,
    isFeatured: false,
    ingredients: ['Callebaut Dark Chocolate', 'Brown Sugar Muscovado', 'California Walnut', 'Salted Butter'],
  },
  {
    id: 'prod-6',
    name: 'Royal Blossom Bakery Hampers Set',
    slug: 'royal-blossom-hampers-set',
    category: 'hampers',
    categoryName: 'Paket Hampers',
    price: 395000,
    discountPrice: 350000,
    stock: 8,
    stockStatus: 'low_stock',
    description:
      'Paket bingkisan mewah eksklusif berisi 1 jar Kastengel Wisman, 1 jar Choco Chip Cookies, 1 kotak Fudgy Brownies, kartu ucapan custom cetak, dan pita satin elegan.',
    imageUrl: '/src/assets/images/cupcakes_assorted_1793363738202.jpg',
    variants: [
      { name: 'Pilihan Kue Jar', options: ['Kastengel + Nastar Premium', 'Nastar + Choco Chip Cookies', 'Putri Salju + Kastengel'] },
      { name: 'Tema Kartu Ucapan', options: ['Happy Birthday', 'Congratulations / Sukses Selalu', 'Thank You / Terima Kasih', 'Polos (Ditulis Tangan)'] },
    ],
    badge: 'Best Seller',
    rating: 5.0,
    reviewCount: 45,
    isFeatured: true,
    ingredients: ['Wijsman Dutch Butter', 'Keju Edam & Cheddar Tua', 'Nanas Segar Madu', 'Dark Chocolate'],
  },
  {
    id: 'prod-7',
    name: 'Basque Burnt Cheesecake Salted Caramel',
    slug: 'basque-burnt-cheesecake',
    category: 'brownies-cake',
    categoryName: 'Brownies & Cake',
    price: 245000,
    stock: 10,
    stockStatus: 'in_stock',
    description:
      'Kue keju khas Basque Spanyol dengan lapisan atas terpanggang karamel yang eksotis dan bagian dalam yang creamy meleleh dengan saus salted caramel buatan rumah.',
    imageUrl: '/src/assets/images/cake_red_velvet_1793363737633.jpg',
    variants: [
      { name: 'Ukuran', options: ['Diameter 16cm (4-6 Porsi)', 'Diameter 20cm (8-10 Porsi)'] },
      { name: 'Saus Tambahan', options: ['Salted Caramel Sauce', 'Strawberry Coulis', 'Tanpa Saus Tambahan'] },
    ],
    badge: 'Baru',
    rating: 4.9,
    reviewCount: 38,
    isFeatured: false,
    ingredients: ['Philadelphia Cream Cheese', 'Heavy Dairy Cream', 'Gula Aren Organik', 'Sea Salt'],
  },
  {
    id: 'prod-8',
    name: 'Golden Brioche Loaf & Cinnamon Rolls',
    slug: 'golden-brioche-cinnamon-rolls',
    category: 'roti-pastry',
    categoryName: 'Roti & Pastry',
    price: 68000,
    stock: 14,
    stockStatus: 'in_stock',
    description:
      'Roti brioche mentega dengan serat super lembut seperti kapas dipadukan dengan cinnamon roll beraroma kayu manis Ceylon dan cream cheese glaze lezat.',
    imageUrl: '/src/assets/images/pastry_croissants_1793363737837.jpg',
    variants: [
      { name: 'Pilihan Item', options: ['Box Isi 4 Cinnamon Rolls', '1 Loaf Brioche Butter Bread', 'Combo Brioche + 2 Cinnamon Rolls'] },
    ],
    badge: null,
    rating: 4.7,
    reviewCount: 51,
    isFeatured: false,
    ingredients: ['Ceylon Cinnamon Powder', 'Grass-fed Butter', 'Cream Cheese Glaze', 'Organic Flour'],
  },
];

export const INITIAL_SETTINGS: StoreSettings = {
  name: 'Sweet Crumbs Bakery',
  slogan: 'Manis di Setiap Gigitan.',
  whatsappNumber: '6281234567890',
  whatsappDisplay: '0812-3456-7890',
  address: 'Jl. Boulevard Manis No. 42, Kebayoran Baru, Jakarta Selatan 12150',
  operatingHours: 'Setiap Hari: 08.00 - 20.00 WIB',
  instagram: '@sweetcrumbs.bakery',
  mapsUrl: 'https://maps.google.com/?q=Jakarta+Selatan',
  mapsEmbedQuery: 'Jakarta Selatan',
  promoBannerText: '✨ DISKON SPESIAL 10%: Masukkan kode SWEETCRUMBS10 untuk semua pesanan minggu ini!',
  isPromoBannerActive: true,
  storeDescription:
    'Sweet Crumbs Bakery menghadirkan aneka kue tart ulang tahun custom, fudge brownies lumer, cupcake cantik, pastry renyah, dan cookies premium dengan bahan alami 100% halal dan tanpa bahan pengawet.',
  logoUrl: '',
};

export const INITIAL_PROMOS: Promo[] = [
  {
    id: 'promo-1',
    code: 'SWEETCRUMBS10',
    title: 'Diskon Manis Pembuka',
    discountPercent: 10,
    validUntil: '2026-12-31',
    isActive: true,
    minPurchase: 100000,
  },
  {
    id: 'promo-2',
    code: 'HAMPERS15',
    title: 'Diskon Spesial Hampers',
    discountPercent: 15,
    validUntil: '2026-11-30',
    isActive: true,
    minPurchase: 300000,
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'testi-1',
    customerName: 'Anindya Putri',
    roleOrEvent: 'Ulang Tahun ke-25',
    rating: 5,
    comment:
      'Red Velvet Birthday Cake-nya beneran enak banget! Cream cheese-nya pas, ga bikin enek, kuenya moist banget. Tamu-tamu di pesta pada nanyain pesen di mana. Pelayanan via WhatsApp juga super ramah dan fast response!',
    date: '28 Oktober 2026',
  },
  {
    id: 'testi-2',
    customerName: 'Bagas Wicaksono',
    roleOrEvent: 'Corporate Hampers Event',
    rating: 5,
    comment:
      'Pesan 20 paket hampers untuk klien kantor. Packaging-nya sangat mewah, pengiriman tepat waktu, dan respon admin sangat profesional. Kastengel dan Fudgy Brownies-nya dapat banyak pujian dari rekan bisnis.',
    date: '25 Oktober 2026',
  },
  {
    id: 'testi-3',
    customerName: 'Nadia Salsabila',
    roleOrEvent: 'Langganan Roti Pagi',
    rating: 5,
    comment:
      'Croissant dan pain au chocolat terenak di kawasan Kebayoran. Kulitnya flaky kriuk banget dan aroma butter-nya wangi sekali saat dihangatkan. Selalu langganan tiap weekend!',
    date: '20 Oktober 2026',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'SCB-2610-001',
    customerName: 'Dina Lestari',
    customerPhone: '081398765432',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Jl. Senopati Raya No. 18, Kebayoran Baru, Jakarta Selatan',
    deliveryDate: '2026-10-31',
    deliveryTime: '13:00 WIB',
    items: [
      {
        id: 'cart-init-1',
        productId: 'prod-1',
        name: 'Signature Red Velvet Birthday Cake',
        price: 255000,
        variantSelected: {
          Ukuran: 'Diameter 20cm (8-10 Porsi)',
          'Lilin & Pisau': 'Termasuk Pisau + 5 Lilin Spiral Emas',
        },
        quantity: 1,
        notes: 'Tulisan di kue: "Happy 24th Birthday Dina", mohon dikirim hati-hati.',
        imageUrl: '/src/assets/images/cake_red_velvet_1793363737633.jpg',
      },
    ],
    subtotal: 255000,
    discount: 25500,
    promoCode: 'SWEETCRUMBS10',
    total: 229500,
    specialNotes: 'Tolong sertakan kartu ucapan warna pastel.',
    status: 'Diproses',
    createdAt: '2026-10-30T04:15:00.000Z',
    source: 'whatsapp',
  },
  {
    id: 'SCB-2610-002',
    customerName: 'Reza Pratama',
    customerPhone: '081287654321',
    deliveryMethod: 'pickup',
    deliveryDate: '2026-10-30',
    deliveryTime: '17:30 WIB',
    items: [
      {
        id: 'cart-init-2',
        productId: 'prod-3',
        name: 'Fudgy Dark Chocolate Brownies',
        price: 85000,
        variantSelected: {
          Topping: 'Sea Salt & Choco Chips',
          'Ukuran Kotak': 'Kotak 20x20 cm (20 Potong)',
        },
        quantity: 2,
        notes: 'Dipotong 20 bagian.',
        imageUrl: '/src/assets/images/brownies_fudge_1793363738739.jpg',
      },
    ],
    subtotal: 170000,
    discount: 0,
    total: 170000,
    specialNotes: 'Diambil sendiri sepulang kantor.',
    status: 'Siap diambil',
    createdAt: '2026-10-30T02:30:00.000Z',
    source: 'whatsapp',
  },
];

// Helper to interact with LocalStorage
function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`sweet_crumbs_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`sweet_crumbs_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export const dataService = {
  // Products
  async getProducts(): Promise<Product[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (!querySnapshot.empty) {
          return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
        }
      } catch (err) {
        console.warn('Firebase getProducts failed, using local storage fallback', err);
      }
    }
    return getLocal<Product[]>('products', INITIAL_PRODUCTS);
  },

  async saveProduct(product: Product): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'products', product.id), product);
      } catch (err) {
        console.warn('Firebase saveProduct failed, saving to local storage', err);
      }
    }
    const current = getLocal<Product[]>('products', INITIAL_PRODUCTS);
    const index = current.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      current[index] = product;
    } else {
      current.unshift(product);
    }
    setLocal('products', current);
  },

  async deleteProduct(productId: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'products', productId));
      } catch (err) {
        console.warn('Firebase deleteProduct failed, deleting from local storage', err);
      }
    }
    const current = getLocal<Product[]>('products', INITIAL_PRODUCTS);
    const filtered = current.filter((p) => p.id !== productId);
    setLocal('products', filtered);
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Category);
        }
      } catch (err) {
        console.warn('Firebase getCategories failed, using local fallback', err);
      }
    }
    return getLocal<Category[]>('categories', INITIAL_CATEGORIES);
  },

  async saveCategory(category: Category): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'categories', category.id), category);
      } catch (err) {
        console.warn('Firebase saveCategory failed', err);
      }
    }
    const current = getLocal<Category[]>('categories', INITIAL_CATEGORIES);
    const index = current.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      current[index] = category;
    } else {
      current.push(category);
    }
    setLocal('categories', current);
  },

  async deleteCategory(categoryId: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'categories', categoryId));
      } catch (err) {
        console.warn('Firebase deleteCategory failed', err);
      }
    }
    const current = getLocal<Category[]>('categories', INITIAL_CATEGORIES);
    setLocal(
      'categories',
      current.filter((c) => c.id !== categoryId)
    );
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
        }
      } catch (err) {
        console.warn('Firebase getOrders failed, using local storage fallback', err);
      }
    }
    return getLocal<Order[]>('orders', INITIAL_ORDERS);
  },

  async createOrder(order: Order): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'orders', order.id), order);
      } catch (err) {
        console.warn('Firebase createOrder failed, saving to local storage', err);
      }
    }
    const current = getLocal<Order[]>('orders', INITIAL_ORDERS);
    current.unshift(order);
    setLocal('orders', current);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'orders', orderId), { status });
      } catch (err) {
        console.warn('Firebase updateOrderStatus failed', err);
      }
    }
    const current = getLocal<Order[]>('orders', INITIAL_ORDERS);
    const index = current.findIndex((o) => o.id === orderId);
    if (index >= 0) {
      current[index].status = status;
      setLocal('orders', current);
    }
  },

  // Store Settings
  async getSettings(): Promise<StoreSettings> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'settings'));
        if (!querySnapshot.empty) {
          return querySnapshot.docs[0].data() as StoreSettings;
        }
      } catch (err) {
        console.warn('Firebase getSettings failed', err);
      }
    }
    return getLocal<StoreSettings>('settings', INITIAL_SETTINGS);
  },

  async saveSettings(settings: StoreSettings): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'settings', 'general'), settings);
      } catch (err) {
        console.warn('Firebase saveSettings failed', err);
      }
    }
    setLocal('settings', settings);
  },

  // Promos
  async getPromos(): Promise<Promo[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'promos'));
        if (!querySnapshot.empty) {
          return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Promo);
        }
      } catch (err) {
        console.warn('Firebase getPromos failed', err);
      }
    }
    return getLocal<Promo[]>('promos', INITIAL_PROMOS);
  },

  async savePromo(promo: Promo): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'promos', promo.id), promo);
      } catch (err) {
        console.warn('Firebase savePromo failed', err);
      }
    }
    const current = getLocal<Promo[]>('promos', INITIAL_PROMOS);
    const index = current.findIndex((p) => p.id === promo.id);
    if (index >= 0) {
      current[index] = promo;
    } else {
      current.push(promo);
    }
    setLocal('promos', current);
  },

  async deletePromo(promoId: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'promos', promoId));
      } catch (err) {
        console.warn('Firebase deletePromo failed', err);
      }
    }
    const current = getLocal<Promo[]>('promos', INITIAL_PROMOS);
    setLocal(
      'promos',
      current.filter((p) => p.id !== promoId)
    );
  },

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'testimonials'));
        if (!querySnapshot.empty) {
          return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Testimonial);
        }
      } catch (err) {
        console.warn('Firebase getTestimonials failed', err);
      }
    }
    return getLocal<Testimonial[]>('testimonials', INITIAL_TESTIMONIALS);
  },

  async saveTestimonial(testimonial: Testimonial): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'testimonials', testimonial.id), testimonial);
      } catch (err) {
        console.warn('Firebase saveTestimonial failed', err);
      }
    }
    const current = getLocal<Testimonial[]>('testimonials', INITIAL_TESTIMONIALS);
    const index = current.findIndex((t) => t.id === testimonial.id);
    if (index >= 0) {
      current[index] = testimonial;
    } else {
      current.push(testimonial);
    }
    setLocal('testimonials', current);
  },

  async deleteTestimonial(testiId: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'testimonials', testiId));
      } catch (err) {
        console.warn('Firebase deleteTestimonial failed', err);
      }
    }
    const current = getLocal<Testimonial[]>('testimonials', INITIAL_TESTIMONIALS);
    setLocal(
      'testimonials',
      current.filter((t) => t.id !== testiId)
    );
  },

  // Reset demo data to defaults
  resetToDefaults(): void {
    setLocal('products', INITIAL_PRODUCTS);
    setLocal('categories', INITIAL_CATEGORIES);
    setLocal('settings', INITIAL_SETTINGS);
    setLocal('promos', INITIAL_PROMOS);
    setLocal('testimonials', INITIAL_TESTIMONIALS);
    setLocal('orders', INITIAL_ORDERS);
  },
};
