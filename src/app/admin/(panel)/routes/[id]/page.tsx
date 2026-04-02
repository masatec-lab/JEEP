"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RouteForm from "@/components/admin/RouteForm";
import RouteGallery from "@/components/admin/RouteGallery";

export default function EditRoutePage() {
  const params = useParams();
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
      <div className="mt-6 space-y-8">
        {route && <RouteForm initial={route} />}
        {route?.id && <RouteGallery routeId={route.id} />}
      </div>
    </div>
  );
}
