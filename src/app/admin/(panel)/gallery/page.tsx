"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

interface GalleryItem {
  id: string;
  image: string;
  alt: string;
  span: string;
  category: string;
  order: number;
  active: boolean;
}

interface UploadTask {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
}

const spanOptions = [
  { value: "", label: "1x1 (обычная)" },
  { value: "col-span-2", label: "2x1 (широкая)" },
  { value: "col-span-2 row-span-2", label: "2x2 (большая)" },
];

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

const CATEGORIES = [
  { value: "gallery", label: "Главная галерея" },
  { value: "routes", label: "Маршруты" },
  { value: "fleet", label: "Автопарк" },
  { value: "team", label: "Команда" },
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [editForm, setEditForm] = useState({ alt: "", span: "", category: "gallery", order: 0, active: true });
  const [dragOver, setDragOver] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadTask[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    const res = await fetch("/api/admin/gallery");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Process files — from input or drop
  const processFiles = useCallback((fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => ALLOWED_TYPES.includes(f.type));
    if (!files.length) return;

    const tasks: UploadTask[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending" as const,
    }));

    setUploadQueue((prev) => [...prev, ...tasks]);
  }, []);

  // Upload queue processor
  useEffect(() => {
    if (isUploading) return;
    const pending = uploadQueue.find((t) => t.status === "pending");
    if (!pending) return;

    setIsUploading(true);

    (async () => {
      // Mark as uploading
      setUploadQueue((prev) =>
        prev.map((t) => (t === pending ? { ...t, status: "uploading" as const } : t))
      );

      try {
        const formData = new FormData();
        formData.append("file", pending.file);
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
              alt: pending.file.name.replace(/\.[^.]+$/, ""),
              span: "",
              category: activeCategory === "all" ? "gallery" : activeCategory,
              order: items.length + 1,
              active: true,
            }),
          });

          setUploadQueue((prev) =>
            prev.map((t) => (t === pending ? { ...t, status: "done" as const } : t))
          );
        } else {
          setUploadQueue((prev) =>
            prev.map((t) => (t === pending ? { ...t, status: "error" as const } : t))
          );
        }
      } catch {
        setUploadQueue((prev) =>
          prev.map((t) => (t === pending ? { ...t, status: "error" as const } : t))
        );
      }

      setIsUploading(false);
      fetchItems();
    })();
  }, [uploadQueue, isUploading, items.length]);

  // Clear completed uploads
  const clearCompleted = () => {
    setUploadQueue((prev) => {
      prev.filter((t) => t.status === "done").forEach((t) => URL.revokeObjectURL(t.preview));
      return prev.filter((t) => t.status !== "done");
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processFiles(e.target.files);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  // Selection handlers
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((i) => i.id)));
    }
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelected(new Set());
  };

  const bulkDelete = async () => {
    if (!confirm(`Удалить ${selected.size} фото?`)) return;
    for (const id of selected) {
      await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    }
    setSelected(new Set());
    setSelectMode(false);
    fetchItems();
  };

  const bulkToggleActive = async (active: boolean) => {
    for (const id of selected) {
      const item = items.find((i) => i.id === id);
      if (!item) continue;
      await fetch(`/api/admin/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, active }),
      });
    }
    setSelected(new Set());
    setSelectMode(false);
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
    setEditForm({ alt: item.alt, span: item.span, category: item.category, order: item.order, active: item.active });
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

  // Replace photo in edit modal
  const handleReplacePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editing || !e.target.files?.length) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "gallery");

    const uploadRes = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (uploadRes.ok) {
      const { url } = await uploadRes.json();
      await fetch(`/api/admin/gallery/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editing, ...editForm, image: url }),
      });
      setEditing(null);
      fetchItems();
    }
  };

  const doneCount = uploadQueue.filter((t) => t.status === "done").length;
  const totalQueue = uploadQueue.length;
  const hasQueue = totalQueue > 0;

  const filteredItems = activeCategory === "all"
    ? items
    : items.filter((i) => i.category === activeCategory);

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
        <button
          onClick={() => selectMode ? exitSelectMode() : setSelectMode(true)}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            selectMode
              ? "border-accent text-accent"
              : "border-border text-text-secondary hover:border-accent hover:text-accent"
          }`}
        >
          {selectMode ? "Отмена" : "Выбрать"}
        </button>
      </div>

      {/* Bulk actions bar */}
      {selectMode && selected.size > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
          <span className="text-sm font-medium text-text-primary">
            Выбрано: {selected.size}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => bulkToggleActive(true)}
              className="rounded-lg bg-green/10 px-3 py-1.5 text-xs font-medium text-green hover:bg-green/20 transition-colors"
            >
              Показать
            </button>
            <button
              onClick={() => bulkToggleActive(false)}
              className="rounded-lg bg-bg-tertiary px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors"
            >
              Скрыть
            </button>
            <button
              onClick={bulkDelete}
              className="rounded-lg bg-terracotta/10 px-3 py-1.5 text-xs font-medium text-terracotta hover:bg-terracotta/20 transition-colors"
            >
              Удалить
            </button>
          </div>
        </div>
      )}

      {/* Select all toggle */}
      {selectMode && (
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={selectAll}
            className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
          >
            {selected.size === filteredItems.length ? "Снять выделение" : "Выбрать все"}
          </button>
        </div>
      )}

      {/* Category tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
            activeCategory === "all"
              ? "bg-accent text-bg-primary"
              : "bg-bg-secondary text-text-secondary hover:text-text-primary border border-border"
          }`}
        >
          Все ({items.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = items.filter((i) => i.category === cat.value).length;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                activeCategory === cat.value
                  ? "bg-accent text-bg-primary"
                  : "bg-bg-secondary text-text-secondary hover:text-text-primary border border-border"
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Drag and drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all ${
          dragOver
            ? "border-accent bg-accent/5 scale-[1.01]"
            : "border-border hover:border-accent/50 hover:bg-bg-secondary/50"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />

        <div className={`flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${
          dragOver ? "bg-accent/20 text-accent" : "bg-bg-tertiary text-text-muted"
        }`}>
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        <p className="mt-4 text-sm font-medium text-text-primary">
          {dragOver ? "Отпустите файлы" : "Перетащите фото сюда"}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          или нажмите для выбора файлов
        </p>
        <p className="mt-3 text-xs text-text-muted">
          JPG, PNG, WebP, AVIF — до 10 МБ каждый
        </p>
      </div>

      {/* Upload queue */}
      {hasQueue && (
        <div className="mt-4 rounded-xl border border-border bg-bg-secondary p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-text-primary">
              Загружено {doneCount} из {totalQueue}
            </span>
            {doneCount === totalQueue && (
              <button
                onClick={clearCompleted}
                className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
              >
                Очистить
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {uploadQueue.map((task, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-bg-tertiary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={task.preview}
                  alt=""
                  className={`w-full h-full object-cover ${
                    task.status === "uploading" ? "opacity-50" : ""
                  }`}
                />

                {/* Status overlay */}
                {task.status === "uploading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {task.status === "done" && (
                  <div className="absolute top-1 right-1">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green text-white">
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                  </div>
                )}
                {task.status === "error" && (
                  <div className="absolute top-1 right-1">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-white text-xs font-bold">
                      !
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={selectMode ? () => toggleSelect(item.id) : undefined}
            className={`group relative rounded-xl border overflow-hidden transition-all ${
              !item.active ? "opacity-40" : ""
            } ${
              selected.has(item.id)
                ? "border-accent ring-2 ring-accent/30"
                : "border-border"
            } ${selectMode ? "cursor-pointer" : ""}`}
          >
            {/* Checkbox */}
            {selectMode && (
              <div className="absolute top-2 left-2 z-20">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${
                    selected.has(item.id)
                      ? "bg-accent border-accent text-bg-primary"
                      : "border-white/70 bg-black/30"
                  }`}
                >
                  {selected.has(item.id) && (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </div>
              </div>
            )}

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

              {/* Overlay on hover (only in normal mode) */}
              {!selectMode && (
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
              )}
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
          <div className="w-full max-w-md rounded-2xl border border-border bg-bg-primary p-8 mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-text-primary">Редактировать фото</h2>

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
              {/* Preview + replace */}
              <div className="relative h-40 rounded-xl overflow-hidden bg-bg-tertiary group">
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

                {/* Replace button overlay */}
                <label className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/50 transition-colors cursor-pointer">
                  <span className="opacity-0 hover:opacity-100 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-bg-primary transition-opacity group-hover:opacity-100">
                    Заменить фото
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleReplacePhoto}
                    className="hidden"
                  />
                </label>
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

              <div>
                <label className="block text-sm font-medium text-text-secondary">
                  Категория
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-border bg-bg-secondary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
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
