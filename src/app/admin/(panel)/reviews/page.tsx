"use client";

import { useEffect, useState } from "react";

interface Review {
  id: string;
  name: string;
  date: string;
  rating: number;
  text: string;
  route: string;
  active: boolean;
  order: number;
}

const emptyReview = {
  name: "",
  date: "",
  rating: 5,
  text: "",
  route: "",
  active: true,
  order: 0,
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Review | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyReview);
  const [saving, setSaving] = useState(false);

  const fetchReviews = async () => {
    const res = await fetch("/api/admin/reviews");
    if (res.ok) setReviews(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyReview);
    setCreating(true);
  };

  const openEdit = (review: Review) => {
    setCreating(false);
    setEditing(review);
    setForm({
      name: review.name,
      date: review.date,
      rating: review.rating,
      text: review.text,
      route: review.route,
      active: review.active,
      order: review.order,
    });
  };

  const closeForm = () => {
    setEditing(null);
    setCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const url = editing
      ? `/api/admin/reviews/${editing.id}`
      : "/api/admin/reviews";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      closeForm();
      fetchReviews();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить отзыв от "${name}"?`)) return;
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    if (res.ok) setReviews(reviews.filter((r) => r.id !== id));
  };

  const toggleActive = async (review: Review) => {
    await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...review, active: !review.active }),
    });
    fetchReviews();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-text-muted">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Отзывы</h1>
          <p className="mt-1 text-sm text-text-muted">{reviews.length} отзывов</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors"
        >
          + Добавить отзыв
        </button>
      </div>

      {/* Reviews list */}
      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className={`rounded-xl border border-border bg-bg-secondary p-5 transition-opacity ${
              !review.active ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">
                      {review.name}
                    </div>
                    <div className="text-xs text-text-muted">{review.date}</div>
                  </div>
                  <div className="flex gap-0.5 ml-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        viewBox="0 0 24 24"
                        className={`h-3.5 w-3.5 ${i < review.rating ? "text-accent" : "text-bg-tertiary"}`}
                        fill="currentColor"
                      >
                        <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm text-text-secondary line-clamp-2">
                  {review.text}
                </p>
                <span className="mt-2 inline-block rounded-full bg-bg-primary px-2.5 py-0.5 text-xs text-text-muted border border-border">
                  {review.route}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(review)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    review.active
                      ? "bg-green/10 text-green"
                      : "bg-bg-tertiary text-text-muted"
                  }`}
                >
                  {review.active ? "Виден" : "Скрыт"}
                </button>
                <button
                  onClick={() => openEdit(review)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:border-accent hover:text-accent transition-colors"
                >
                  Изменить
                </button>
                <button
                  onClick={() => handleDelete(review.id, review.name)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:border-terracotta hover:text-terracotta transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal form */}
      {(creating || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-bg-primary p-8 mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-text-primary">
              {editing ? "Редактировать отзыв" : "Новый отзыв"}
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary">
                    Имя *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-border bg-bg-secondary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                    placeholder="Анна М."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary">
                    Дата *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-border bg-bg-secondary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                    placeholder="Март 2026"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary">
                    Оценка
                  </label>
                  <select
                    value={form.rating}
                    onChange={(e) =>
                      setForm({ ...form, rating: parseInt(e.target.value) })
                    }
                    className="mt-1.5 w-full rounded-lg border border-border bg-bg-secondary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none cursor-pointer"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {"★".repeat(n)}{"☆".repeat(5 - n)} ({n})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary">
                    Маршрут
                  </label>
                  <input
                    type="text"
                    value={form.route}
                    onChange={(e) => setForm({ ...form, route: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-border bg-bg-secondary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                    placeholder="Лаго-Наки"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary">
                  Текст отзыва *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-border bg-bg-secondary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary">
                    Порядок
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: parseInt(e.target.value) || 0 })
                    }
                    className="mt-1.5 w-full rounded-lg border border-border bg-bg-secondary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) =>
                        setForm({ ...form, active: e.target.checked })
                      }
                      className="h-4 w-4 rounded accent-accent"
                    />
                    <span className="text-sm text-text-secondary">
                      Показывать на сайте
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  {saving ? "Сохранение..." : editing ? "Сохранить" : "Добавить"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
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
