# 🍰 Sweet Crumbs Bakery — "Manis di Setiap Gigitan"

Website toko kue online modern, elegan, profesional, dan responsif. Dilengkapi dengan katalog menu interaktif, keranjang belanja cerdas, integrasi checkout WhatsApp otomatis, serta Admin Control Panel lengkap untuk manajemen produk, pesanan, kategori, dan promo.

---

## 🚀 Fitur Utama

### 🛍️ Halaman Pelanggan
1. **Beranda (Home):**
   - Hero section elegan dengan slogan *"Manis di Setiap Gigitan."*
   - Carousel kategori menu kue & patisserie.
   - Produk unggulan (Best Seller & Promo) dengan fitur quick-add.
   - Cerita dapur artisan, 4 pilar kualitas bahan (100% Halal, Fresh Daily).
   - Testimoni pelanggan nyata beserta rating bintang.
   - Peta lokasi Google Maps interaktif & info operasional toko.
2. **Katalog Produk:**
   - 6 Kategori lengkap: *Kue Ulang Tahun*, *Brownies & Cake*, *Cupcake*, *Cookies & Kue Kering*, *Roti & Pastry*, *Paket Hampers*.
   - Filter pencarian instan berdasarkan nama kue, rasa, dan bahan baku.
   - Pengurutan harga (termurah/termahal) dan rating terpopuler.
   - Modal detail kue (PDP): pilihan varian ukuran, topping, lilin, dan catatan ucapan kue.
3. **Keranjang & Checkout WhatsApp:**
   - Tersimpan persisten di `localStorage`.
   - Perhitungan otomatis subtotal, diskon kupon voucher, dan total belanja.
   - Form data pelanggan: Nama, No. WhatsApp, Metode (Ambil di Toko / Pengiriman), Tanggal & Jam, Catatan khusus.
   - Tombol **Lanjut Pesan via WhatsApp** memformat pesan terstruktur rapi dan mencatat nomor pesanan ke database toko.

### 🛡️ Admin Control Panel (`/admin`)
- **Login Terproteksi:** Kredensial aman dengan toggle tampilkan/sembunyikan sandi.
  - *Demo Login:* `admin@sweetcrumbs.com` / `admin123`
- **Dashboard Statistik:** Total pendapatan, jumlah pesanan, status pesanan, dan pesanan terbaru.
- **Manajemen Pesanan:** Update status (*Menunggu konfirmasi*, *Dikonfirmasi*, *Diproses*, *Siap diambil*, *Dikirim*, *Selesai*, *Dibatalkan*), input pesanan manual kasir, dan tombol 1-klik chat update ke WhatsApp pelanggan.
- **Manajemen Produk:** Tambah, edit, hapus kue, atur harga promo, stok, varian rasa/ukuran, dan badge (Best Seller / Baru / Promo).
- **Manajemen Kategori:** Tambah, edit, hapus, dan atur urutan kategori.
- **Pengaturan Toko:** Edit nama toko, slogan, nomor WhatsApp pemesanan, jam buka, alamat, Instagram, dan teks banner pengumuman.
- **Promo & Ulasan:** Kelola kode kupon diskon dan ulasan testimoni pembeli.

---

## 💻 Cara Menjalankan di Komputer Lokal

1. Pastikan **Node.js** (versi 18 ke atas) sudah terpasang.
2. Buka terminal di folder proyek ini:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```
4. Buka browser di `http://localhost:3000` (atau port yang ditampilkan di terminal).
5. Untuk mengakses admin panel, buka `http://localhost:3000/admin`.

---

## 🌐 Panduan Deploy ke Netlify (100% Siap Deploy)

Proyek ini telah dikonfigurasi dengan `netlify.toml` dan `public/_redirects` sehingga **tidak akan mengalami error 404 saat membuka URL `/admin` atau halaman lain secara langsung**.

