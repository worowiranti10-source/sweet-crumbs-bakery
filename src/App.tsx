/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Admin Components
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProductManagement } from './pages/admin/ProductManagement';
import { OrderManagement } from './pages/admin/OrderManagement';
import { CategoryManagement } from './pages/admin/CategoryManagement';
import { StoreSettingsPage } from './pages/admin/StoreSettingsPage';
import { PromoManagement } from './pages/admin/PromoManagement';

// Services & Types
import { dataService, INITIAL_SETTINGS } from './services/dataService';
import type {
  Product,
  Category,
  Order,
  StoreSettings,
  Promo,
  Testimonial,
  OrderStatus,
} from './types';
import { Loader2 } from 'lucide-react';

// Protected Admin Route Guard
const ProtectedAdminRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#B93838] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

// Customer Layout Wrapper
interface CustomerLayoutProps {
  settings: StoreSettings;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ settings }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2C1810]">
      <Navbar settings={settings} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer settings={settings} />
      <CartDrawer settings={settings} />
    </div>
  );
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  const loadData = async () => {
    try {
      const [prods, cats, ords, sets, prms, testis] = await Promise.all([
        dataService.getProducts(),
        dataService.getCategories(),
        dataService.getOrders(),
        dataService.getSettings(),
        dataService.getPromos(),
        dataService.getTestimonials(),
      ]);

      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setSettings(sets);
      setPromos(prms);
      setTestimonials(testis);
    } catch (err) {
      console.error('Error loading initial app data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Admin Mutations
  const handleSaveProduct = async (product: Product) => {
    await dataService.saveProduct(product);
    const updated = await dataService.getProducts();
    setProducts(updated);
  };

  const handleDeleteProduct = async (productId: string) => {
    await dataService.deleteProduct(productId);
    const updated = await dataService.getProducts();
    setProducts(updated);
  };

  const handleSaveCategory = async (category: Category) => {
    await dataService.saveCategory(category);
    const updated = await dataService.getCategories();
    setCategories(updated);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    await dataService.deleteCategory(categoryId);
    const updated = await dataService.getCategories();
    setCategories(updated);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await dataService.updateOrderStatus(orderId, status);
    const updated = await dataService.getOrders();
    setOrders(updated);
  };

  const handleCreateManualOrder = async (order: Order) => {
    await dataService.createOrder(order);
    const updated = await dataService.getOrders();
    setOrders(updated);
  };

  const handleSaveSettings = async (newSettings: StoreSettings) => {
    await dataService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleSavePromo = async (promo: Promo) => {
    await dataService.savePromo(promo);
    const updated = await dataService.getPromos();
    setPromos(updated);
  };

  const handleDeletePromo = async (promoId: string) => {
    await dataService.deletePromo(promoId);
    const updated = await dataService.getPromos();
    setPromos(updated);
  };

  const handleSaveTestimonial = async (testi: Testimonial) => {
    await dataService.saveTestimonial(testi);
    const updated = await dataService.getTestimonials();
    setTestimonials(updated);
  };

  const handleDeleteTestimonial = async (testiId: string) => {
    await dataService.deleteTestimonial(testiId);
    const updated = await dataService.getTestimonials();
    setTestimonials(updated);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full bg-[#2C1810] text-[#FAF6F0] flex items-center justify-center font-serif text-xl font-bold mb-4 shadow-sm animate-pulse">
          SC
        </div>
        <p className="font-serif text-lg font-bold text-[#2C1810]">Sweet Crumbs Bakery</p>
        <p className="text-xs text-[#705346] mt-1 font-serif italic">Manis di Setiap Gigitan...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Customer Facing Routes */}
              <Route element={<CustomerLayout settings={settings} />}>
                <Route
                  path="/"
                  element={
                    <HomePage
                      products={products}
                      categories={categories}
                      settings={settings}
                      testimonials={testimonials}
                    />
                  }
                />
                <Route
                  path="/katalog"
                  element={<CatalogPage products={products} categories={categories} />}
                />
                <Route path="/tentang" element={<AboutPage settings={settings} />} />
                <Route path="/kontak" element={<ContactPage settings={settings} />} />
              </Route>

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route element={<ProtectedAdminRoute />}>
                <Route element={<AdminLayout settings={settings} />}>
                  <Route
                    path="/admin"
                    element={
                      <AdminDashboard
                        products={products}
                        categories={categories}
                        orders={orders}
                        settings={settings}
                      />
                    }
                  />
                  <Route
                    path="/admin/pesanan"
                    element={
                      <OrderManagement
                        orders={orders}
                        products={products}
                        onUpdateStatus={handleUpdateOrderStatus}
                        onCreateManualOrder={handleCreateManualOrder}
                      />
                    }
                  />
                  <Route
                    path="/admin/produk"
                    element={
                      <ProductManagement
                        products={products}
                        categories={categories}
                        onSaveProduct={handleSaveProduct}
                        onDeleteProduct={handleDeleteProduct}
                      />
                    }
                  />
                  <Route
                    path="/admin/kategori"
                    element={
                      <CategoryManagement
                        categories={categories}
                        onSaveCategory={handleSaveCategory}
                        onDeleteCategory={handleDeleteCategory}
                      />
                    }
                  />
                  <Route
                    path="/admin/promo-ulasan"
                    element={
                      <PromoManagement
                        promos={promos}
                        testimonials={testimonials}
                        onSavePromo={handleSavePromo}
                        onDeletePromo={handleDeletePromo}
                        onSaveTestimonial={handleSaveTestimonial}
                        onDeleteTestimonial={handleDeleteTestimonial}
                      />
                    }
                  />
                  <Route
                    path="/admin/pengaturan"
                    element={
                      <StoreSettingsPage
                        settings={settings}
                        onSaveSettings={handleSaveSettings}
                        onResetData={loadData}
                      />
                    }
                  />
                </Route>
              </Route>

              {/* Fallback 404 Route - Redirect to Home to guarantee no blank page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
