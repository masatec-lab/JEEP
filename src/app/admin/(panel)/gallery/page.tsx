"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface GalleryItem {
  id: string;
  image: string;
  alt: string;
  span: string;
  order: number;
  active: boolean;
}

const spanOptions = [
  { value: "", label: "1x1 (обычная)" },
  { value: "col-span-2", label: "2x1 (широкая)" },
  { value: "col-span-2 row-span-2", label: "2x2 (большая)" },
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [editForm, setEditForm] = useState({ alt: "", span: "", order: 0, active: true });
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    const res = await fetch("/api/admin/gallery");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "gallery");

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        const { url } = await uploadRes.json();
        await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: url,
            alt: file.name.replace(/\.[^.]+$/, ""),
            span: "",
            order: items.length + 1,
            active: true,
          }),
        });
      }
    }

    if (fileRef.current) fileRef.current.value = "";
    setUploading(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить фото из галереи?")) return;
    const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    if (res.ok) setItems(items.filter((i) => i.id !== id));
  };

  const toggleActive = async (item: GalleryItem) => {
    await fetch(`/api/admin/gallery/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, active: !item.active }),
    });
    fetchItems();
  };

  const openEdit = (item: GalleryItem) => {
    setEditing(item);
    setEditForm({ alt: item.alt, span: item.span, order: item.order, active: item.active });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await fetch(`/api/admin/gallery/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editing, ...editForm }),
    });
    setEditing(null);
    fetchItems();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-text-muted">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Галерея</h1>
          <p className="mt-1 text-sm text-text-muted">{items.length} фото</p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            onChange={handleUpload}
            className="hidden"
            id="gallery-upload"
          />
          <label
            htmlFor="gallery-upload"
            className={`inline-block cursor-pointer rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors ${
              uploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {uploading ? "Загрузка..." : "+ Загрузить фото"}
          </label>
        </div>
      </div>

      <p className="mt-2 text-xs text-text-muted">
        Форматы: JPG, PNG, WebP, AVIF. Максимум 10 МБ. Можно выбрать несколько файлов.
      </p>

      {/* Gallery grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`group relative rounded-xl border border-border overflow-hidden transition-opacity ${
              !item.active ? "opacity-40" : ""
            }`}
          >
            {/* Image */}
            <div className="relative aspect-square bg-bg-tertiary">
              {item.image.startsWith("/uploads") ? (
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a1a] via-[#0d1f2d] to-[#1a1a1a] flex items-center justify-center">
                  <span className="text-xs text-text-muted">{item.alt}</span>
                </div>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-bg-primary hover:bg-white transition-colors"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg bg-terracotta/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-terracotta transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-3 bg-bg-secondary flex items-center justify-between gap-2">
              <span className="text-xs text-text-muted truncate">{item.alt}</span>
              <button
                onClick={() => toggleActive(item)}
                className={`shrink-0 h-2 w-2 rounded-full ${
                  item.active ? "bg-green" : "bg-text-muted"
                }`}
                title={item.active ? "Виден" : "Скрыт"}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-bg-primary p-8 mx-4">
            <h2 className="text-xl font-bold text-text-primary">Редактировать фото</h2>

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
              {/* Preview */}
              <div className="relative h-40 rounded-xl overflow-hidden bg-bg-tertiary">
                {editing.image.startsWith("/uploads") ? (
                  <Image
                    src={editing.image}
                    alt={editing.alt}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a1a] via-[#0d1f2d] to-[#1a1a1a] flex items-center justify-center">
                    <span className="text-sm text-text-muted">Заглушка</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary">
                  Описание (alt)
                </label>
                <input
                  type="text"
                  value={editForm.alt}
                  onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-border bg-bg-secondary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                  placeholder="Горные дороги Адыгеи"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary">
                  Размер на сетке
                </label>
                <select
                  value={editForm.span}
                  onChange={(e) => setEditForm({ ...editForm, span: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-border bg-bg-secondary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none cursor-pointer"
                >
                  {spanOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary">
                    Порядок
                  </label>
                  <input
                    type="number"
                    value={editForm.order}
                    onChange={(e) => setEditForm({ ...editForm, order: parseInt(e.target.value) || 0 })}
                    className="mt-1.5 w-full rounded-lg border border-border bg-bg-secondary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.active}
                      onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                      className="h-4 w-4 rounded accent-accent"
                    />
                    <span className="text-sm text-text-secondary">Показывать</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
