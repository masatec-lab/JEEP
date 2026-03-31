"use client";

import { useEffect, useState } from "react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  active: boolean;
}

const emptyFaq = { question: "", answer: "", order: 0, active: true };

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyFaq);
  const [saving, setSaving] = useState(false);

  const fetchFaqs = async () => {
    const res = await fetch("/api/admin/faq");
    if (res.ok) setFaqs(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyFaq, order: faqs.length + 1 });
    setCreating(true);
  };

  const openEdit = (faq: FAQItem) => {
    setCreating(false);
    setEditing(faq);
    setForm({ question: faq.question, answer: faq.answer, order: faq.order, active: faq.active });
  };

  const closeForm = () => {
    setEditing(null);
    setCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editing ? `/api/admin/faq/${editing.id}` : "/api/admin/faq";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      closeForm();
      fetchFaqs();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот вопрос?")) return;
    const res = await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
    if (res.ok) setFaqs(faqs.filter((f) => f.id !== id));
  };

  const toggleActive = async (faq: FAQItem) => {
    await fetch(`/api/admin/faq/${faq.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...faq, active: !faq.active }),
    });
    fetchFaqs();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-text-muted">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">FAQ</h1>
          <p className="mt-1 text-sm text-text-muted">{faqs.length} вопросов</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors"
        >
          + Добавить вопрос
        </button>
      </div>

      {/* FAQ list */}
      <div className="mt-6 space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={faq.id}
            className={`rounded-xl border border-border bg-bg-secondary p-5 transition-opacity ${
              !faq.active ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 text-accent text-xs font-bold">
                    {i + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-text-primary">
                    {faq.question}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-text-secondary line-clamp-2 pl-8">
                  {faq.answer}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(faq)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    faq.active ? "bg-green/10 text-green" : "bg-bg-tertiary text-text-muted"
                  }`}
                >
                  {faq.active ? "Виден" : "Скрыт"}
                </button>
                <button
                  onClick={() => openEdit(faq)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:border-accent hover:text-accent transition-colors"
                >
                  Изменить
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:border-terracotta hover:text-terracotta transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {(creating || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-bg-primary p-8 mx-4">
            <h2 className="text-xl font-bold text-text-primary">
              {editing ? "Редактировать вопрос" : "Новый вопрос"}
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary">
                  Вопрос *
                </label>
                <input
                  type="text"
                  required
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-border bg-bg-secondary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                  placeholder="С какого возраста можно детям?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary">
                  Ответ *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="mt-1.5 w-full rounded-lg border border-border bg-bg-secondary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      className="h-4 w-4 rounded accent-accent"
                    />
                    <span className="text-sm text-text-secondary">Показывать на сайте</span>
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
