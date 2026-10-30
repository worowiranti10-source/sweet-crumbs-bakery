import React, { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Cake,
  FolderTree,
  ShoppingBag,
  Settings,
  Tag,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  Database,
} from 'lucide-react';
import type { StoreSettings } from '../../types';

interface AdminLayoutProps {
  settings: StoreSettings;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ settings }) => {
  const { user, logout, isFirebaseActive } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Pesanan', path: '/admin/pesanan', icon: ShoppingBag },
    { label: 'Katalog Produk', path: '/admin/produk', icon: Cake },
    { label: 'Kategori', path: '/admin/kategori', icon: FolderTree },
    { label: 'Promo & Ulasan', path: '/admin/promo-ulasan', icon: Tag },
    { label: 'Pengaturan Toko', path: '/admin/pengaturan', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F5ECE0]/50 flex flex-col md:flex-row text-[#2C1810]">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E8DFD5] shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E8DFD5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2C1810] text-[#FAF6F0] flex items-center justify-center font-serif font-bold text-sm">
              SC
            </div>
            <div>
              <h2 className="font-serif font-bold text-sm text-[#2C1810] leading-none">
                Admin Panel
              </h2>
              <p className="text-[11px] text-[#705346] mt-0.5">{settings.name}</p>
            </div>
          </div>
        </div>

        {/* Database Mode Badge */}
        <div className="px-5 py-2.5 bg-[#FAF6F0] border-b border-[#E8DFD5] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-[#705346]">
            <Database className="w-3.5 h-3.5" />
            <span>Mode Database:</span>
          </div>
          <span
            className={`font-semibold px-2 py-0.5 rounded-full ${
              isFirebaseActive
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isFirebaseActive ? 'Cloud Firestore' : 'LocalStorage Demo'}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#2C1810] text-[#FAF6F0] shadow-sm'
                    : 'text-[#705346] hover:bg-[#FAF6F0] hover:text-[#2C1810]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#E8DFD5] space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-[#705346] hover:text-[#2C1810] hover:bg-[#FAF6F0] rounded-xl transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Website Toko</span>
            </span>
            <span className="text-[10px] text-[#998075]">Tab Baru</span>
          </Link>

          <div className="pt-2 border-t border-[#F0E6D8] flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <div className="w-7 h-7 rounded-full bg-stone-200 text-[#2C1810] flex items-center justify-center text-xs font-bold shrink-0">
                A
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-[#2C1810] truncate">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-[#8C7368] truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-stone-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Keluar Admin"
              aria-label="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-white border-b border-[#E8DFD5] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-2 text-[#2C1810] hover:bg-stone-100 rounded-lg"
            aria-label="Toggle menu"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-serif font-bold text-sm text-[#2C1810]">Admin Control Panel</span>
        </div>
        <Link
          to="/"
          target="_blank"
          className="text-xs font-medium text-[#B93838] flex items-center gap-1"
        >
          <span>Toko</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileNavOpen && (
        <div className="md:hidden bg-white border-b border-[#E8DFD5] px-4 py-3 space-y-1 shadow-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileNavOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                  active ? 'bg-[#2C1810] text-white' : 'text-[#705346]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#E8DFD5] flex justify-between items-center text-xs">
            <span className="text-[#8C7368]">{user?.email}</span>
            <button onClick={handleLogout} className="text-rose-600 font-semibold">
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};
