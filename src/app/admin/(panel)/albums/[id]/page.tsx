"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

interface Photo {
  id: string;
  image: string;
  alt: string;
  order: number;
}

interface AlbumData {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  order: number;
  active: boolean;
  photos: Photo[];
}

interface AlbumListItem {
  id: string;
  title: string;
}

interface UploadTask {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export default function EditAlbumPage() {
  const params = useParams();
  const router = useRouter();
  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [allAlbums, setAllAlbums] = useState<AlbumListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", description: "", order: 0, active: true });
  const [dragOver, setDragOver] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadTask[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [movePhotoId, setMovePhotoId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchAlbum = useCallback(async () => {
    const res = await fetch(`/api/admin/albums/${params.id}`);
    if (res.ok) {
      const data = await res.json();
      setAlbum(data);
      setForm({
        title: data.title,
        slug: data.slug,
        description: data.description,
        order: data.order,
        active: data.active,
      });
    }
    setLoading(false);
  }, [params.id]);

  const fetchAllAlbums = useCallback(async () => {
    const res = await fetch("/api/admin/albums");
    if (res.ok) {
      const data = await res.json();
      setAllAlbums(data.filter((a: AlbumListItem) => a.id !== params.id));
    }
  }, [params.id]);

  useEffect(() => {
    fetchAlbum();
    fetchAllAlbums();
  }, [fetchAlbum, fetchAllAlbums]);

  // Save album metadata
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!album) return;
    setSaving(true);
    await fetch(`/api/admin/albums/${album.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, coverImage: album.coverImage }),
    });
    setSaving(false);
    fetchAlbum();
  };

  // Upload
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

  useEffect(() => {
    if (isUploading || !album) return;
    const pending = uploadQueue.find((t) => t.status === "pending");
    if (!pending) return;

    setIsUploading(true);
    (async () => {
      setUploadQueue((prev) =>
        prev.map((t) => (t === pending ? { ...t, status: "uploading" as const } : t))
      );
      try {
        const formData = new FormData();
        formData.append("file", pending.file);
        formData.append("folder", "albums");

        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          await fetch(`/api/admin/albums/${album.id}/photos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: url, alt: pending.file.name.replace(/\.[^.]+$/, "") }),
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
      fetchAlbum();
    })();
  }, [uploadQueue, isUploading, album, fetchAlbum]);

  const clearCompleted = () => {
    setUploadQueue((prev) => {
      prev.filter((t) => t.status === "done").forEach((t) => URL.revokeObjectURL(t.preview));
      return prev.filter((t) => t.status !== "done");
    });
  };

  // Delete photo
  const deletePhoto = async (photoId: string) => {
    if (!confirm("Удалить фото?")) return;
    await fetch(`/api/admin/gallery/${photoId}`, { method: "DELETE" });
    fetchAlbum();
  };

  // Set as cover
  const setCover = async (imageUrl: string) => {
    if (!album) return;
    await fetch(`/api/admin/albums/${album.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, coverImage: imageUrl }),
    });
    fetchAlbum();
  };

  // Edit alt text
  const openEditAlt = (photo: Photo) => {
    setEditingPhoto(photo);
    setEditAlt(photo.alt);
  };

  const saveAlt = async () => {
    if (!editingPhoto) return;
    await fetch(`/api/admin/gallery/${editingPhoto.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editingPhoto, alt: editAlt }),
    });
    setEditingPhoto(null);
    fetchAlbum();
  };

  // Move photo to another album
  const movePhoto = async (photoId: string, targetAlbumId: string) => {
    await fetch(`/api/admin/gallery/${photoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ albumId: targetAlbumId }),
    });
    setMovePhotoId(null);
    fetchAlbum();
  };

  // Drag and drop reorder
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !album) return;

    const reordered = Array.from(album.photos);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setAlbum({ ...album, photos: reordered });

    await fetch(`/api/admin/albums/${album.id}/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoIds: reordered.map((p) => p.id) }),
    });
  };

  const doneCount = uploadQueue.filter((t) => t.status === "done").length;
  const hasQueue = uploadQueue.length > 0;

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-text-muted">Загрузка...</div>;
  }

  if (!album) {
    return <div className="text-center py-20 text-terracotta">Альбом не найден</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/admin/albums")}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{album.title}</h1>
          <p className="text-sm text-text-muted">{album.photos.length} фото</p>
        </div>
      </div>

      {/* Album metadata form */}
      <form onSubmit={handleSave} className="rounded-xl border border-border bg-bg-secondary p-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-secondary">Название</label>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">Slug</label>
            <input type="text" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary font-mono focus:border-accent focus:outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-text-secondary">Описание</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none resize-none" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors disabled:opacity-50">
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="h-4 w-4 rounded accent-accent" />
            <span className="text-sm text-text-secondary">Показывать на сайте</span>
          </label>
        </div>
      </form>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
        className={`mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-all ${
          dragOver ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
        }`}
      >
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple
          onChange={(e) => { if (e.target.files?.length) processFiles(e.target.files); fileRef.current!.value = ""; }}
          className="hidden" />
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-text-muted" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
        <p className="mt-2 text-sm text-text-primary">{dragOver ? "Отпустите файлы" : "Перетащите фото или нажмите"}</p>
        <p className="mt-1 text-xs text-text-muted">JPG, PNG, WebP, AVIF — до 10 МБ</p>
      </div>

      {/* Upload queue */}
      {hasQueue && (
        <div className="mt-4 rounded-xl border border-border bg-bg-secondary p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-text-primary">Загружено {doneCount} из {uploadQueue.length}</span>
            {doneCount === uploadQueue.length && (
              <button onClick={clearCompleted} className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">Очистить</button>
            )}
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {uploadQueue.map((task, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-bg-tertiary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={task.preview} alt="" className={`w-full h-full object-cover ${task.status === "uploading" ? "opacity-50" : ""}`} />
                {task.status === "uploading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {task.status === "done" && (
                  <div className="absolute top-1 right-1">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green text-white">
                      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photos grid with drag-and-drop */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-text-primary">Фото в альбоме</h2>
        <p className="mt-1 text-xs text-text-muted">Перетаскивайте фото для изменения порядка</p>

        {album.photos.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="photos" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="mt-4 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3"
                >
                  {album.photos.map((photo, index) => (
                    <Draggable key={photo.id} draggableId={photo.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group relative rounded-xl overflow-hidden border transition-all ${
                            snapshot.isDragging ? "border-accent shadow-xl ring-2 ring-accent/30 z-50" : "border-border"
                          }`}
                        >
                          {/* Drag handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="absolute top-2 right-2 z-20 flex h-6 w-6 items-center justify-center rounded-md bg-black/50 text-white/70 hover:text-white cursor-grab active:cursor-grabbing"
                            title="Перетащить"
                          >
                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                              <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
                              <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                              <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
                            </svg>
                          </div>

                          <div className="relative aspect-square bg-bg-tertiary">
                            <Image src={photo.image} alt={photo.alt} fill className="object-cover" sizes="20vw" />

                            {/* Cover badge */}
                            {album.coverImage === photo.image && (
                              <div className="absolute top-2 left-2 z-10">
                                <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-bg-primary">Обложка</span>
                              </div>
                            )}

                            {/* Actions overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                              {album.coverImage !== photo.image && (
                                <button onClick={() => setCover(photo.image)}
                                  className="rounded-lg bg-accent/90 px-2.5 py-1 text-[10px] font-medium text-bg-primary hover:bg-accent transition-colors w-20 text-center">
                                  Обложка
                                </button>
                              )}
                              <button onClick={() => openEditAlt(photo)}
                                className="rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-medium text-bg-primary hover:bg-white transition-colors w-20 text-center">
                                Описание
                              </button>
                              <button onClick={() => setMovePhotoId(photo.id)}
                                className="rounded-lg bg-[#2AABEE]/90 px-2.5 py-1 text-[10px] font-medium text-white hover:bg-[#2AABEE] transition-colors w-20 text-center">
                                Переместить
                              </button>
                              <button onClick={() => deletePhoto(photo.id)}
                                className="rounded-lg bg-terracotta/90 px-2.5 py-1 text-[10px] font-medium text-white hover:bg-terracotta transition-colors w-20 text-center">
                                Удалить
                              </button>
                            </div>
                          </div>

                          {/* Alt text */}
                          <div className="p-2 bg-bg-secondary">
                            <p className="text-[10px] text-text-muted truncate" title={photo.alt}>
                              {photo.alt || "Без описания"}
                            </p>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <p className="mt-4 text-sm text-text-muted">Загрузите фото в альбом через зону выше</p>
        )}
      </div>

      {/* Edit alt modal */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-bg-primary p-6 mx-4">
            <h3 className="text-lg font-bold text-text-primary">Описание фото</h3>
            <div className="mt-4 relative h-32 rounded-xl overflow-hidden bg-bg-tertiary">
              <Image src={editingPhoto.image} alt="" fill className="object-cover" sizes="300px" />
            </div>
            <input
              type="text"
              value={editAlt}
              onChange={(e) => setEditAlt(e.target.value)}
              className="mt-4 w-full rounded-lg border border-border bg-bg-secondary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
              placeholder="Описание фото (alt-текст)"
              autoFocus
            />
            <div className="mt-4 flex gap-3">
              <button onClick={saveAlt}
                className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors">
                Сохранить
              </button>
              <button onClick={() => setEditingPhoto(null)}
                className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move photo modal */}
      {movePhotoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-bg-primary p-6 mx-4">
            <h3 className="text-lg font-bold text-text-primary">Переместить в альбом</h3>
            <div className="mt-4 space-y-2">
              {allAlbums.length > 0 ? (
                allAlbums.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => movePhoto(movePhotoId, a.id)}
                    className="w-full text-left rounded-lg border border-border bg-bg-secondary px-4 py-3 text-sm text-text-primary hover:border-accent hover:text-accent transition-colors"
                  >
                    {a.title}
                  </button>
                ))
              ) : (
                <p className="text-sm text-text-muted">Нет других альбомов</p>
              )}
            </div>
            <button onClick={() => setMovePhotoId(null)}
              className="mt-4 w-full rounded-lg border border-border px-5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
