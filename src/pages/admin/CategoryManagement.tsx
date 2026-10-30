import React, { useState } from 'react';
import type { Category } from '../../types';
import { Plus, Edit2, Trash2, X, FolderTree } from 'lucide-react';

interface CategoryManagementProps {
  categories: Category[];
  onSaveCategory: (category: Category) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  categories,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState<number>(1);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setOrder(categories.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setOrder(cat.order);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const saved: Category = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name: name.trim(),
      slug: generatedSlug,
      description: description.trim(),
      order: Number(order),
      iconName: editingCategory?.iconName || 'Cake',
    };

    await onSaveCategory(saved);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus kategori ini?')) {
      await onDeleteCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
            Manajemen Kategori Menu
          </h1>
          <p className="text-xs sm:text-sm text-[#705346] mt-0.5">
            Atur pengelompokan produk agar mempermudah pelanggan menemukan kue impian.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B93838] hover:bg-[#9E2A2A] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8DFD5] shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF6F0] text-[#705346] font-semibold border-b border-[#E8DFD5]">
            <tr>
              <th className="p-4">Urutan</th>
              <th className="p-4">Nama Kategori</th>
              <th className="p-4">Slug URL</th>
              <th className="p-4">Deskripsi</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0E6D8]">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                <td className="p-4 font-bold text-[#2C1810] tabular-nums">#{cat.order}</td>
                <td className="p-4 font-bold text-sm text-[#2C1810]">{cat.name}</td>
                <td className="p-4 font-mono text-[#8C7368]">{cat.slug}</td>
                <td className="p-4 text-[#705346] max-w-xs">{cat.description}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 text-stone-600 hover:text-[#2C1810] rounded-lg hover:bg-stone-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 text-stone-600 hover:text-rose-600 rounded-lg hover:bg-rose-50"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-[#E8DFD5] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
              <h3 className="font-serif font-bold text-base text-[#2C1810]">
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-500 hover:text-stone-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-semibold text-[#2C1810] mb-1">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="Contoh: Kue Lapis & Bolu"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2C1810] mb-1">Slug URL</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="kue-lapis-bolu"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2C1810] mb-1">Urutan Tampil</label>
                <input
                  type="number"
                  min={1}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2C1810] mb-1">Deskripsi</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi singkat kategori"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] bg-[#FAF6F0]"
                />
              </div>

              <div className="pt-3 border-t border-[#E8DFD5] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B93838] text-white rounded-xl font-semibold"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
