"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RouteForm from "@/components/admin/RouteForm";
import RouteGallery from "@/components/admin/RouteGallery";

export default function EditRoutePage() {
  const params = useParams();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRoute() {
      const res = await fetch(`/api/admin/routes/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setRoute({
          ...data,
          highlights: JSON.parse(data.highlights || "[]"),
          included: JSON.parse(data.included || "[]"),
        });
      } else {
        setError("Маршрут не найден");
      }
      setLoading(false);
    }
    fetchRoute();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-text-muted">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-terracotta">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">
        Редактирование маршрута
      </h1>
      <p className="mt-1 text-sm text-text-muted">{route?.name}</p>
      <div className="mt-6 space-y-8 max-w-3xl">
        {route && <RouteForm initial={route} />}
        {route?.id && <RouteGallery routeId={route.id} />}

        {/* Actions — внизу страницы */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <button
            type="submit"
            form="route-form"
            className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors"
          >
            Сохранить маршрут
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/routes")}
            className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Назад к маршрутам
          </button>
        </div>
      </div>
    </div>
  );
}
