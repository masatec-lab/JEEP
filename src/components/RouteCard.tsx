import Link from "next/link";
import Image from "next/image";
import type { RouteData as Route } from "@/lib/data";

const difficultyColors: Record<number, string> = {
  1: "bg-green text-white",
  2: "bg-green text-white",
  3: "bg-accent text-bg-primary",
  4: "bg-terracotta text-white",
  5: "bg-red-600 text-white",
};

export default function RouteCard({ route }: { route: Route }) {
  return (
    <Link
      href={`/routes/${route.slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-bg-secondary overflow-hidden transition-all hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-bg-tertiary">
        {route.image && route.image.startsWith("/uploads") ? (
          <Image
            src={route.image}
            alt={route.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a1a] via-[#0d1f2d] to-[#1a1a1a]" />
        )}

        {/* Difficulty badge */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
              difficultyColors[route.difficulty]
            }`}
          >
            {route.difficultyLabel}
          </span>
        </div>

        {/* Price badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-block rounded-full bg-bg-primary/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-accent">
            от {route.price.toLocaleString("ru-RU")} ₽
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 z-5 bg-accent/0 group-hover:bg-accent/10 transition-colors" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">
          {route.name}
        </h3>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed flex-1">
          {route.shortDescription}
        </p>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {route.duration}
          </div>
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            {route.startPoint}
          </div>
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            до {route.maxPassengers} чел.
          </div>
        </div>

        {/* CTA */}
        <div className="mt-5 flex items-center text-sm font-semibold text-accent group-hover:gap-3 gap-2 transition-all">
          Подробнее
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
