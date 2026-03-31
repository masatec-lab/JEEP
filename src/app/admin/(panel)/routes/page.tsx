"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Route {
  id: string;
  slug: string;
  name: string;
  price: number;
  difficulty: number;
  difficultyLabel: string;
  duration: string;
  popular: boolean;
  active: boolean;
  order: number;
}

const difficultyColors: Record<number, string> = {
  1: "bg-green/10 text-green",
  2: "bg-green/10 text-green",
  3: "bg-accent/10 text-accent",
  4: "bg-terracotta/10 text-terracotta",
  5: "bg-red-600/10 text-red-500",
};

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutes = async () => {
    const res = await fetch("/api/admin/routes");
    if (res.ok) {
      setRoutes(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить маршрут "${name}"?`)) return;

    const res = await fetch(`/api/admin/routes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRoutes(routes.filter((r) => r.id !== id));
    }
  };

  const toggleActive = async (route: Route) => {
    const res = await fetch(`/api/admin/routes/${route.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...route, active: !route.active }),
    });
    if (res.ok) {
      fetchRoutes();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-text-muted">Загрузка...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Маршруты</h1>
          <p className="mt-1 text-sm text-text-muted">
            {routes.length} маршрутов
          </p>
        </div>
        <Link
          href="/admin/routes/new"
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors"
        >
          + Добавить маршрут
        </Link>
      </div>

      {/* Table */}
      <div className="mt-6 rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-bg-secondary border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                №
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Название
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Цена
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Сложность
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Длительность
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Статус
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {routes.map((route) => (
              <tr
                key={route.id}
                className={`hover:bg-bg-secondary/50 transition-colors ${
                  !route.active ? "opacity-50" : ""
                }`}
              >
                <td className="px-4 py-3 text-sm text-text-muted">
                  {route.order}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-text-primary">
                    {route.name}
                  </div>
                  <div className="text-xs text-text-muted">/{route.slug}</div>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {route.price.toLocaleString("ru-RU")} ₽
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      difficultyColors[route.difficulty]
                    }`}
                  >
                    {route.difficultyLabel}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {route.duration}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(route)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                      route.active
                        ? "bg-green/10 text-green"
                        : "bg-bg-tertiary text-text-muted"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        route.active ? "bg-green" : "bg-text-muted"
                      }`}
                    />
                    {route.active ? "Активен" : "Скрыт"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/routes/${route.id}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:border-accent hover:text-accent transition-colors"
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(route.id, route.name)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:border-terracotta hover:text-terracotta transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
