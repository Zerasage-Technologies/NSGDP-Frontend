"use client";

import { useEffect, useState } from "react";
import { getAccessRequests } from "@/lib/mock";
import type { AccessRequest } from "@/types/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableRowSkeleton } from "@/components/feedback/skeletons";
import { toast } from "sonner";

export default function AdminAccessRequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<{ req: AccessRequest; action: "approve" | "deny" } | null>(null);

  useEffect(() => {
    getAccessRequests().then((data) => {
      setRequests(data);
      setLoading(false);
    });
  }, []);

  const applyAction = () => {
    if (!confirm) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === confirm.req.id
          ? { ...r, status: confirm.action === "approve" ? "approved" : "denied" }
          : r
      )
    );
    toast.success(
      confirm.action === "approve"
        ? `Access granted to ${confirm.req.userName}`
        : `Access denied for ${confirm.req.datasetTitle}`
    );
    setConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Access Requests</h1>
        <p className="text-muted-foreground mt-1">Review restricted dataset access requests</p>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Dataset</th>
              <th className="px-4 py-3 font-medium">Reason</th>
              <th className="px-4 py-3 font-medium">Requested</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(3)].map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              : requests.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="px-4 py-3">
                      <p className="font-medium">{r.userName}</p>
                      <p className="text-xs text-muted-foreground">{r.userEmail}</p>
                    </td>
                    <td className="px-4 py-3">{r.datasetTitle}</td>
                    <td className="px-4 py-3 max-w-xs truncate text-muted-foreground">{r.reason}</td>
                    <td className="px-4 py-3">{new Date(r.requestedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 capitalize">{r.status}</td>
                    <td className="px-4 py-3">
                      {r.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => setConfirm({ req: r, action: "approve" })}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => setConfirm({ req: r, action: "deny" })}>Deny</Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!confirm} onOpenChange={() => setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirm?.action === "approve" ? "Approve Access" : "Deny Access"}
            </DialogTitle>
            <DialogDescription>
              {confirm?.req.userName} — {confirm?.req.datasetTitle}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(null)}>Cancel</Button>
            <Button
              variant={confirm?.action === "deny" ? "destructive" : "default"}
              onClick={applyAction}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
