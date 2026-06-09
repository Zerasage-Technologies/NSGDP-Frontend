import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const CONFIG: Record<UserRole, { label: string; className: string }> = {
  public: { label: "Public", className: "bg-muted text-muted-foreground" },
  registered: {
    label: "Registered",
    className: "bg-secondary text-secondary-foreground",
  },
  contributor: { label: "Contributor", className: "bg-teal text-teal-foreground" },
  org_admin: { label: "Org Admin", className: "bg-info text-info-foreground" },
  super_admin: {
    label: "Super Admin",
    className: "bg-primary text-primary-foreground",
  },
};

export function RoleBadge({
  role,
  className,
}: {
  role: UserRole;
  className?: string;
}) {
  const { label, className: tone } = CONFIG[role];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        tone,
        className,
      )}
    >
      {label}
    </span>
  );
}
