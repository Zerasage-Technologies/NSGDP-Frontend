"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Download,
  Upload,
  Bell,
  Building2,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
  roles?: string[]; // If specified, only show for these roles
}

const NAV_LINKS: NavLink[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/my-datasets",
    label: "My Datasets",
    icon: Database,
    roles: ["contributor", "admin", "super_admin"],
  },
  {
    href: "/dashboard/my-downloads",
    label: "My Downloads",
    icon: Download,
  },
  {
    href: "/dashboard/upload",
    label: "Upload Dataset",
    icon: Upload,
    roles: ["contributor", "admin", "super_admin"],
  },
  {
    href: "/dashboard/organisation",
    label: "Organization",
    icon: Building2,
    roles: ["admin", "super_admin"],
  },
  {
    href: "/dashboard/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    href: "/dashboard/profile",
    label: "Profile Settings",
    icon: User,
  },
];

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleLinks = NAV_LINKS.filter((link) => {
    if (!link.roles) return true;
    return user && link.roles.includes(user.role);
  });

  return (
    <aside className={cn("w-64 border-r bg-background", className)}>
      <nav className="flex flex-col gap-1 p-4">
        {visibleLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-muted font-semibold"
                )}
              >
                <Icon className="size-5" />
                {link.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

interface DashboardMobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function DashboardMobileSidebar({
  open,
  onClose,
}: DashboardMobileSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleLinks = NAV_LINKS.filter((link) => {
    if (!link.roles) return true;
    return user && link.roles.includes(user.role);
  });

  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <nav
        className="relative flex h-full w-64 max-w-[85vw] flex-col overflow-y-auto bg-background shadow-xl"
        aria-label="Dashboard navigation"
      >
        <div className="flex items-center justify-between border-b px-4 py-4">
          <h2 className="font-semibold">Dashboard</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-muted"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex flex-col gap-1 p-4">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link key={link.href} href={link.href} onClick={onClose}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-muted font-semibold"
                  )}
                >
                  <Icon className="size-5" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
