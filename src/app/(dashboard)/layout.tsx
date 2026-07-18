"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import {
  DashboardSidebar,
  DashboardMobileSidebar,
} from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auth guard - redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?returnTo=/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block size-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - Fixed */}
        <DashboardSidebar className="hidden lg:flex" />

        {/* Mobile Sidebar */}
        <DashboardMobileSidebar
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        {/* Main Content - Scrollable */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Mobile Menu Button */}
          <div className="lg:hidden border-b bg-background px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(true)}
              className="gap-2"
            >
              <Menu className="size-5" />
              Dashboard Menu
            </Button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
