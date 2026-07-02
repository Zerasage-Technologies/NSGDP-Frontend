"use client";

import { useMemo } from "react";
import { useMockSession } from "@/lib/auth/mock-session";
import {
  canEditProgram,
  canProgram,
  getEffectiveProgramPermissions,
} from "@/lib/auth/program-permissions";
import type { ProgramCapability } from "@/lib/auth/program-permissions";

export function useProgramPermissions() {
  const { currentUser } = useMockSession();

  return useMemo(
    () => ({
      permissions: getEffectiveProgramPermissions(currentUser.role, currentUser.id),
      can: (capability: ProgramCapability) =>
        canProgram(currentUser.role, currentUser.id, capability),
      canEdit: (programOrganisationId?: string) =>
        canEditProgram(
          currentUser.role,
          currentUser.id,
          currentUser.organisationIds,
          programOrganisationId
        ),
      canCreate: canProgram(currentUser.role, currentUser.id, "create"),
      canUpload: canProgram(currentUser.role, currentUser.id, "upload"),
      canDelete: canProgram(currentUser.role, currentUser.id, "delete"),
    }),
    [currentUser]
  );
}
