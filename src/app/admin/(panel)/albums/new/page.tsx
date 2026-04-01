"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function slugify(str: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return str.toLowerCase().split("").map((c) => map[c] || c).join("")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function NewAlbumPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", slug: "", description: "", order: 0 });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const album = await res.json();
      router.push(`/admin/albums/${album.id}`);
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Новый альбом</h1>
      <p className="mt-1 text-sm text-text-muted">После создания можно будет загрузить фото</p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-5">
        <div className="rounded-xl border border-border bg-bg-secondary p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary">Название *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
              placeholder="Панорамы Лаго-Наки"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">Slug</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary font-mono focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">Описание</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none resize-none"
              placeholder="Захватывающие виды с легендарного плато..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">Порядок</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              className="mt-1.5 w-32 rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {saving ? "Создание..." : "Создать альбом"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/albums")}
            className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
