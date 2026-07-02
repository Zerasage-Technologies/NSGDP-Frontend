"use client";

import { useState } from "react";
import { Plus, Users, Shield, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserGroupForm } from "@/components/admin/user-group-form";
import { mockUserGroups } from "@/lib/mock/permissions";
import { PERMISSION_ACTION_LABELS } from "@/types/permissions";
import type { UserGroup } from "@/types/permissions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminUserGroupsPage() {
  const [groups, setGroups] = useState<UserGroup[]>(mockUserGroups);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<UserGroup | null>(null);

  const handleCreate = (group: UserGroup) => {
    setGroups((prev) => [...prev, group]);
    setCreating(false);
    toast.success(`Group "${group.name}" created`);
  };

  const handleEdit = (group: UserGroup) => {
    setGroups((prev) => prev.map((g) => (g.id === group.id ? group : g)));
    setEditing(null);
    toast.success(`Group "${group.name}" updated`);
  };

  const handleDelete = (id: string) => {
    const group = groups.find((g) => g.id === id);
    setGroups((prev) => prev.filter((g) => g.id !== id));
    toast.success(`Group "${group?.name}" deleted`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Groups</h1>
          <p className="mt-1 text-muted-foreground">
            Organise users into groups and assign delegated permissions collectively.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4 mr-1.5" />
          New Group
        </Button>
      </div>

      {creating && (
        <UserGroupForm
          onSave={handleCreate}
          onCancel={() => setCreating(false)}
        />
      )}

      {editing && (
        <UserGroupForm
          initial={editing}
          onSave={handleEdit}
          onCancel={() => setEditing(null)}
        />
      )}

      {groups.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Users className="size-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="font-medium">No user groups yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create a group to start delegating permissions.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {groups.map((group) => (
            <Card
              key={group.id}
              className={cn(
                "relative transition-shadow hover:shadow-md",
                editing?.id === group.id && "ring-1 ring-primary/20"
              )}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Shield className="size-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{group.name}</h3>
                      {group.description && (
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                          {group.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      onClick={() => setEditing(group)}
                      aria-label={`Edit ${group.name}`}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(group.id)}
                      aria-label={`Delete ${group.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {group.memberIds.length} member{group.memberIds.length !== 1 ? "s" : ""} ·{" "}
                    {group.delegatedPermissions.length} permission{group.delegatedPermissions.length !== 1 ? "s" : ""}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {group.delegatedPermissions.length > 0 ? (
                      group.delegatedPermissions.map((a) => (
                        <Badge key={a} variant="secondary" className="text-xs">
                          {PERMISSION_ACTION_LABELS[a]}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No delegated permissions</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
