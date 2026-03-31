import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <AdminSidebar />
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
