import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getRouteBySlug, getRoutes, getContacts } from "@/lib/data";
import JsonLd from "@/components/JsonLd";
import { PriceCalc, RoutePhotoGallery } from "@/components/RoutePageClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const difficultyColors: Record<number, string> = {
  1: "bg-green text-white",
  2: "bg-green text-white",
  3: "bg-accent text-bg-primary",
  4: "bg-terracotta text-white",
  5: "bg-red-600 text-white",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = await getRouteBySlug(slug);
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
  const route = await getRouteBySlug(slug);

  if (!route) notFound();

  const [allRoutes, contacts] = await Promise.all([getRoutes(), getContacts()]);
  const otherRoutes = allRoutes.filter((r) => r.id !== route.id).slice(0, 3);

  const routeLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: route.name,
    description: route.shortDescription,
    touristType: "Джиппинг",
    offers: {
      "@type": "Offer",
      price: route.price,
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main className="pt-20">
      <JsonLd data={routeLd} />
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
        {route.image && route.image.startsWith("/uploads") ? (
          <Image
            src={route.image}
            alt={route.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a1a] via-[#0d1f2d] to-[#0A0A0A]" />
        )}
        <div className="absolute inset-0 bg-black/40" />
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

      {/* Mobile price & calculator — visible only below lg */}
      <section className="lg:hidden py-6 bg-bg-secondary border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-accent">
                от {route.price.toLocaleString("ru-RU")} ₽
              </div>
              <div className="text-sm text-text-muted">{route.priceNote}</div>
            </div>
            <div className="text-right text-sm text-text-muted">
              <div>{route.duration}</div>
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold mt-1 ${
                  difficultyColors[route.difficulty]
                }`}
              >
                {route.difficultyLabel}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <PriceCalc
              instanceId="mobile"
              routeName={route.name}
              basePrice={route.price}
              pricePatriot={route.pricePatriot}
              hunterEnabled={route.hunterEnabled}
              patriotEnabled={route.patriotEnabled}
              extraHourPrice={route.extraHourPrice}
              maxExtraHours={route.maxExtraHours}
              duration={route.duration}
              startPoints={route.startPoints}
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 bg-bg-primary pb-28 lg:pb-16">
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

              {/* Route photos */}
              {route.photos && route.photos.length > 0 && (
                <RoutePhotoGallery photos={route.photos} />
              )}
            </div>

            {/* Sidebar — desktop only */}
            <div className="hidden lg:block">
              {/* Outer sticky: fixed height = viewport minus header */}
              <div className="sticky top-28 h-[calc(100vh-8rem)]">
                {/* Inner: flex column fills the height */}
                <div className="h-full flex flex-col rounded-2xl border border-border bg-bg-secondary">
                  {/* Top: Price — fixed */}
                  <div className="shrink-0 p-6 pb-4">
                    <div className="text-sm text-text-muted">Стоимость</div>
                    <div className="mt-1 text-3xl font-bold text-accent">
                      от {route.price.toLocaleString("ru-RU")} ₽
                    </div>
                    <div className="text-sm text-text-muted">{route.priceNote}</div>
                  </div>

                  {/* Middle: scrollable */}
                  <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-4 space-y-6" style={{ overscrollBehavior: "contain" }}>
                    {/* Meta */}
                    <div className="space-y-4 border-t border-border pt-4">
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

                    {/* Price calculator */}
                    <PriceCalc
                      instanceId="desktop"
                      routeName={route.name}
                      basePrice={route.price}
                      pricePatriot={route.pricePatriot}
                      hunterEnabled={route.hunterEnabled}
                      patriotEnabled={route.patriotEnabled}
                      extraHourPrice={route.extraHourPrice}
                      maxExtraHours={route.maxExtraHours}
                      duration={route.duration}
                      startPoints={route.startPoints}
                    />
                  </div>

                  {/* Bottom: CTA — always visible */}
                  <div className="shrink-0 p-6 pt-4 space-y-3 border-t border-border">
                    <Link
                      href="/contacts#booking"
                      className="block w-full rounded-full bg-accent py-3.5 text-center text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors"
                    >
                      Забронировать
                    </Link>
                    <div className="flex gap-2">
                      {/* WhatsApp */}
                      <a
                        href={contacts.whatsapp || "https://wa.me/79991234567"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-green py-2.5 text-green hover:bg-green hover:text-white transition-colors"
                        title="WhatsApp"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span className="text-xs font-semibold">WA</span>
                      </a>
                      {/* Telegram */}
                      <a
                        href={contacts.telegram || "https://t.me/jeepping_travel"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#2AABEE] py-2.5 text-[#2AABEE] hover:bg-[#2AABEE] hover:text-white transition-colors"
                        title="Telegram"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                        <span className="text-xs font-semibold">TG</span>
                      </a>
                      {/* Max */}
                      <a
                        href={contacts.max || "https://max.ru/jeepping_travel"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#FF6600] py-2.5 text-[#FF6600] hover:bg-[#FF6600] hover:text-white transition-colors"
                        title="Max"
                      >
                        <span className="text-sm font-bold">M</span>
                        <span className="text-xs font-semibold">Max</span>
                      </a>
                    </div>
                    <a
                      href={`tel:${contacts.phone_raw || "+79991234567"}`}
                      className="block w-full text-center text-xs font-medium text-text-muted hover:text-accent transition-colors py-1"
                    >
                      {contacts.phone || "+7 (999) 123-45-67"}
                    </a>
                  </div>
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
      {/* Mobile fixed CTA bar — visible only below lg */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-border bg-bg-secondary/95 backdrop-blur-md px-4 py-3 safe-bottom">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <Link
            href="/contacts#booking"
            className="flex-1 rounded-full bg-accent py-3 text-center text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors"
          >
            Забронировать
          </Link>
          <a href={contacts.whatsapp || "https://wa.me/79991234567"} target="_blank" rel="noopener noreferrer"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-green text-green hover:bg-green hover:text-white transition-colors" title="WhatsApp">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
          <a href={contacts.telegram || "https://t.me/jeepping_travel"} target="_blank" rel="noopener noreferrer"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#2AABEE] text-[#2AABEE] hover:bg-[#2AABEE] hover:text-white transition-colors" title="Telegram">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </a>
          <a href={contacts.max || "https://max.ru/jeepping_travel"} target="_blank" rel="noopener noreferrer"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#FF6600] text-[#FF6600] hover:bg-[#FF6600] hover:text-white transition-colors" title="Max">
            <span className="text-sm font-bold">M</span>
          </a>
          <a href={`tel:${contacts.phone_raw || "+79991234567"}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent text-accent hover:bg-accent hover:text-bg-primary transition-colors" title="Позвонить">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
}
