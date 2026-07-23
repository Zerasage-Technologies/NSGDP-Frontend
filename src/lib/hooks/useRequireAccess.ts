"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import type { PermissionActionKey } from "@/lib/types/auth";
import type { UserRole } from "@/types";

/**
 * Client-side route guard: redirect away if the user has neither the
 * required role nor any of the required delegated permissions.
 *
 * This is a UX nicety only — real enforcement is server-side (AccessGuard).
 * It just avoids showing a page whose every action would immediately 403.
 */
export function useRequireAccess(roles: UserRole[], permissions: PermissionActionKey[]) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const allowed =
    !!user &&
    (roles.includes(user.role) || (user.permissions ?? []).some((p) => permissions.includes(p)));

  useEffect(() => {
    if (isLoading) return;
    if (!user || !allowed) router.replace("/dashboard");
  }, [user, isLoading, allowed, router]);

  return { allowed, isLoading };
}
