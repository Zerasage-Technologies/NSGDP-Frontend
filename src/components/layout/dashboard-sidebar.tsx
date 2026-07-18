"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Download,
  Bell,
  Building2,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/ui/role-badge";
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
    href: "/dataportal",
    label: "Browse Datasets",
    icon: Database,
  },
  {
    href: "/my-datasets",
    label: "My Datasets",
    icon: Database,
    roles: ["contributor", "admin"],
  },
  {
    href: "/my-downloads",
    label: "My Downloads",
    icon: Download,
  },
  // Org Admin Section (M2 Scope: Team Management + Organization Profile)
  {
    href: "/organisation",
    label: "Organization",
    icon: Building2,
    roles: ["contributor", "admin"], // Contributors can view, admins can manage
  },
  // Common Section
  {
    href: "/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    href: "/profile",
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
    <aside className={cn("w-64 border-r bg-background flex flex-col", className)}>
      {/* Organization Name at Top */}
      {user?.organisationName && (
        <div className="border-b px-4 py-3 bg-muted/30">
          <div className="flex items-center gap-2">
            <Building2 className="size-4 text-muted-foreground flex-shrink-0" />
            <p className="text-sm font-semibold text-foreground truncate">
              {user.organisationName}
            </p>
          </div>
        </div>
      )}
      
      <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
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
      
      {/* User Info with Role Badge */}
      {user && (
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.firstName} {user.lastName}
              </p>
              <RoleBadge role={user.role} className="mt-1" />
            </div>
          </div>
        </div>
      )}
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

        {/* Organization Name at Top */}
        {user?.organisationName && (
          <div className="border-b px-4 py-3 bg-muted/30">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground flex-shrink-0" />
              <p className="text-sm font-semibold text-foreground truncate">
                {user.organisationName}
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
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

        {/* User Info with Role Badge */}
        {user && (
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.firstName} {user.lastName}
                </p>
                <RoleBadge role={user.role} className="mt-1" />
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
