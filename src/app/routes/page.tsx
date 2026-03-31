import { getRoutes } from "@/lib/data";
import RoutesClient from "@/components/RoutesClient";

export const dynamic = "force-dynamic";

export default async function RoutesPage() {
  const routes = await getRoutes();

  return (
    <main className="pt-20">
      {/* Header */}
      <section className="py-16 sm:py-20 bg-bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
            Все маршруты
          </h1>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl">
            {routes.length}&nbsp;маршрутов на любой вкус — от часовой прогулки до
            экстремального восхождения на горный хребет
          </p>
        </div>
      </section>

      <RoutesClient routes={routes} />
    </main>
  );
}
