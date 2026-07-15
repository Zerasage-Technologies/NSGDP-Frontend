"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar, AdminMobileSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Only super_admin can access admin area
  const isSuperAdmin = user?.role === "super_admin";

  useEffect(() => {
    if (!user) {
      // No user at all - go to login
      router.replace("/login");
    } else if (!isSuperAdmin) {
      // User exists but not super admin - go to dashboard
      router.replace("/dashboard");
    }
  }, [user, isSuperAdmin, router]);

  if (!user || !isSuperAdmin) {
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
