import type { FreshnessStatus } from "@/types";

function getNextDueDate(updatedAt: string, frequency?: string): Date | null {
  const base = new Date(updatedAt);
  const freq = frequency?.toLowerCase();
  if (!freq) return null;
  if (freq.includes("daily"))     { base.setDate(base.getDate() + 1);    return base; }
  if (freq.includes("weekly"))    { base.setDate(base.getDate() + 7);    return base; }
  if (freq.includes("monthly"))   { base.setMonth(base.getMonth() + 1);  return base; }
  if (freq.includes("quarterly")) { base.setMonth(base.getMonth() + 3);  return base; }
  if (freq.includes("annually"))  { base.setFullYear(base.getFullYear() + 1); return base; }
  return null;
}

export function getFreshnessStatus(updatedAt: string, frequency?: string): FreshnessStatus {
  const dueDate = getNextDueDate(updatedAt, frequency);
  if (!dueDate) return "unknown";
  const now = new Date();
  const diffDays = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return "overdue";
  if (diffDays < 14) return "due_soon";
  return "fresh";
}
