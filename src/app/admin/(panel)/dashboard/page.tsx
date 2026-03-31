import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  const [routes, reviews, faq, gallery] = await Promise.all([
    prisma.route.count({ where: { active: true } }),
    prisma.review.count({ where: { active: true } }),
    prisma.fAQ.count({ where: { active: true } }),
    prisma.galleryItem.count({ where: { active: true } }),
  ]);
  return { routes, reviews, faq, gallery };
}

const statCards = [
  {
    key: "routes" as const,
    label: "Маршруты",
    href: "/admin/routes",
    color: "bg-accent/10 text-accent",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
      </svg>
    ),
  },
  {
    key: "reviews" as const,
    label: "Отзывы",
    href: "/admin/reviews",
    color: "bg-green/10 text-green",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
  },
  {
    key: "faq" as const,
    label: "FAQ",
    href: "/admin/faq",
    color: "bg-[#2AABEE]/10 text-[#2AABEE]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
      </svg>
    ),
  },
  {
    key: "gallery" as const,
    label: "Галерея",
    href: "/admin/gallery",
    color: "bg-terracotta/10 text-terracotta",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
  },
];

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Панель управления</h1>
      <p className="mt-1 text-sm text-text-muted">Обзор контента на сайте</p>

      {/* Stats grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="group rounded-xl border border-border bg-bg-secondary p-6 transition-all hover:border-accent/30 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
                {card.icon}
              </div>
              <span className="text-3xl font-bold text-text-primary">
                {stats[card.key]}
              </span>
            </div>
            <div className="mt-4 text-sm font-medium text-text-secondary group-hover:text-accent transition-colors">
              {card.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-text-primary">Быстрые действия</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/admin/routes"
            className="flex items-center gap-3 rounded-xl border border-border bg-bg-secondary p-4 hover:border-accent/30 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-bg-primary text-sm font-bold">+</div>
            <span className="text-sm text-text-secondary">Добавить маршрут</span>
          </Link>
          <Link
            href="/admin/reviews"
            className="flex items-center gap-3 rounded-xl border border-border bg-bg-secondary p-4 hover:border-accent/30 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green text-white text-sm font-bold">+</div>
            <span className="text-sm text-text-secondary">Добавить отзыв</span>
          </Link>
          <Link
            href="/admin/contacts"
            className="flex items-center gap-3 rounded-xl border border-border bg-bg-secondary p-4 hover:border-accent/30 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2AABEE] text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </div>
            <span className="text-sm text-text-secondary">Изменить контакты</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
