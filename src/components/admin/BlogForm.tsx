"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BlogData {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  published: boolean;
  order: number;
}

function slugify(str: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return str
    .toLowerCase()
    .split("")
    .map((c) => map[c] || c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BlogForm({ initial }: { initial?: BlogData }) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [form, setForm] = useState<BlogData>(
    initial || {
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      image: "",
      author: "Jeepping Travel",
      published: false,
      order: 0,
    }
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }

    if (name === "title" && !isEdit) {
      setForm((prev) => ({ ...prev, title: value, slug: slugify(value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url = isEdit ? `/api/admin/blog/${initial!.id}` : "/api/admin/blog";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Ошибка сохранения");
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Ошибка сети");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && (
        <div className="rounded-lg bg-terracotta/10 border border-terracotta/20 px-4 py-3 text-sm text-terracotta">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-border bg-bg-secondary p-6 space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">Основное</h2>

        <div>
          <label className="block text-sm font-medium text-text-secondary">Заголовок *</label>
          <input
            type="text"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            placeholder="Что взять с собой на джиппинг"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary">Slug (URL)</label>
          <input
            type="text"
            name="slug"
            required
            value={form.slug}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary font-mono focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary">Краткое описание (excerpt) *</label>
          <textarea
            name="excerpt"
            required
            rows={2}
            value={form.excerpt}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none resize-none"
            placeholder="Короткое описание для карточки и SEO..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary">Содержание (HTML) *</label>
          <textarea
            name="content"
            required
            rows={15}
            value={form.content}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary font-mono focus:border-accent focus:outline-none resize-y"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-bg-secondary p-6 space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">Дополнительно</h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-secondary">Изображение (URL)</label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
              placeholder="/uploads/blog/photo.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">Автор</label>
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">Порядок</label>
            <input
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handleChange}
                className="h-4 w-4 rounded accent-accent"
              />
              <span className="text-sm text-text-secondary">Опубликовать</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {saving ? "Сохранение..." : isEdit ? "Сохранить" : "Создать статью"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