### Langkah Deploy:
1. Simpan repository ini ke akun **GitHub** atau **GitLab** Anda.
2. Buka dashboard [Netlify](https://app.netlify.com/) dan pilih **"Add new site" -> "Import an existing project"**.
3. Hubungkan dengan repository GitHub Anda.
4. Netlify akan otomatis membaca konfigurasi dari `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. (Opsional) Masukkan Environment Variables di Netlify jika ingin mengaktifkan Firebase:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
6. Klik **"Deploy site"**. Website langsung live tanpa error!

---

## 🔥 Panduan Konfigurasi Firebase (Auth, Firestore, Storage)

Website ini memiliki **arsitektur hybrid (Dual-Mode)**:
- **Mode Demo (Default):** Jika Firebase belum diisi, website tetap berjalan 100% normal menggunakan `localStorage` reaktif. Tidak akan pernah crash atau blank page.
- **Mode Firebase:** Jika Anda ingin menggunakan database cloud online:

1. Buka [Firebase Console](https://console.firebase.google.com/) dan buat project baru.
2. Aktifkan **Authentication**:
   - Buka menu *Authentication* -> *Sign-in method* -> Aktifkan *Email/Password*.
   - Buat akun admin di tab *Users* (misal: `admin@sweetcrumbs.com`).
3. Aktifkan **Cloud Firestore**:
   - Buat database Firestore (mode test atau production).
4. Buat file `.env` di root proyek (atau isi di pengaturan Netlify):
   ```env
   VITE_FIREBASE_API_KEY="AIzaSy..."
   VITE_FIREBASE_AUTH_DOMAIN="project-id.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="project-id"
   VITE_FIREBASE_STORAGE_BUCKET="project-id.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
   VITE_FIREBASE_APP_ID="1:123456:web:abcd"
   ```
5. Anda juga bisa memasukkan API Key dan Project ID langsung melalui menu **Admin Panel -> Pengaturan Toko** tanpa perlu deploy ulang!

---

## 📱 Panduan Mengganti Nomor WhatsApp & Informasi Toko

Anda dapat mengubah nomor WhatsApp dan informasi toko **secara instan tanpa mengedit kode**:
1. Masuk ke halaman admin di `/admin`.
2. Klik menu **Pengaturan Toko**.
3. Di bagian **Nomor WhatsApp Tujuan Pesanan**, masukkan nomor WhatsApp baru (contoh: `6281298765432`).
4. Di bagian **Tampilan Nomor**, masukkan format tampilan ramah (contoh: `0812-9876-5432`).
5. Perbarui alamat toko, jam buka, dan Instagram jika diperlukan.
6. Klik **Simpan Semua Pengaturan**.
7. Semua tombol "Pesan via WhatsApp" dan link customer service di website akan otomatis mengarah ke nomor baru tersebut.

---

## 📦 Struktur Folder Proyek

```
/
├── public/
│   ├── _redirects              # Routing SPA untuk Netlify
│   ├── manifest.webmanifest    # Konfigurasi PWA Android
│   ├── favicon.svg             # Favicon bakery
│   ├── pwa-192x192.svg         # Ikon PWA 192px
│   └── pwa-512x512.svg         # Ikon PWA 512px
├── src/
│   ├── assets/images/          # Foto produk bakery beresolusi tinggi
│   ├── components/             # Komponen UI modular
│   │   ├── Navbar.tsx          # Top bar navigasi & promo banner
│   │   ├── Hero.tsx            # Hero banner & slogan
│   │   ├── CategoryBar.tsx     # Selector tab kategori
│   │   ├── ProductCard.tsx     # Kartu produk responsif
│   │   ├── ProductDetailModal.tsx # Modal detail varian kue
│   │   ├── CartDrawer.tsx      # Keranjang & form pemesanan WA
│   │   ├── StorySection.tsx    # Cerita & filosofi bahan
│   │   ├── TestimonialsSection.tsx # Ulasan pelanggan
│   │   ├── ContactSection.tsx  # Alamat, jam buka, Google Maps
│   │   ├── Footer.tsx          # Footer toko
│   │   └── ErrorBoundary.tsx   # Penangkal layar putih (anti blank page)
│   ├── context/
│   │   ├── CartContext.tsx     # State keranjang & diskon voucher
│   │   └── AuthContext.tsx     # Autentikasi admin
│   ├── lib/
│   │   └── firebase.ts         # Konfigurasi client Firebase
│   ├── pages/
│   │   ├── HomePage.tsx        # Halaman Beranda
│   │   ├── CatalogPage.tsx     # Katalog lengkap & pencarian
│   │   ├── AboutPage.tsx       # Halaman Tentang Kami
│   │   ├── ContactPage.tsx     # Halaman Kontak
│   │   └── admin/              # Halaman Admin Control Panel
│   │       ├── AdminLayout.tsx
│   │       ├── AdminLogin.tsx
│   │       ├── AdminDashboard.tsx
│   │       ├── ProductManagement.tsx
│   │       ├── OrderManagement.tsx
│   │       ├── CategoryManagement.tsx
│   │       ├── StoreSettingsPage.tsx
│   │       └── PromoManagement.tsx
│   ├── services/
│   │   └── dataService.ts      # Service data hybrid (Firebase / LocalStorage)
│   ├── types/
│   │   └── index.ts            # Type definitions TypeScript
│   ├── utils/
│   │   └── formatters.ts       # Format Rupiah & pesan WhatsApp
│   ├── App.tsx                 # Root router aplikasi
│   ├── index.css               # Styling Tailwind & Google Fonts
│   └── main.tsx                # React entry point
├── netlify.toml                # Konfigurasi build Netlify
├── index.html                  # HTML entry point dengan meta SEO & PWA
├── package.json
└── tsconfig.json
```
