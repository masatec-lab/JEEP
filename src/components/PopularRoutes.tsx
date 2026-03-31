import Link from "next/link";
import type { RouteData } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import RouteCard from "./RouteCard";

export default function PopularRoutes({ routes }: { routes: RouteData[] }) {
  return (
    <section className="py-20 sm:py-28 bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Популярные маршруты"
          subtitle="Самые востребованные направления, которые выбирают наши гости"
        />

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/routes"
            className="inline-flex items-center gap-2 rounded-full border border-accent px-8 py-3.5 text-sm font-semibold text-accent hover:bg-accent hover:text-bg-primary transition-all"
          >
            Все маршруты
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
