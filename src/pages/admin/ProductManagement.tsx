import React, { useState } from 'react';
import type { Product, Category, ProductVariant } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Sparkles,
  Check,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

interface ProductManagementProps {
  products: Product[];
  categories: Category[];
  onSaveProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  categories,
  onSaveProduct,
  onDeleteProduct,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Form states for Add/Edit
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]?.slug || 'kue-ulang-tahun');
  const [price, setPrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(10);
  const [stockStatus, setStockStatus] = useState<'in_stock' | 'low_stock' | 'out_of_stock'>('in_stock');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [badge, setBadge] = useState<'Best Seller' | 'Baru' | 'Promo' | ''>('');
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Variant input helper
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantOptions, setNewVariantOptions] = useState('');

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory(categories[0]?.slug || 'kue-ulang-tahun');
    setPrice(50000);
    setDiscountPrice(undefined);
    setStock(15);
    setStockStatus('in_stock');
    setDescription('');
    setImageUrl('/src/assets/images/hero_bakery_spread_1793363737190.jpg');
    setBadge('');
    setVariants([
      { name: 'Pilihan Varian', options: ['Reguler', 'Spesial'] },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setPrice(p.price);
    setDiscountPrice(p.discountPrice);
    setStock(p.stock);
    setStockStatus(p.stockStatus);
    setDescription(p.description);
    setImageUrl(p.imageUrl);
    setBadge(p.badge || '');
    setVariants(p.variants || []);
    setIsModalOpen(true);
  };

  const handleAddVariant = () => {
    if (!newVariantName.trim() || !newVariantOptions.trim()) return;
    const optionsArray = newVariantOptions
      .split(',')
      .map((opt) => opt.trim())
      .filter(Boolean);

    setVariants((prev) => [...prev, { name: newVariantName.trim(), options: optionsArray }]);
    setNewVariantName('');
    setNewVariantOptions('');
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const matchedCat = categories.find((c) => c.slug === category);
    const categoryName = matchedCat ? matchedCat.name : category;

    const savedItem: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      categoryName,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock),
      stockStatus,
      description: description.trim(),
      imageUrl: imageUrl.trim() || '/src/assets/images/hero_bakery_spread_1793363737190.jpg',
      variants,
      badge: (badge as any) || null,
      rating: editingProduct?.rating || 4.9,
      reviewCount: editingProduct?.reviewCount || 1,
      isFeatured: Boolean(badge === 'Best Seller'),
    };

    await onSaveProduct(savedItem);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.')) {
      setIsDeleting(id);
      await onDeleteProduct(id);
      setIsDeleting(null);
    }
  };

  const filtered = products.filter((p) => {
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
            Manajemen Produk & Menu Kue
          </h1>
          <p className="text-xs sm:text-sm text-[#705346] mt-0.5">
            Tambah, perbarui harga, stok, varian rasa, dan foto kue di katalog toko.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B93838] hover:bg-[#9E2A2A] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Menu Baru</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-[#E8DFD5] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#998075] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama kue atau rasa..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B93838]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#705346]">Kategori:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] text-[#2C1810] focus:outline-none"
          >
            <option value="all">Semua Kategori ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFD5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] text-[#705346] font-semibold border-b border-[#E8DFD5]">
              <tr>
                <th className="p-4">Foto & Nama Menu</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Harga Normal / Promo</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Varian</th>
                <th className="p-4">Badge</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E6D8]">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover bg-stone-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-serif font-bold text-sm text-[#2C1810] line-clamp-1">
                          {prod.name}
                        </p>
                        <p className="text-[11px] text-[#8C7368] line-clamp-1">
                          {prod.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-[#705346]">{prod.categoryName}</td>
                  <td className="p-4">
                    <p className="font-bold text-[#2C1810] tabular-nums">
                      {formatRupiah(prod.discountPrice || prod.price)}
                    </p>
                    {prod.discountPrice && (
                      <p className="text-[11px] text-[#998075] line-through tabular-nums">
                        {formatRupiah(prod.price)}
                      </p>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        prod.stockStatus === 'in_stock'
                          ? 'bg-emerald-100 text-emerald-800'
                          : prod.stockStatus === 'low_stock'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {prod.stockStatus === 'in_stock'
                        ? `Tersedia (${prod.stock})`
                        : prod.stockStatus === 'low_stock'
                        ? `Menipis (${prod.stock})`
                        : 'Habis'}
                    </span>
                  </td>
                  <td className="p-4 text-[#705346]">
                    {prod.variants?.length ? `${prod.variants.length} jenis` : 'Tanpa varian'}
                  </td>
                  <td className="p-4">
                    {prod.badge ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#2C1810] text-[#FAF6F0]">
                        {prod.badge}
                      </span>
                    ) : (
                      <span className="text-stone-400">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 text-stone-600 hover:text-[#2C1810] hover:bg-stone-200/50 rounded-lg transition-colors"
                        title="Edit Produk"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        disabled={isDeleting === prod.id}
                        className="p-1.5 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[#E8DFD5]">
            <div className="p-5 bg-[#FAF6F0] border-b border-[#E8DFD5] flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-[#2C1810]">
                {editingProduct ? 'Edit Menu Kue' : 'Tambah Menu Kue Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2C1810] mb-1">Nama Kue *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Triple Chocolate Gateau"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#2C1810] mb-1">Kategori *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#2C1810] mb-1">Badge Produk</label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  >
                    <option value="">Tanpa Badge</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Baru">Baru</option>
                    <option value="Promo">Promo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#2C1810] mb-1">
                    Harga Normal (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2C1810] mb-1">
                    Harga Promo / Diskon (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={discountPrice || ''}
                    onChange={(e) =>
                      setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="Kosongkan jika harga normal"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2C1810] mb-1">Status Stok</label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                  >
                    <option value="in_stock">Tersedia (Ready Stock)</option>
                    <option value="low_stock">Stok Menipis</option>
                    <option value="out_of_stock">Habis (Sold Out)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2C1810] mb-1">URL Foto Produk</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... atau path gambar lokal"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setImageUrl('/src/assets/images/cake_red_velvet_1793363737633.jpg')}
                    className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px]"
                  >
                    Foto Kue Red Velvet
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('/src/assets/images/pastry_croissants_1793363737837.jpg')}
                    className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px]"
                  >
                    Foto Pastry Croissant
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('/src/assets/images/brownies_fudge_1793363738739.jpg')}
                    className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px]"
                  >
                    Foto Fudge Brownies
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('/src/assets/images/cupcakes_assorted_1793363738202.jpg')}
                    className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px]"
                  >
                    Foto Cupcake
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2C1810] mb-1">Deskripsi Menu</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan rasa, tekstur, dan rekomendasi penyajian..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Variants Section */}
              <div className="pt-2 border-t border-[#F0E6D8] space-y-3">
                <label className="block font-semibold text-[#2C1810]">
                  Varian Menu (Ukuran, Rasa, Lilin)
                </label>

                {variants.map((v, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-[#FAF6F0] rounded-xl border border-[#E8DFD5]"
                  >
                    <div>
                      <p className="font-bold text-[#2C1810]">{v.name}</p>
                      <p className="text-[11px] text-[#705346]">{v.options.join(', ')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="text-rose-600 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newVariantName}
                    onChange={(e) => setNewVariantName(e.target.value)}
                    placeholder="Nama Varian (Cth: Ukuran / Topping)"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[#E8DFD5] bg-[#FAF6F0]"
                  />
                  <input
                    type="text"
                    value={newVariantOptions}
                    onChange={(e) => setNewVariantOptions(e.target.value)}
                    placeholder="Pilihan dipisah koma (Cth: 16cm, 20cm, 24cm)"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[#E8DFD5] bg-[#FAF6F0]"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-3 py-1.5 bg-[#2C1810] text-white rounded-lg font-semibold"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8DFD5] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E8DFD5] rounded-xl text-stone-600 hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#B93838] hover:bg-[#9E2A2A] text-white font-semibold rounded-xl shadow-sm"
                >
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
