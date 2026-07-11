"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMockSession } from "@/lib/auth/mock-session";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar, AdminMobileSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentUser } = useMockSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const ADMIN_ROLES = ["super_admin", "admin", "admin"] as const;
  const hasAdminAccess = ADMIN_ROLES.includes(
    currentUser.role as (typeof ADMIN_ROLES)[number]
  );

  useEffect(() => {
    if (!hasAdminAccess) {
      router.replace("/dashboard");
    }
  }, [hasAdminAccess, router]);

  if (!hasAdminAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <AdminMobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <AdminHeader
          onMenuClick={() => setMobileOpen((o) => !o)}
          menuOpen={mobileOpen}
        />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
