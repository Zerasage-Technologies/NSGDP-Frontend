"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { useMockSession } from "@/lib/auth/mock-session";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserRole } from "@/types";

const ROLES: { value: UserRole; label: string; group: string }[] = [
  { value: "public",      label: "Public Visitor",            group: "Public" },
  { value: "registered",  label: "Registered User",           group: "Public" },
  { value: "contributor", label: "Data Contributor",          group: "Internal" },
  { value: "custodian",   label: "Dataset Custodian",         group: "Internal" },
  { value: "validator",   label: "Data Validator",            group: "Internal" },
  { value: "org_admin",   label: "Organisation Admin",        group: "Admin" },
  { value: "repo_admin",  label: "Repository Administrator",  group: "Admin" },
  { value: "ict_admin",   label: "ICT Administrator",         group: "Admin" },
  { value: "super_admin", label: "Super Admin (Owner)",       group: "Admin" },
];

export function RoleSwitcher() {
  const { currentUser, setRole } = useMockSession();
  const [isOpen, setIsOpen] = useState(false);

  // Show in dev always; in production only when NEXT_PUBLIC_SHOW_ROLE_SWITCHER=true
  const show =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_SHOW_ROLE_SWITCHER === "true";

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          className="size-12 rounded-full bg-secondary text-secondary-foreground shadow-lg ring-2 ring-primary/20 hover:bg-secondary/80 inline-flex items-center justify-center"
          aria-label="Switch role (dev only)"
        >
          <Settings className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {(["Public", "Internal", "Admin"] as const).map((group) => (
            <DropdownMenuGroup key={group}>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {group}
              </DropdownMenuLabel>
              {ROLES.filter((r) => r.group === group).map((role) => (
                <DropdownMenuItem
                  key={role.value}
                  onClick={() => setRole(role.value)}
                  className={
                    currentUser.role === role.value
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                >
                  {role.label}
                  {currentUser.role === role.value && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
