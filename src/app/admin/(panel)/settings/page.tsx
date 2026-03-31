"use client";

import { useEffect, useState } from "react";

interface SettingsForm {
  site_name: string;
  site_description: string;
  seo_title: string;
  seo_description: string;
}

const emptyForm: SettingsForm = {
  site_name: "",
  site_description: "",
  seo_title: "",
  seo_description: "",
};

const fields: { key: keyof SettingsForm; label: string; placeholder: string; multiline?: boolean }[] = [
  { key: "site_name", label: "Название сайта", placeholder: "Jeepping Travel Адыгея" },
  { key: "site_description", label: "Описание сайта", placeholder: "Джиппинг-туры по горам Адыгеи на УАЗах" },
  { key: "seo_title", label: "SEO Title (тег title)", placeholder: "Jeepping Travel Адыгея — Джиппинг-туры по горам Адыгеи" },
  { key: "seo_description", label: "SEO Description (meta description)", placeholder: "Джиппинг в Адыгее на УАЗах...", multiline: true },
];

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetch_() {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setForm({ ...emptyForm, ...data });
      }
      setLoading(false);
    }
    fetch_();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-text-muted">Загрузка...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Настройки</h1>
      <p className="mt-1 text-sm text-text-muted">
        Общие настройки сайта и SEO
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl">
        <div className="rounded-xl border border-border bg-bg-secondary p-6 space-y-5">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-text-secondary">
                {field.label}
              </label>
              {field.multiline ? (
                <textarea
                  rows={3}
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none resize-none"
                  placeholder={field.placeholder}
                />
              ) : (
                <input
                  type="text"
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
          {saved && (
            <span className="text-sm text-green font-medium">Сохранено!</span>
          )}
        </div>
      </form>
    </div>
  );
}
