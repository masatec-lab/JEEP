"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

interface Route {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  duration: string;
  difficulty: number;
  difficultyLabel: string;
  extraHourPrice: number;
  maxExtraHours: number;
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
    if (res.ok) setRoutes(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить маршрут "${name}"?`)) return;
    const res = await fetch(`/api/admin/routes/${id}`, { method: "DELETE" });
    if (res.ok) setRoutes(routes.filter((r) => r.id !== id));
  };

  const toggleActive = async (route: Route) => {
    await fetch(`/api/admin/routes/${route.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...route, active: !route.active }),
    });
    fetchRoutes();
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(routes);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setRoutes(reordered);

    await fetch("/api/admin/routes/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ routeIds: reordered.map((r) => r.id) }),
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-text-muted">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Маршруты</h1>
          <p className="mt-1 text-sm text-text-muted">
            {routes.length} маршрутов · перетаскивайте для изменения порядка
          </p>
        </div>
        <Link
          href="/admin/routes/new"
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors"
        >
          + Добавить маршрут
        </Link>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="routes">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="mt-6 space-y-3"
            >
              {routes.map((route, index) => (
                <Draggable key={route.id} draggableId={route.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center gap-4 rounded-xl border bg-bg-secondary p-4 transition-all ${
                        snapshot.isDragging
                          ? "border-accent shadow-xl ring-2 ring-accent/30"
                          : "border-border"
                      } ${!route.active ? "opacity-50" : ""}`}
                    >
                      {/* Drag handle */}
                      <div
                        {...provided.dragHandleProps}
                        className="shrink-0 text-text-muted hover:text-text-primary cursor-grab active:cursor-grabbing"
                        title="Перетащить"
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                          <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
                          <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                          <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
                        </svg>
                      </div>

                      {/* Photo */}
                      <div className="relative shrink-0 h-20 w-28 rounded-lg overflow-hidden bg-bg-tertiary">
                        {route.image && route.image.startsWith("/uploads") ? (
                          <Image
                            src={route.image}
                            alt={route.name}
                            fill
                            className="object-cover"
                            sizes="112px"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a1a] via-[#0d1f2d] to-[#1a1a1a]" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-text-primary truncate">
                            {route.name}
                          </h3>
                          {route.popular && (
                            <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                              Популярный
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-text-muted">
                          <span className="font-medium text-text-secondary">
                            {route.price.toLocaleString("ru-RU")} ₽
                          </span>
                          <span>{route.duration}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              difficultyColors[route.difficulty]
                            }`}
                          >
                            {route.difficultyLabel}
                          </span>
                          {route.extraHourPrice > 0 && (
                            <span className="text-text-muted">
                              +{route.extraHourPrice.toLocaleString("ru-RU")} ₽/час
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(route)}
                          className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                            route.active
                              ? "bg-green/10 text-green"
                              : "bg-bg-tertiary text-text-muted"
                          }`}
                        >
                          {route.active ? "Активен" : "Скрыт"}
                        </button>
                        <Link
                          href={`/admin/routes/${route.id}`}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:border-accent hover:text-accent transition-colors"
                        >
                          Изменить
                        </Link>
                        <button
                          onClick={() => handleDelete(route.id, route.name)}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:border-terracotta hover:text-terracotta transition-colors"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
