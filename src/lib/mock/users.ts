import type { User } from "@/types";

// Mock users for role simulation
export const mockUsers: Record<string, User> = {
  public: {
    id: "user-public",
    fullName: "Public Visitor",
    email: "",
    role: "public",
    organisationIds: [],
  },
  registered: {
    id: "user-001",
    fullName: "Fatima Bello",
    email: "fatima.bello@example.com",
    role: "registered",
    organisationIds: [],
  },
  contributor: {
    id: "user-002",
    fullName: "Ibrahim Suleiman",
    email: "ibrahim.suleiman@health.niger.gov.ng",
    role: "contributor",
    organisationIds: ["org-1"],
  },
  orgAdmin: {
    id: "user-003",
    fullName: "Dr. Amina Yusuf",
    email: "amina.yusuf@health.niger.gov.ng",
    role: "org_admin",
    organisationIds: ["org-1"],
  },
  superAdmin: {
    id: "user-004",
    fullName: "Musa Abdullahi",
    email: "musa.abdullahi@niger.gov.ng",
    role: "super_admin",
    organisationIds: [],
  },
};
