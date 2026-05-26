import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="p-6 md:p-10 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
