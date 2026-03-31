"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RouteData {
  id?: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  priceNote: string;
  duration: string;
  difficulty: number;
  difficultyLabel: string;
  maxPassengers: number;
  highlights: string[];
  included: string[];
  image: string;
  startPoint: string;
  popular: boolean;
  active: boolean;
  order: number;
}

const difficultyOptions = [
  { value: 1, label: "Лёгкий" },
  { value: 2, label: "Средний" },
  { value: 3, label: "Выше среднего" },
  { value: 4, label: "Сложный" },
  { value: 5, label: "Экстремальный" },
];

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

export default function RouteForm({ initial }: { initial?: RouteData }) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [form, setForm] = useState<RouteData>(
    initial || {
      slug: "",
      name: "",
      shortDescription: "",
      description: "",
      price: 9000,
      priceNote: "за машину (до 6 чел.)",
      duration: "",
      difficulty: 2,
      difficultyLabel: "Средний",
      maxPassengers: 6,
      highlights: [""],
      included: ["Проезд на УАЗе", "Опытный водитель-инструктор"],
      image: "",
      startPoint: "пос. Каменномостский",
      popular: false,
      active: true,
      order: 0,
    }
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }

    // Auto-generate slug from name
    if (name === "name" && !isEdit) {
      setForm((prev) => ({ ...prev, name: value, slug: slugify(value) }));
    }

    // Auto-set difficultyLabel
    if (name === "difficulty") {
      const opt = difficultyOptions.find((o) => o.value === parseInt(value));
      if (opt) {
        setForm((prev) => ({
          ...prev,
          difficulty: parseInt(value),
          difficultyLabel: opt.label,
        }));
      }
    }
  };

  const handleListChange = (
    field: "highlights" | "included",
    index: number,
    value: string
  ) => {
    const list = [...form[field]];
    list[index] = value;
    setForm({ ...form, [field]: list });
  };

  const addListItem = (field: "highlights" | "included") => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const removeListItem = (field: "highlights" | "included", index: number) => {
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url = isEdit
        ? `/api/admin/routes/${initial!.id}`
        : "/api/admin/routes";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...form,
        highlights: form.highlights.filter((h) => h.trim()),
        included: form.included.filter((i) => i.trim()),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Ошибка сохранения");
        return;
      }

      router.push("/admin/routes");
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

      {/* Basic info */}
      <div className="rounded-xl border border-border bg-bg-secondary p-6 space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">
          Основная информация
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-text-secondary">
              Название *
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
              placeholder='Скала "Чёртов палец"'
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-text-secondary">
              Slug (URL)
            </label>
            <input
              type="text"
              name="slug"
              required
              value={form.slug}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary font-mono focus:border-accent focus:outline-none"
              placeholder="chertov-palec"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-text-secondary">
              Краткое описание *
            </label>
            <input
              type="text"
              name="shortDescription"
              required
              value={form.shortDescription}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
              placeholder="Панорамная смотровая площадка..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-text-secondary">
              Полное описание *
            </label>
            <textarea
              name="description"
              required
              rows={5}
              value={form.description}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Pricing & details */}
      <div className="rounded-xl border border-border bg-bg-secondary p-6 space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">
          Цена и параметры
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Цена (₽) *
            </label>
            <input
              type="number"
              name="price"
              required
              value={form.price}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Примечание к цене
            </label>
            <input
              type="text"
              name="priceNote"
              value={form.priceNote}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Длительность *
            </label>
            <input
              type="text"
              name="duration"
              required
              value={form.duration}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
              placeholder="2-3 часа"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Сложность
            </label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none cursor-pointer"
            >
              {difficultyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.value} — {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Макс. пассажиров
            </label>
            <input
              type="number"
              name="maxPassengers"
              value={form.maxPassengers}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Точка старта
            </label>
            <input
              type="text"
              name="startPoint"
              value={form.startPoint}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Порядок
            </label>
            <input
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-6 sm:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="popular"
                checked={form.popular}
                onChange={handleChange}
                className="h-4 w-4 rounded accent-accent"
              />
              <span className="text-sm text-text-secondary">Популярный</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="h-4 w-4 rounded accent-accent"
              />
              <span className="text-sm text-text-secondary">Активен</span>
            </label>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="rounded-xl border border-border bg-bg-secondary p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            Что вы увидите
          </h2>
          <button
            type="button"
            onClick={() => addListItem("highlights")}
            className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
          >
            + Добавить
          </button>
        </div>

        {form.highlights.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleListChange("highlights", i, e.target.value)}
              className="flex-1 rounded-lg border border-border bg-bg-primary py-2 px-3 text-sm text-text-primary focus:border-accent focus:outline-none"
              placeholder="Панорамный вид..."
            />
            <button
              type="button"
              onClick={() => removeListItem("highlights", i)}
              className="px-2 text-text-muted hover:text-terracotta transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Included */}
      <div className="rounded-xl border border-border bg-bg-secondary p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            Что включено
          </h2>
          <button
            type="button"
            onClick={() => addListItem("included")}
            className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
          >
            + Добавить
          </button>
        </div>

        {form.included.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleListChange("included", i, e.target.value)}
              className="flex-1 rounded-lg border border-border bg-bg-primary py-2 px-3 text-sm text-text-primary focus:border-accent focus:outline-none"
              placeholder="Проезд на УАЗе"
            />
            <button
              type="button"
              onClick={() => removeListItem("included", i)}
              className="px-2 text-text-muted hover:text-terracotta transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Image */}
      <div className="rounded-xl border border-border bg-bg-secondary p-6 space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">Фото</h2>
        <div>
          <label className="block text-sm font-medium text-text-secondary">
            Путь к изображению
          </label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            placeholder="/images/routes/photo.jpg"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {saving ? "Сохранение..." : isEdit ? "Сохранить" : "Создать маршрут"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/routes")}
          className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
