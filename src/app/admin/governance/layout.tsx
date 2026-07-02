"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActivitySquare, BookOpen, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

const SUB_NAV = [
  { href: "/admin/governance",       label: "Overview",      icon: ActivitySquare, exact: true },
  { href: "/admin/governance/health", label: "Health Metrics", icon: HeartPulse },
  { href: "/admin/governance/sops",   label: "SOPs",          icon: BookOpen },
];

export default function GovernanceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <nav className="flex gap-1 border-b pb-0" aria-label="Governance sub-navigation">
        {SUB_NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
