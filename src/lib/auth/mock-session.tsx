"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { User, UserRole } from "@/types";
import { mockUsers } from "@/lib/mock/users";

interface MockSessionContextType {
  currentUser: User;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
}

const MockSessionContext = createContext<MockSessionContextType | undefined>(undefined);

export function MockSessionProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("public");

  const currentUser = mockUsers[currentRole === "org_admin" ? "orgAdmin" : currentRole === "super_admin" ? "superAdmin" : currentRole];

  const isAuthenticated = currentRole !== "public";

  return (
    <MockSessionContext.Provider
      value={{
        currentUser,
        setRole: setCurrentRole,
        isAuthenticated,
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
