import { notFound } from "next/navigation";
import Link from "next/link";
import { routes, getRouteBySlug } from "@/data/routes";
import type { Metadata } from "next";

const difficultyColors: Record<number, string> = {
  1: "bg-green text-white",
  2: "bg-green text-white",
  3: "bg-accent text-bg-primary",
  4: "bg-terracotta text-white",
  5: "bg-red-600 text-white",
};

export async function generateStaticParams() {
  return routes.map((route) => ({ slug: route.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = getRouteBySlug(slug);
  if (!route) return {};

  return {
    title: `${route.name} — Джиппинг в Адыгее`,
    description: route.shortDescription,
  };
}

export default async function RoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = getRouteBySlug(slug);

  if (!route) notFound();

  const otherRoutes = routes.filter((r) => r.id !== route.id).slice(0, 3);

  return (
    <main className="pt-20">
      {/* Breadcrumb */}
      <div className="bg-bg-secondary border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-accent transition-colors">
              Главная
            </Link>
            <span>/</span>
            <Link href="/routes" className="hover:text-accent transition-colors">
              Маршруты
            </Link>
            <span>/</span>
            <span className="text-text-secondary">{route.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a1a] via-[#0d1f2d] to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex h-full items-end">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
            <span
              className={`inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${
                difficultyColors[route.difficulty]
              }`}
            >
              {route.difficultyLabel}
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary">
              {route.name}
            </h1>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl">
              {route.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 bg-bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-text-primary">
                  О маршруте
                </h2>
                <p className="mt-4 text-text-secondary leading-relaxed">
                  {route.description}
                </p>
              </div>

              {/* Highlights */}
              <div>
                <h2 className="text-2xl font-bold text-text-primary">
                  Что вы увидите
                </h2>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {route.highlights.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-border bg-bg-secondary p-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </div>
                      <span className="text-sm text-text-primary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Included */}
              <div>
                <h2 className="text-2xl font-bold text-text-primary">
                  Что включено
                </h2>
                <ul className="mt-4 space-y-3">
                  {route.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-text-secondary">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-green" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-28 rounded-2xl border border-border bg-bg-secondary p-6 space-y-6">
                {/* Price */}
                <div>
                  <div className="text-sm text-text-muted">Стоимость</div>
                  <div className="mt-1 text-3xl font-bold text-accent">
                    от {route.price.toLocaleString("ru-RU")} ₽
                  </div>
                  <div className="text-sm text-text-muted">{route.priceNote}</div>
                </div>

                {/* Meta */}
                <div className="space-y-4 border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Длительность</span>
                    <span className="text-sm font-medium text-text-primary">
                      {route.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Сложность</span>
                    <span
                      className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                        difficultyColors[route.difficulty]
                      }`}
                    >
                      {route.difficultyLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Пассажиры</span>
                    <span className="text-sm font-medium text-text-primary">
                      до {route.maxPassengers} чел.
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Старт</span>
                    <span className="text-sm font-medium text-text-primary">
                      {route.startPoint}
                    </span>
                  </div>
                  {/* Difficulty bar */}
                  <div>
                    <span className="text-sm text-text-muted">Уровень сложности</span>
                    <div className="mt-2 flex gap-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full ${
                            i < route.difficulty ? "bg-accent" : "bg-bg-tertiary"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-3 border-t border-border pt-6">
                  <Link
                    href="/contacts#booking"
                    className="block w-full rounded-full bg-accent py-3.5 text-center text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors"
                  >
                    Забронировать
                  </Link>
                  <a
                    href="https://wa.me/79991234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-green py-3.5 text-sm font-semibold text-green hover:bg-green hover:text-white transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Написать в WhatsApp
                  </a>
                  <a
                    href="tel:+79991234567"
                    className="block w-full text-center text-sm font-medium text-text-muted hover:text-accent transition-colors py-2"
                  >
                    или позвоните: +7 (999) 123-45-67
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other routes */}
      <section className="py-12 sm:py-16 bg-bg-secondary border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-text-primary">
            Другие маршруты
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {otherRoutes.map((r) => (
              <Link
                key={r.id}
                href={`/routes/${r.slug}`}
                className="group rounded-2xl border border-border bg-bg-primary p-6 transition-all hover:border-accent/30 hover:-translate-y-1"
              >
                <span
                  className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                    difficultyColors[r.difficulty]
                  }`}
                >
                  {r.difficultyLabel}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {r.name}
                </h3>
                <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                  {r.shortDescription}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-accent">
                    от {r.price.toLocaleString("ru-RU")} ₽
                  </span>
                  <span className="text-xs text-text-muted">{r.duration}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/routes"
              className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
            >
              Смотреть все маршруты &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
