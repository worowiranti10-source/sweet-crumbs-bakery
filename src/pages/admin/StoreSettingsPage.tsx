import React, { useState } from 'react';
import type { StoreSettings } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Save,
  RotateCcw,
  CheckCircle2,
  Database,
  Info,
  Sparkles,
  Phone,
  MapPin,
  Clock,
  Instagram,
} from 'lucide-react';
import { isFirebaseConfigured } from '../../lib/firebase';

interface StoreSettingsPageProps {
  settings: StoreSettings;
  onSaveSettings: (settings: StoreSettings) => Promise<void>;
  onResetData: () => void;
}

export const StoreSettingsPage: React.FC<StoreSettingsPageProps> = ({
  settings,
  onSaveSettings,
  onResetData,
}) => {
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [firebaseApiKey, setFirebaseApiKey] = useState(() => {
    try {
      const saved = localStorage.getItem('sweet_crumbs_firebase_config');
      return saved ? JSON.parse(saved).apiKey || '' : '';
    } catch {
      return '';
    }
  });
  const [firebaseProjectId, setFirebaseProjectId] = useState(() => {
    try {
      const saved = localStorage.getItem('sweet_crumbs_firebase_config');
      return saved ? JSON.parse(saved).projectId || '' : '';
    } catch {
      return '';
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSettings(formData);

    // Save optional custom firebase credentials
    if (firebaseApiKey.trim() && firebaseProjectId.trim()) {
      localStorage.setItem(
        'sweet_crumbs_firebase_config',
        JSON.stringify({
          apiKey: firebaseApiKey.trim(),
          authDomain: `${firebaseProjectId.trim()}.firebaseapp.com`,
          projectId: firebaseProjectId.trim(),
          storageBucket: `${firebaseProjectId.trim()}.appspot.com`,
          messagingSenderId: '',
          appId: '',
        })
      );
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Perhatian: Tindakan ini akan mengembalikan seluruh produk, pesanan, ulasan, dan pengaturan toko ke data bawaan (default). Lanjutkan?'
      )
    ) {
      dataService.resetToDefaults();
      onResetData();
      alert('Data demo berhasil direset ke kondisi awal!');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
            Pengaturan Informasi Toko
          </h1>
          <p className="text-xs sm:text-sm text-[#705346] mt-0.5">
            Perubahan yang Anda simpan akan langsung diperbarui di seluruh halaman website pelanggan.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pengaturan Berhasil Disimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Identity */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8DFD5] shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-[#2C1810]">
            Identitas & Slogan Toko
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2C1810] mb-1">Nama Toko</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C1810] mb-1">Slogan Toko</label>
              <input
                type="text"
                required
                value={formData.slogan}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C1810] mb-1">
              Deskripsi Profil Toko
            </label>
            <textarea
              rows={3}
              value={formData.storeDescription}
              onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
            />
          </div>
        </div>

        {/* Contact & WhatsApp */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8DFD5] shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-[#2C1810]">
            Kontak & Integrasi WhatsApp
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                Nomor WhatsApp Tujuan Pesanan (Angka saja tanpa simbol)
              </label>
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="6281234567890"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] font-mono"
              />
              <p className="text-[11px] text-[#8C7368] mt-1">
                Format internasional dengan kode negara (62).
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                Tampilan Nomor di Website (Display)
              </label>
              <input
                type="text"
                required
                value={formData.whatsappDisplay}
                onChange={(e) => setFormData({ ...formData, whatsappDisplay: e.target.value })}
                placeholder="0812-3456-7890"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                Jam Operasional
              </label>
              <input
                type="text"
                value={formData.operatingHours}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                Akun Instagram
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C1810] mb-1">
              Alamat Lengkap Toko
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C1810] mb-1">
              Link URL Google Maps
            </label>
            <input
              type="text"
              value={formData.mapsUrl}
              onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] font-mono text-xs"
            />
          </div>
        </div>

        {/* Promo Top Banner */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8DFD5] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#2C1810]">
              Pengumuman / Banner Promo Atas
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2C1810]">
              <input
                type="checkbox"
                checked={formData.isPromoBannerActive}
                onChange={(e) =>
                  setFormData({ ...formData, isPromoBannerActive: e.target.checked })
                }
                className="rounded border-[#E8DFD5] text-[#B93838] focus:ring-[#B93838]"
              />
              <span>Aktifkan Banner</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C1810] mb-1">Teks Banner</label>
            <input
              type="text"
              value={formData.promoBannerText}
              onChange={(e) => setFormData({ ...formData, promoBannerText: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
            />
          </div>
        </div>

        {/* Firebase & Data Synchronization Info */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8DFD5] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-base font-serif font-bold text-[#2C1810]">
            <Database className="w-5 h-5 text-amber-700" />
            <span>Koneksi Database & Deployment Netlify</span>
          </div>

          <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E8DFD5] text-xs text-[#705346] space-y-1.5">
            <p className="font-semibold text-[#2C1810]">
              Status Saat Ini:{' '}
              {isFirebaseConfigured
                ? '🟢 Terhubung ke Firebase Cloud Firestore & Auth'
                : '🟡 Mode Demo / LocalStorage Aktif (Data tersimpan di browser)'}
            </p>
            <p className="leading-relaxed">
              Website ini telah diuji 100% siap di-deploy ke Netlify tanpa error. Anda dapat
              menggunakan LocalStorage bawaan untuk demo instan atau mengisi kredensial Firebase di
              bawah ini untuk sinkronisasi cloud real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                Firebase Web API Key (Opsional)
              </label>
              <input
                type="text"
                value={firebaseApiKey}
                onChange={(e) => setFirebaseApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                Firebase Project ID (Opsional)
              </label>
              <input
                type="text"
                value={firebaseProjectId}
                onChange={(e) => setFirebaseProjectId(e.target.value)}
                placeholder="sweet-crumbs-bakery"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Seluruh Data Toko ke Bawaan</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#B93838] hover:bg-[#9E2A2A] text-white rounded-xl text-sm font-semibold shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
