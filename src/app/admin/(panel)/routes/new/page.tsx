import RouteForm from "@/components/admin/RouteForm";

export default function NewRoutePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Новый маршрут</h1>
      <p className="mt-1 text-sm text-text-muted">
        Заполните информацию о маршруте
      </p>
      <div className="mt-6">
        <RouteForm />
      </div>
    </div>
  );
}
