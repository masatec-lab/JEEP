"use client";

import { useState, useMemo } from "react";
import type { RouteData } from "@/lib/data";
import RouteCard from "@/components/RouteCard";

type SortOption = "price-asc" | "price-desc" | "difficulty-asc" | "difficulty-desc";
type DifficultyFilter = number | null;

const difficultyOptions = [
  { value: 1, label: "Лёгкий" },
  { value: 2, label: "Средний" },
  { value: 3, label: "Выше среднего" },
  { value: 4, label: "Сложный" },
  { value: 5, label: "Экстремальный" },
];

export default function RoutesClient({ routes }: { routes: RouteData[] }) {
  const [sort, setSort] = useState<SortOption>("price-asc");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = [...routes];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.shortDescription.toLowerCase().includes(q) ||
          r.startPoint.toLowerCase().includes(q)
      );
    }

    if (difficultyFilter !== null) {
      result = result.filter((r) => r.difficulty === difficultyFilter);
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "difficulty-asc":
        result.sort((a, b) => a.difficulty - b.difficulty);
        break;
      case "difficulty-desc":
        result.sort((a, b) => b.difficulty - a.difficulty);
        break;
    }

    return result;
  }, [routes, sort, difficultyFilter, searchQuery]);

  return (
    <>
      {/* Filters */}
      <section className="border-b border-border bg-bg-primary sticky top-20 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <svg
                viewBox="0 0 24 24"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                placeholder="Поиск маршрута..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg-secondary py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDifficultyFilter(null)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  difficultyFilter === null
                    ? "bg-accent text-bg-primary"
                    : "bg-bg-secondary text-text-secondary hover:text-text-primary border border-border"
                }`}
              >
                Все
              </button>
              {difficultyOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    setDifficultyFilter(
                      difficultyFilter === opt.value ? null : opt.value
                    )
                  }
                  className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                    difficultyFilter === opt.value
                      ? "bg-accent text-bg-primary"
                      : "bg-bg-secondary text-text-secondary hover:text-text-primary border border-border"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="ml-auto rounded-lg border border-border bg-bg-secondary py-2.5 px-4 text-sm text-text-primary focus:border-accent focus:outline-none transition-colors cursor-pointer"
            >
              <option value="price-asc">Сначала дешёвые</option>
              <option value="price-desc">Сначала дорогие</option>
              <option value="difficulty-asc">Сначала простые</option>
              <option value="difficulty-desc">Сначала сложные</option>
            </select>
          </div>
        </div>
      </section>

      {/* Routes grid */}
      <section className="py-12 sm:py-16 bg-bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length > 0 ? (
            <>
              <p className="mb-8 text-sm text-text-muted">
                {filtered.length === 1
                  ? "Найден 1 маршрут"
                  : `Найдено ${filtered.length} маршрутов`}
              </p>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((route) => (
                  <RouteCard key={route.id} route={route} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-text-secondary">Маршруты не найдены</p>
              <p className="mt-2 text-sm text-text-muted">
                Попробуйте изменить фильтры или поисковый запрос
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setDifficultyFilter(null);
                }}
                className="mt-6 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
