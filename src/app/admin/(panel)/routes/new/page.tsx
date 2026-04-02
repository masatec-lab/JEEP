"use client";

import { useRouter } from "next/navigation";
import RouteForm from "@/components/admin/RouteForm";

export default function NewRoutePage() {
  const router = useRouter();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Новый маршрут</h1>
      <p className="mt-1 text-sm text-text-muted">
        Заполните информацию о маршруте
      </p>
      <div className="mt-6 max-w-3xl space-y-8">
        <RouteForm />

        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <button
            type="submit"
            form="route-form"
            className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors"
          >
            Создать маршрут
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/routes")}
            className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
