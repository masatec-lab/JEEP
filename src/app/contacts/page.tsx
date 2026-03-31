"use client";

import { useState } from "react";
import { routes } from "@/data/routes";

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    route: "",
    date: "",
    guests: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет отправка на API
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="pt-20">
      {/* Header */}
      <section className="py-16 sm:py-20 bg-bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
            Контакты
          </h1>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl">
            Свяжитесь с нами любым удобным способом — ответим быстро
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Contact info */}
            <div className="space-y-8">
              {/* Phone */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                  Телефон
                </h3>
                <a
                  href="tel:+79991234567"
                  className="mt-3 block text-xl font-semibold text-accent hover:text-accent-hover transition-colors"
                >
                  +7 (999) 123-45-67
                </a>
                <p className="mt-1 text-sm text-text-muted">
                  Ежедневно с 8:00 до 20:00
                </p>
              </div>

              {/* Messengers */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                  Мессенджеры
                </h3>
                <div className="mt-3 space-y-3">
                  <a
                    href="https://wa.me/79991234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border bg-bg-secondary p-4 hover:border-green/50 transition-colors group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green/10 text-green group-hover:bg-green group-hover:text-white transition-colors">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">WhatsApp</div>
                      <div className="text-xs text-text-muted">Напишите — ответим за 5 минут</div>
                    </div>
                  </a>
                  <a
                    href="https://t.me/jeepping_travel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border bg-bg-secondary p-4 hover:border-[#2AABEE]/50 transition-colors group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2AABEE]/10 text-[#2AABEE] group-hover:bg-[#2AABEE] group-hover:text-white transition-colors">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">Telegram</div>
                      <div className="text-xs text-text-muted">@jeepping_travel</div>
                    </div>
                  </a>
                  <a
                    href="https://max.ru/jeepping_travel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border bg-bg-secondary p-4 hover:border-[#FF6600]/50 transition-colors group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6600]/10 text-[#FF6600] group-hover:bg-[#FF6600] group-hover:text-white transition-colors">
                      <span className="text-sm font-bold">M</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">Max</div>
                      <div className="text-xs text-text-muted">Напишите в Max</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                  Где мы находимся
                </h3>
                <div className="mt-3 space-y-2 text-sm text-text-secondary">
                  <p>Республика Адыгея</p>
                  <p>пос. Каменномостский</p>
                  <p>ст. Даховская</p>
                </div>
              </div>

              {/* Working hours */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                  Режим работы
                </h3>
                <p className="mt-3 text-sm text-text-secondary">
                  Ежедневно, без выходных
                </p>
                <p className="text-sm text-text-secondary">
                  с 8:00 до 20:00
                </p>
              </div>
            </div>

            {/* Booking form */}
            <div className="lg:col-span-2" id="booking">
              <div className="rounded-2xl border border-border bg-bg-secondary p-8 sm:p-10">
                <h2 className="text-2xl font-bold text-text-primary">
                  Оставить заявку
                </h2>
                <p className="mt-2 text-sm text-text-muted">
                  Заполните форму — мы перезвоним и подтвердим бронирование
                </p>

                {submitted ? (
                  <div className="mt-10 text-center py-12">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green/10 text-green">
                      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-text-primary">
                      Заявка отправлена!
                    </h3>
                    <p className="mt-2 text-text-secondary">
                      Мы свяжемся с вами в течение 15 минут
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", phone: "", route: "", date: "", guests: "", message: "" });
                      }}
                      className="mt-6 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
                    >
                      Отправить ещё одну заявку
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-secondary">
                          Ваше имя *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-lg border border-border bg-bg-primary py-3 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
                          placeholder="Иван"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-text-secondary">
                          Телефон *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-lg border border-border bg-bg-primary py-3 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
                          placeholder="+7 (___) ___-__-__"
                        />
                      </div>

                      {/* Route */}
                      <div>
                        <label htmlFor="route" className="block text-sm font-medium text-text-secondary">
                          Маршрут
                        </label>
                        <select
                          id="route"
                          name="route"
                          value={formData.route}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-lg border border-border bg-bg-primary py-3 px-4 text-sm text-text-primary focus:border-accent focus:outline-none transition-colors cursor-pointer"
                        >
                          <option value="">Не определился</option>
                          {routes.map((r) => (
                            <option key={r.id} value={r.name}>
                              {r.name} — от {r.price.toLocaleString("ru-RU")} ₽
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Date */}
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-text-secondary">
                          Желаемая дата
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-lg border border-border bg-bg-primary py-3 px-4 text-sm text-text-primary focus:border-accent focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Guests */}
                      <div className="sm:col-span-2">
                        <label htmlFor="guests" className="block text-sm font-medium text-text-secondary">
                          Количество гостей
                        </label>
                        <select
                          id="guests"
                          name="guests"
                          value={formData.guests}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-lg border border-border bg-bg-primary py-3 px-4 text-sm text-text-primary focus:border-accent focus:outline-none transition-colors cursor-pointer"
                        >
                          <option value="">Выберите</option>
                          <option value="1-2">1-2 человека</option>
                          <option value="3-4">3-4 человека</option>
                          <option value="5-6">5-6 человек (УАЗ Хантер)</option>
                          <option value="7-8">7-8 человек (УАЗ Патриот)</option>
                          <option value="9+">9+ человек (несколько машин)</option>
                        </select>
                      </div>

                      {/* Message */}
                      <div className="sm:col-span-2">
                        <label htmlFor="message" className="block text-sm font-medium text-text-secondary">
                          Комментарий
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-lg border border-border bg-bg-primary py-3 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors resize-none"
                          placeholder="Есть ли дети? Нужен ли трансфер? Любые пожелания..."
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-full bg-accent py-4 text-base font-semibold text-bg-primary hover:bg-accent-hover transition-all hover:scale-[1.02] shadow-lg shadow-accent/20"
                    >
                      Отправить заявку
                    </button>

                    <p className="text-xs text-text-muted text-center">
                      Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
