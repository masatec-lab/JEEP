"use client";

import { useEffect, useState } from "react";

interface ContactsForm {
  phone: string;
  phone_raw: string;
  whatsapp: string;
  telegram: string;
  telegram_username: string;
  max: string;
  address: string;
  working_hours: string;
}

const emptyForm: ContactsForm = {
  phone: "",
  phone_raw: "",
  whatsapp: "",
  telegram: "",
  telegram_username: "",
  max: "",
  address: "",
  working_hours: "",
};

const fields: { key: keyof ContactsForm; label: string; placeholder: string }[] = [
  { key: "phone", label: "Телефон (отображаемый)", placeholder: "+7 (999) 123-45-67" },
  { key: "phone_raw", label: "Телефон (для ссылки tel:)", placeholder: "+79991234567" },
  { key: "whatsapp", label: "WhatsApp (ссылка)", placeholder: "https://wa.me/79991234567" },
  { key: "telegram", label: "Telegram (ссылка)", placeholder: "https://t.me/jeepping_travel" },
  { key: "telegram_username", label: "Telegram (username)", placeholder: "@jeepping_travel" },
  { key: "max", label: "Max (ссылка)", placeholder: "https://max.ru/jeepping_travel" },
  { key: "address", label: "Адрес", placeholder: "Республика Адыгея, пос. Каменномостский" },
  { key: "working_hours", label: "Режим работы", placeholder: "Ежедневно с 8:00 до 20:00" },
];

export default function AdminContactsPage() {
  const [form, setForm] = useState<ContactsForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetch_() {
      const res = await fetch("/api/admin/contacts");
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

    const res = await fetch("/api/admin/contacts", {
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
      <h1 className="text-2xl font-bold text-text-primary">Контакты</h1>
      <p className="mt-1 text-sm text-text-muted">
        Контактная информация, отображаемая на сайте
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl">
        <div className="rounded-xl border border-border bg-bg-secondary p-6 space-y-5">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-text-secondary">
                {field.label}
              </label>
              <input
                type="text"
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary py-2.5 px-3.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                placeholder={field.placeholder}
              />
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
