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

const ROLES: { value: UserRole; label: string }[] = [
  { value: "public", label: "Public Visitor" },
  { value: "registered", label: "Registered User" },
  { value: "contributor", label: "Data Contributor" },
  { value: "org_admin", label: "Organisation Admin" },
  { value: "super_admin", label: "Super Admin" },
];

export function RoleSwitcher() {
  const { currentUser, setRole } = useMockSession();
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          className="size-12 rounded-full bg-secondary text-secondary-foreground shadow-lg ring-2 ring-primary/20 hover:bg-secondary/80 inline-flex items-center justify-center"
          aria-label="Switch role (dev only)"
        >
          <Settings className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Dev: Role Switcher
            </DropdownMenuLabel>
            {ROLES.map((role) => (
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
