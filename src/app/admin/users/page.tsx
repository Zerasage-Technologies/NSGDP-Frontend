"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { getAdminUsers } from "@/lib/mock";
import { useMockSession } from "@/lib/auth/mock-session";
import type { AdminUser } from "@/types/admin";
import type { UserRole } from "@/types";
import { RoleBadge } from "@/components/data/role-badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableRowSkeleton } from "@/components/feedback/skeletons";
import { alertSurface } from "@/lib/constants/status-surfaces";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const GLOBAL_ADMIN_ROLES: UserRole[] = ["super_admin", "repo_admin", "ict_admin"];

export default function AdminUsersPage() {
  const { currentUser } = useMockSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleModal, setRoleModal] = useState<AdminUser | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("registered");

  const isOrgScoped = currentUser.role === "org_admin";
  const orgId = currentUser.organisationIds[0];

  useEffect(() => {
    getAdminUsers().then((data) => {
      setUsers(
        isOrgScoped && orgId
          ? data.filter((u) => u.organisationId === orgId)
          : data
      );
      setLoading(false);
    });
  }, [isOrgScoped, orgId]);

  const filtered = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    return true;
  });

  const exportCsv = () => {
    toast.success("CSV export started (mock download)");
  };

  const changeRole = () => {
    if (!roleModal) return;
    if (isOrgScoped && roleModal.organisationId !== orgId) {
      toast.error("You can only manage users within your organisation");
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === roleModal.id ? { ...u, role: newRole } : u))
    );
    toast.success(`Role updated for ${roleModal.fullName}`);
    setRoleModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">
            {isOrgScoped
              ? "Manage users within your organisation only"
              : `${users.length} platform users`}
          </p>
        </div>
        <Button variant="outline" onClick={exportCsv}>
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      {isOrgScoped && (
        <div className={cn("rounded-lg border px-4 py-3 text-sm", alertSurface.amber)}>
          Organisation-scoped view: you can only view and manage users belonging to your organisation.
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Select value={roleFilter} onValueChange={(v) => v && setRoleFilter(v)}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter by role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="registered">Registered</SelectItem>
            <SelectItem value="contributor">Contributor</SelectItem>
            <SelectItem value="custodian">Custodian</SelectItem>
            <SelectItem value="validator">Validator</SelectItem>
            <SelectItem value="org_admin">Org Admin</SelectItem>
            <SelectItem value="repo_admin">Repo Admin</SelectItem>
            <SelectItem value="ict_admin">ICT Admin</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Organisation</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last Login</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(5)].map((_, i) => <TableRowSkeleton key={i} cols={7} />)
              : filtered.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{u.fullName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.organisationName ?? "—"}</td>
                    <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-4 py-3 capitalize">{u.status}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(u.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isOrgScoped && u.organisationId !== orgId}
                        onClick={() => { setRoleModal(u); setNewRole(u.role); }}
                      >
                        Change Role
                      </Button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!roleModal} onOpenChange={(o) => !o && setRoleModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role — {roleModal?.fullName}</DialogTitle>
          </DialogHeader>
          <Select value={newRole} onValueChange={(v) => v && setNewRole(v as UserRole)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(["registered", "contributor", "custodian", "validator", "org_admin"] as UserRole[])
                .concat(isOrgScoped ? [] : (["repo_admin", "ict_admin", "super_admin"] as UserRole[]))
                .map((r) => (
                  <SelectItem key={r} value={r}>{r.replace(/_/g, " ")}</SelectItem>
                ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleModal(null)}>Cancel</Button>
            <Button onClick={changeRole}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
