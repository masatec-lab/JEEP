"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  startPoints: { name: string; extraPrice: number }[];
  hunterEnabled: boolean;
  patriotEnabled: boolean;
  pricePatriot: number;
  extraHourPrice: number;
  maxExtraHours: number;
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
      startPoints: [
        { name: "пос. Каменномостский", extraPrice: 0 },
        { name: "ст. Даховская", extraPrice: 1000 },
      ],
      hunterEnabled: true,
      patriotEnabled: false,
      pricePatriot: 12000,
      extraHourPrice: 1500,
      maxExtraHours: 2,
      popular: false,
      active: true,
      order: 0,
    }
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

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

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "routes");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        setForm((prev) => ({ ...prev, image: url }));
      }
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) uploadPhoto(file);
  };

  const handlePhotoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadPhoto(file);
    if (photoRef.current) photoRef.current.value = "";
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
        startPoints: form.startPoints.filter((sp) => sp.name.trim()),
        startPoint: form.startPoints.find((sp) => sp.extraPrice === 0)?.name || form.startPoints[0]?.name || form.startPoint,
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
    <form id="route-form" onSubmit={handleSubmit} className="max-w-3xl space-y-8">
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

      {/* Vehicle prices */}
      <div className="rounded-xl border border-border bg-bg-secondary p-6 space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">Машины и цены</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className={`rounded-lg border p-4 transition-opacity ${
            form.hunterEnabled ? "border-accent/30 bg-bg-primary" : "border-border bg-bg-primary opacity-50"
          }`}>
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input
                type="checkbox"
                name="hunterEnabled"
                checked={form.hunterEnabled}
                onChange={handleChange}
                className="h-4 w-4 rounded accent-accent"
              />
              <span className="text-sm font-semibold text-text-primary">УАЗ Хантер</span>
              <span className="text-xs text-text-muted bg-bg-tertiary rounded-full px-2 py-0.5">до 6 чел.</span>
            </label>
            <label className="block text-sm font-medium text-text-secondary">Цена (₽)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-secondary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          <div className={`rounded-lg border p-4 transition-opacity ${
            form.patriotEnabled ? "border-accent/30 bg-bg-primary" : "border-border bg-bg-primary opacity-50"
          }`}>
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input
                type="checkbox"
                name="patriotEnabled"
                checked={form.patriotEnabled}
                onChange={handleChange}
                className="h-4 w-4 rounded accent-accent"
              />
              <span className="text-sm font-semibold text-text-primary">УАЗ Патриот</span>
              <span className="text-xs text-text-muted bg-bg-tertiary rounded-full px-2 py-0.5">до 8 чел.</span>
            </label>
            <label className="block text-sm font-medium text-text-secondary">Цена (₽)</label>
            <input
              type="number"
              name="pricePatriot"
              value={form.pricePatriot}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-secondary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
          </div>
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
      </div>

      {/* Route details */}
      <div className="rounded-xl border border-border bg-bg-secondary p-6 space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">Параметры</h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

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

      {/* Start points */}
      <div className="rounded-xl border border-border bg-bg-secondary p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Точки старта</h2>
            <p className="text-xs text-text-muted">Первая точка с доплатой 0 ₽ — базовая</p>
          </div>
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                startPoints: [...form.startPoints, { name: "", extraPrice: 0 }],
              })
            }
            className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
          >
            + Добавить
          </button>
        </div>

        {form.startPoints.map((sp, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              value={sp.name}
              onChange={(e) => {
                const updated = [...form.startPoints];
                updated[i] = { ...updated[i], name: e.target.value };
                setForm({ ...form, startPoints: updated });
              }}
              className="flex-1 rounded-lg border border-border bg-bg-primary py-2 px-3 text-sm text-text-primary focus:border-accent focus:outline-none"
              placeholder="пос. Каменномостский"
            />
            <div className="flex items-center gap-1">
              <span className="text-xs text-text-muted">+</span>
              <input
                type="number"
                value={sp.extraPrice}
                onChange={(e) => {
                  const updated = [...form.startPoints];
                  updated[i] = { ...updated[i], extraPrice: parseInt(e.target.value) || 0 };
                  setForm({ ...form, startPoints: updated });
                }}
                className="w-24 rounded-lg border border-border bg-bg-primary py-2 px-3 text-sm text-text-primary focus:border-accent focus:outline-none"
                min="0"
                step="500"
              />
              <span className="text-xs text-text-muted">₽</span>
            </div>
            {sp.extraPrice === 0 && (
              <span className="text-[10px] font-medium text-green bg-green/10 rounded-full px-2 py-0.5">базовая</span>
            )}
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  startPoints: form.startPoints.filter((_, idx) => idx !== i),
                })
              }
              className="px-2 text-text-muted hover:text-terracotta transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Main photo */}
      <div className="rounded-xl border border-border bg-bg-secondary p-6 space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Главное фото</h2>

        {form.image ? (
          <div className="relative group">
            <div className="relative h-48 rounded-xl overflow-hidden bg-bg-tertiary">
              {form.image.startsWith("/uploads") ? (
                <Image
                  src={form.image}
                  alt={form.name || "Фото маршрута"}
                  fill
                  className="object-cover"
                  sizes="600px"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a1a] via-[#0d1f2d] to-[#1a1a1a] flex items-center justify-center">
                  <span className="text-xs text-text-muted">{form.image}</span>
                </div>
              )}

              {/* Replace overlay */}
              <label className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-colors cursor-pointer">
                <span className="opacity-0 group-hover:opacity-100 rounded-lg bg-white/90 px-4 py-2 text-xs font-medium text-bg-primary transition-opacity">
                  {uploading ? "Загрузка..." : "Заменить фото"}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handlePhotoInput}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, image: "" })}
              className="mt-2 text-xs text-text-muted hover:text-terracotta transition-colors"
            >
              Удалить фото
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
            onDrop={handlePhotoDrop}
            onClick={() => photoRef.current?.click()}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 cursor-pointer transition-all ${
              dragOver ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
            }`}
          >
            <input
              ref={photoRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handlePhotoInput}
              className="hidden"
            />
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-text-muted" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <p className="mt-3 text-sm text-text-primary">
              {uploading ? "Загрузка..." : dragOver ? "Отпустите файл" : "Перетащите фото или нажмите"}
            </p>
            <p className="mt-1 text-xs text-text-muted">JPG, PNG, WebP, AVIF — до 10 МБ</p>
          </div>
        )}
      </div>

      {/* Extra hours */}
      <div className="rounded-xl border border-border bg-bg-secondary p-6 space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">Продление маршрута</h2>
        <p className="text-xs text-text-muted">
          Клиенты смогут продлить поездку за дополнительную плату. Укажите 0 чтобы отключить.
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Цена за доп. час (₽)
            </label>
            <input
              type="number"
              name="extraHourPrice"
              value={form.extraHourPrice}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
              min="0"
              step="500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Макс. доп. часов
            </label>
            <input
              type="number"
              name="maxExtraHours"
              value={form.maxExtraHours}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
              min="0"
              max="5"
            />
          </div>
        </div>

        {form.extraHourPrice > 0 && form.maxExtraHours > 0 && (
          <div className="rounded-lg bg-bg-primary p-4 border border-border">
            <p className="text-xs font-medium text-text-muted mb-2">Как увидит клиент:</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Базовый маршрут ({form.duration})</span>
                <span className="font-medium text-text-primary">{form.price.toLocaleString("ru-RU")} ₽</span>
              </div>
              {Array.from({ length: form.maxExtraHours }).map((_, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-text-secondary">+ {i + 1} час</span>
                  <span className="font-medium text-accent">
                    {(form.price + form.extraHourPrice * (i + 1)).toLocaleString("ru-RU")} ₽
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </form>
  );
}
