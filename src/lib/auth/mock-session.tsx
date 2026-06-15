"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User, UserRole } from "@/types";
import type { AccessRequestStatus } from "@/types/admin";
import { mockUsers } from "@/lib/mock/users";

export type DatasetAccessState = "none" | "pending" | "approved";

interface MockSessionContextType {
  currentUser: User;
  setRole: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  getDatasetAccess: (datasetId: string) => DatasetAccessState;
  requestDatasetAccess: (datasetId: string, reason: string) => void;
  approveDatasetAccess: (datasetId: string) => void;
  pendingDownloadSlug: string | null;
  setPendingDownloadSlug: (slug: string | null) => void;
}

const MockSessionContext = createContext<MockSessionContextType | undefined>(undefined);

function getUserForRole(role: UserRole): User {
  if (role === "org_admin") return mockUsers.orgAdmin;
  if (role === "super_admin") return mockUsers.superAdmin;
  return mockUsers[role] ?? mockUsers.public;
}

export function MockSessionProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("public");
  const [accessMap, setAccessMap] = useState<Record<string, DatasetAccessState>>({});
  const [pendingDownloadSlug, setPendingDownloadSlug] = useState<string | null>(null);

  const currentUser = getUserForRole(currentRole);
  const isAuthenticated = currentRole !== "public";

  const logout = useCallback(() => {
    setCurrentRole("public");
    setPendingDownloadSlug(null);
  }, []);

  const getDatasetAccess = useCallback(
    (datasetId: string): DatasetAccessState => accessMap[datasetId] ?? "none",
    [accessMap]
  );

  const requestDatasetAccess = useCallback((datasetId: string) => {
    setAccessMap((prev) => ({ ...prev, [datasetId]: "pending" }));
  }, []);

  const approveDatasetAccess = useCallback((datasetId: string) => {
    setAccessMap((prev) => ({ ...prev, [datasetId]: "approved" }));
  }, []);

  return (
    <MockSessionContext.Provider
      value={{
        currentUser,
        setRole: setCurrentRole,
        logout,
        isAuthenticated,
        getDatasetAccess,
        requestDatasetAccess,
        approveDatasetAccess,
        pendingDownloadSlug,
        setPendingDownloadSlug,
      }}
    >
      {children}
    </MockSessionContext.Provider>
  );
}

export function useMockSession() {
  const context = useContext(MockSessionContext);
  if (!context) {
    throw new Error("useMockSession must be used within MockSessionProvider");
  }
  return context;
}

// Re-export for admin mock store
export type { AccessRequestStatus };
