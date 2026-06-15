import type {
  ActivityItem,
  AuditLogEntry,
  AccessRequest,
  NotificationItem,
  AdminUser,
  SystemHealth,
} from "@/types/admin";

export const mockActivityFeed: ActivityItem[] = [
  {
    id: "act-1",
    type: "upload",
    message: "Malaria Case Surveillance 2024 submitted for review",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    userName: "Ibrahim Suleiman",
  },
  {
    id: "act-2",
    type: "download",
    message: "Health Facility Registry downloaded",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    userName: "Fatima Bello",
  },
  {
    id: "act-3",
    type: "review",
    message: "Routine Immunisation Coverage approved",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    userName: "Musa Abdullahi",
  },
  {
    id: "act-4",
    type: "register",
    message: "New user registered: Aisha Mohammed",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-5",
    type: "access_request",
    message: "Access requested for NHMIS Aggregate Data",
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    userName: "Fatima Bello",
  },
];

export const mockNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Dataset approved",
    message: "Your submission 'LGA Population Estimates' has been published.",
    read: false,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-2",
    title: "Access granted",
    message: "Your request for NHMIS Aggregate Data was approved.",
    read: false,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-3",
    title: "Revision requested",
    message: "Admin requested changes to Malaria Surveillance dataset.",
    read: true,
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockAuditLog: AuditLogEntry[] = [
  {
    id: "audit-1",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    userId: "user-004",
    userName: "Musa Abdullahi",
    action: "approve",
    resource: "Routine Immunisation Coverage",
    ipAddress: "197.210.52.14",
  },
  {
    id: "audit-2",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    userId: "user-001",
    userName: "Fatima Bello",
    action: "download",
    resource: "Health Facility Registry",
    ipAddress: "197.210.52.88",
  },
  {
    id: "audit-3",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    userId: "user-002",
    userName: "Ibrahim Suleiman",
    action: "upload",
    resource: "Malaria Case Surveillance 2024",
    ipAddress: "197.210.52.33",
  },
  {
    id: "audit-4",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-004",
    userName: "Musa Abdullahi",
    action: "login",
    resource: "Admin Console",
    ipAddress: "197.210.52.14",
  },
  {
    id: "audit-5",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    userId: "user-004",
    userName: "Musa Abdullahi",
    action: "reject",
    resource: "Incomplete Facility List",
    ipAddress: "197.210.52.14",
  },
  {
    id: "audit-6",
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    userId: "user-003",
    userName: "Dr. Amina Yusuf",
    action: "role_change",
    resource: "Ibrahim Suleiman → contributor",
    ipAddress: "197.210.52.22",
  },
];

export const mockAccessRequests: AccessRequest[] = [
  {
    id: "ar-1",
    userId: "user-001",
    userName: "Fatima Bello",
    userEmail: "fatima.bello@example.com",
    datasetId: "ds-12",
    datasetTitle: "NHMIS Aggregate Health Indicators",
    reason: "Conducting maternal health research for my MSc thesis at ABU Zaria.",
    requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "ar-2",
    userId: "user-001",
    userName: "Fatima Bello",
    userEmail: "fatima.bello@example.com",
    datasetId: "ds-18",
    datasetTitle: "HIV Unit Surveillance Data",
    reason: "Policy analysis for Niger State HIV/AIDS strategic plan review.",
    requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "ar-3",
    userId: "user-002",
    userName: "Ibrahim Suleiman",
    userEmail: "ibrahim.suleiman@health.niger.gov.ng",
    datasetId: "ds-25",
    datasetTitle: "Internal Disease Surveillance Brief",
    reason: "Cross-referencing with submitted malaria dataset for validation.",
    requestedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "approved",
  },
];

export const mockAdminUsers: AdminUser[] = [
  {
    id: "user-001",
    fullName: "Fatima Bello",
    email: "fatima.bello@example.com",
    role: "registered",
    joinedAt: "2025-11-12",
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: "user-002",
    fullName: "Ibrahim Suleiman",
    email: "ibrahim.suleiman@health.niger.gov.ng",
    role: "contributor",
    joinedAt: "2025-09-03",
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: "user-003",
    fullName: "Dr. Amina Yusuf",
    email: "amina.yusuf@health.niger.gov.ng",
    role: "org_admin",
    joinedAt: "2025-06-15",
    lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: "user-004",
    fullName: "Musa Abdullahi",
    email: "musa.abdullahi@niger.gov.ng",
    role: "super_admin",
    joinedAt: "2025-01-10",
    lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: "user-005",
    fullName: "Aisha Mohammed",
    email: "aisha.mohammed@example.com",
    role: "registered",
    joinedAt: "2026-01-20",
    lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "suspended",
  },
];

export const mockSystemHealth: SystemHealth = {
  api: "healthy",
  database: "healthy",
  storage: "healthy",
  queue: "degraded",
};

export function generateActivityData(days: number) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      views: Math.floor(50 + Math.random() * 150),
      downloads: Math.floor(10 + Math.random() * 40),
    });
  }
  return data;
}
