"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Album {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  photoCount: number;
  active: boolean;
  order: number;
}

export default function AdminAlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlbums = async () => {
    const res = await fetch("/api/admin/albums");
    if (res.ok) setAlbums(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Удалить альбом "${title}"? Фото не будут удалены.`)) return;
    const res = await fetch(`/api/admin/albums/${id}`, { method: "DELETE" });
    if (res.ok) setAlbums(albums.filter((a) => a.id !== id));
  };

  const toggleActive = async (album: Album) => {
    await fetch(`/api/admin/albums/${album.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...album, active: !album.active }),
    });
    fetchAlbums();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-text-muted">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Альбомы</h1>
          <p className="mt-1 text-sm text-text-muted">{albums.length} альбомов</p>
        </div>
        <Link
          href="/admin/albums/new"
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors"
        >
          + Новый альбом
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <div
            key={album.id}
            className={`group rounded-xl border border-border bg-bg-secondary overflow-hidden transition-opacity ${
              !album.active ? "opacity-50" : ""
            }`}
          >
            {/* Cover */}
            <div className="relative h-40 bg-bg-tertiary">
              {album.coverImage ? (
                <Image
                  src={album.coverImage}
                  alt={album.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a1a] via-[#0d1f2d] to-[#1a1a1a] flex items-center justify-center">
                  <span className="text-sm text-text-muted">Нет обложки</span>
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className="rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
                  {album.photoCount} фото
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-text-primary">{album.title}</h3>
              <p className="mt-1 text-xs text-text-muted line-clamp-1">{album.description}</p>

              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={`/admin/albums/${album.id}`}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:border-accent hover:text-accent transition-colors"
                >
                  Редактировать
                </Link>
                <button
                  onClick={() => toggleActive(album)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    album.active ? "bg-green/10 text-green" : "bg-bg-tertiary text-text-muted"
                  }`}
                >
                  {album.active ? "Виден" : "Скрыт"}
                </button>
                <button
                  onClick={() => handleDelete(album.id, album.title)}
                  className="ml-auto rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:border-terracotta hover:text-terracotta transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
