import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="md:ml-64">
        <div className="container mx-auto p-6 pt-16 md:pt-6">{children}</div>
      </main>
    </div>
  );
}

