"use client";

import { useState } from "react";
import { PermissionDelegationPanel } from "@/components/admin/permission-delegation-panel";
import { PermissionMatrix } from "@/components/admin/permission-matrix";
import { UserGroupForm } from "@/components/admin/user-group-form";
import { mockUserGroups } from "@/lib/mock/permissions";
import type { UserGroup } from "@/types/permissions";

export default function AdminPermissionsPage() {
  const [groups, setGroups] = useState<UserGroup[]>(mockUserGroups);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [tab, setTab] = useState<"delegation" | "matrix">("delegation");

  const handleCreateGroup = (group: UserGroup) => {
    setGroups((prev) => [...prev, group]);
    setShowGroupForm(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Permission Management</h1>
        <p className="mt-1 text-muted-foreground">
          Delegate atomic permissions to user groups and review the full role-permission matrix.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border bg-muted/30 p-1 w-fit">
        {(["delegation", "matrix"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={
              tab === t
                ? "rounded-md bg-background px-4 py-1.5 text-sm font-medium shadow-sm"
                : "rounded-md px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            }
          >
            {t === "delegation" ? "Group Delegation" : "Permission Matrix"}
          </button>
        ))}
      </div>

      {tab === "delegation" ? (
        <>
          {showGroupForm && (
            <UserGroupForm
              onSave={handleCreateGroup}
              onCancel={() => setShowGroupForm(false)}
            />
          )}
          <PermissionDelegationPanel
            groups={groups}
            onGroupsChange={setGroups}
            onCreateGroup={() => setShowGroupForm(true)}
          />
        </>
      ) : (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Role Permission Matrix</h2>
            <p className="text-sm text-muted-foreground">
              Base permissions for each role. Super Admin may delegate starred (⭐) permissions to user groups.
            </p>
          </div>
          <PermissionMatrix />
        </div>
      )}
    </div>
  );
}
