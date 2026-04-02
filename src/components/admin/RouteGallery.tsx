"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

interface Photo {
  id: string;
  image: string;
  alt: string;
  order: number;
}

interface UploadTask {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export default function RouteGallery({ routeId }: { routeId: string }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadTask[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = useCallback(async () => {
    const res = await fetch(`/api/admin/routes/${routeId}/photos`);
    if (res.ok) setPhotos(await res.json());
    setLoading(false);
  }, [routeId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => ALLOWED_TYPES.includes(f.type));
    if (!files.length) return;
    setUploadQueue((prev) => [
      ...prev,
      ...files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        status: "pending" as const,
      })),
    ]);
  }, []);

  useEffect(() => {
    if (isUploading) return;
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
        formData.append("folder", "routes");

        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          await fetch(`/api/admin/routes/${routeId}/photos`, {
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
      fetchPhotos();
    })();
  }, [uploadQueue, isUploading, routeId, fetchPhotos]);

  const clearCompleted = () => {
    setUploadQueue((prev) => {
      prev.filter((t) => t.status === "done").forEach((t) => URL.revokeObjectURL(t.preview));
      return prev.filter((t) => t.status !== "done");
    });
  };

  const deletePhoto = async (photoId: string) => {
    if (!confirm("Удалить фото?")) return;
    await fetch(`/api/admin/gallery/${photoId}`, { method: "DELETE" });
    fetchPhotos();
  };

  const setAsMain = async (imageUrl: string) => {
    await fetch(`/api/admin/routes/${routeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageUrl }),
    });
  };

  const saveAlt = async () => {
    if (!editingPhoto) return;
    await fetch(`/api/admin/gallery/${editingPhoto.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editingPhoto, alt: editAlt }),
    });
    setEditingPhoto(null);
    fetchPhotos();
  };

  const doneCount = uploadQueue.filter((t) => t.status === "done").length;
  const hasQueue = uploadQueue.length > 0;

  if (loading) {
    return <div className="text-sm text-text-muted py-4">Загрузка фото...</div>;
  }

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Фотографии маршрута</h2>
          <p className="text-xs text-text-muted">{photos.length} фото · отображаются на странице маршрута</p>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 cursor-pointer transition-all ${
          dragOver ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
        }`}
      >
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple
          onChange={(e) => { if (e.target.files?.length) processFiles(e.target.files); fileRef.current!.value = ""; }}
          className="hidden" />
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-text-muted" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
        <p className="mt-2 text-sm text-text-primary">{dragOver ? "Отпустите файлы" : "Перетащите фото сюда или нажмите"}</p>
        <p className="mt-1 text-xs text-text-muted">JPG, PNG, WebP, AVIF — до 10 МБ</p>
      </div>

      {/* Upload queue */}
      {hasQueue && (
        <div className="rounded-lg border border-border bg-bg-primary p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-primary">Загружено {doneCount} из {uploadQueue.length}</span>
            {doneCount === uploadQueue.length && (
              <button onClick={clearCompleted} className="text-xs text-accent hover:text-accent-hover transition-colors">Очистить</button>
            )}
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {uploadQueue.map((task, i) => (
              <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-bg-tertiary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={task.preview} alt="" className={`w-full h-full object-cover ${task.status === "uploading" ? "opacity-50" : ""}`} />
                {task.status === "uploading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {task.status === "done" && (
                  <div className="absolute top-0.5 right-0.5">
                    <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green text-white">
                      <svg viewBox="0 0 24 24" className="h-2 w-2" fill="none" stroke="currentColor" strokeWidth={3}>
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

      {/* Photos grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative rounded-lg overflow-hidden border border-border">
              <div className="relative aspect-square bg-bg-tertiary">
                <Image src={photo.image} alt={photo.alt} fill className="object-cover" sizes="120px" />

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  <button onClick={() => setAsMain(photo.image)}
                    className="rounded bg-accent/90 px-2 py-0.5 text-[9px] font-medium text-bg-primary hover:bg-accent transition-colors w-16 text-center">
                    Главное
                  </button>
                  <button onClick={() => { setEditingPhoto(photo); setEditAlt(photo.alt); }}
                    className="rounded bg-white/90 px-2 py-0.5 text-[9px] font-medium text-bg-primary hover:bg-white transition-colors w-16 text-center">
                    Alt
                  </button>
                  <button onClick={() => deletePhoto(photo.id)}
                    className="rounded bg-terracotta/90 px-2 py-0.5 text-[9px] font-medium text-white hover:bg-terracotta transition-colors w-16 text-center">
                    Удалить
                  </button>
                </div>
              </div>
              <div className="p-1.5 bg-bg-primary">
                <p className="text-[9px] text-text-muted truncate">{photo.alt || "—"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit alt modal */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditingPhoto(null)}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-bg-primary p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-text-primary">Описание фото</h3>
            <div className="mt-4 relative h-32 rounded-xl overflow-hidden bg-bg-tertiary">
              <Image src={editingPhoto.image} alt="" fill className="object-cover" sizes="300px" />
            </div>
            <input
              type="text" value={editAlt} onChange={(e) => setEditAlt(e.target.value)} autoFocus
              className="mt-4 w-full rounded-lg border border-border bg-bg-secondary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
              placeholder="Описание фото (alt)"
            />
            <div className="mt-4 flex gap-3">
              <button onClick={saveAlt} className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors">Сохранить</button>
              <button onClick={() => setEditingPhoto(null)} className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
