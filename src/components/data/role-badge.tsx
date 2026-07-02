import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const CONFIG: Record<UserRole, { label: string; className: string }> = {
  public:      { label: "Public",           className: "bg-muted text-muted-foreground" },
  registered:  { label: "Registered",       className: "bg-secondary text-secondary-foreground" },
  contributor: { label: "Contributor",      className: "bg-teal text-teal-foreground" },
  custodian:   { label: "Custodian",        className: "bg-cyan-100 text-cyan-800" },
  validator:   { label: "Validator",        className: "bg-violet-100 text-violet-800" },
  org_admin:   { label: "Org Admin",        className: "bg-info text-info-foreground" },
  repo_admin:  { label: "Repo Admin",       className: "bg-amber-100 text-amber-800" },
  ict_admin:   { label: "ICT Admin",        className: "bg-orange-100 text-orange-800" },
  super_admin: { label: "Super Admin",      className: "bg-primary text-primary-foreground" },
};

export function RoleBadge({
  role,
  className,
}: {
  role: UserRole;
  className?: string;
}) {
  const config = CONFIG[role] ?? CONFIG.registered;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
