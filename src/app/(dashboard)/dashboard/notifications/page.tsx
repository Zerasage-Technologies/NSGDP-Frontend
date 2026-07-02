"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockNotifications } from "@/lib/mock/notifications";
import type { PortalNotification, NotificationType } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { statusPill } from "@/lib/constants/status-surfaces";

const TYPE_LABEL: Record<NotificationType, string> = {
  dataset_published: "Publication",
  dataset_updated:   "Update",
  approval_request:  "Approval",
  revision_request:  "Revision",
  access_granted:    "Access",
  disease_alert:     "Alert",
  qa_flag:           "QA",
  sop_updated:       "SOP",
};

const TYPE_BADGE_CLASS: Record<NotificationType, string> = {
  dataset_published: statusPill.emerald,
  dataset_updated:   statusPill.blue,
  approval_request:  statusPill.amber,
  revision_request:  "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
  access_granted:    statusPill.teal,
  disease_alert:     "bg-destructive/10 text-destructive dark:bg-destructive/20",
  qa_flag:           "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300",
  sop_updated:       statusPill.purple,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<PortalNotification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const visible = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="size-6 text-primary" />
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </Button>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              <CheckCheck className="size-4 mr-1.5" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-muted-foreground gap-3">
          <Bell className="size-12 opacity-20" />
          <p className="font-medium">No {filter === "unread" ? "unread " : ""}notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((n) => (
            <Link
              key={n.id}
              href={n.link ?? "#"}
              onClick={() => markRead(n.id)}
              className={cn(
                "flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/40",
                !n.read && "bg-primary/5 border-primary/20"
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("text-xs font-medium rounded-full px-2 py-0.5", TYPE_BADGE_CLASS[n.type])}>
                    {TYPE_LABEL[n.type]}
                  </span>
                  {!n.read && (
                    <span className="size-2 rounded-full bg-primary" aria-label="Unread" />
                  )}
                </div>
                <p className={cn("text-sm", !n.read && "font-semibold")}>{n.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-xs text-muted-foreground/60 mt-1.5">
                  {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
