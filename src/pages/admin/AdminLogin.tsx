import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Eye, EyeOff, Lock, Mail, ArrowLeft, AlertCircle, Info } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@sweetcrumbs.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error, isFirebaseActive } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
    if (success) {
      navigate('/admin');
    }
  };

  const handleUseDemoCreds = () => {
    setEmail('admin@sweetcrumbs.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xl space-y-6">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#705346] hover:text-[#2C1810] font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Website Toko</span>
        </Link>

        {/* Brand Lockup */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#2C1810] text-amber-200 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2C1810]">
            Admin Control Panel
          </h1>
          <p className="text-xs text-[#705346]">
            Masuk untuk mengelola produk, pesanan, dan pengaturan Sweet Crumbs Bakery.
          </p>
        </div>

        {/* Mode Info Callout */}
        <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E8DFD5] text-xs text-[#705346] space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-[#2C1810]">
            <Info className="w-3.5 h-3.5 text-amber-700" />
            <span>Mode Aktif: {isFirebaseActive ? 'Firebase Auth' : 'Demo Mode (Lokal)'}</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Akun demo tersedia otomatis: <code className="font-mono bg-white px-1 py-0.5 rounded border border-stone-200">admin@sweetcrumbs.com</code> / <code className="font-mono bg-white px-1 py-0.5 rounded border border-stone-200">admin123</code>
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2C1810] mb-1">
              Email / Username Admin
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#998075] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sweetcrumbs.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B93838]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C1810] mb-1">
              Kata Sandi / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#998075] absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B93838]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-[#998075] hover:text-[#2C1810]"
                aria-label="Tampilkan atau sembunyikan password"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#2C1810] hover:bg-[#3D2318] text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Memeriksa Kredensial...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleUseDemoCreds}
            className="text-xs text-[#B93838] hover:underline font-semibold"
          >
            Gunakan Kredensial Demo Cepat
          </button>
        </div>
      </div>
    </div>
  );
};
