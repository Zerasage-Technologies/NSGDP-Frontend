"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Mail, UserPlus, MoreVertical, RefreshCw, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { RoleBadge } from "@/components/data/role-badge";
import { InviteModal } from "@/components/shared/invite/invite-modal";
import { useOrganisationInvites, useRevokeInvite, useResendInvite } from "@/lib/hooks/useInvites";
import type { InviteResponse } from "@/lib/api/invites";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageContent,
} from "@/components/layout/dashboard-page-header";

export default function TeamPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const orgId = user?.organisationId;

  // Fetch invites for this org
  const { data: invites } = useOrganisationInvites(orgId || "");

  const revokeMutation = useRevokeInvite();
  const resendMutation = useResendInvite();

  // Role guard - only org admins
  if (!user || user.role !== "admin") {
    router.replace("/dashboard");
    return null;
  }

  const pendingInvites = invites?.filter((inv) => inv.status === "pending") || [];
  const acceptedInvites = invites?.filter((inv) => inv.status === "accepted") || [];

  const handleRevokeInvite = (invite: InviteResponse) => {
    if (!orgId) return;
    
    if (window.confirm(`Revoke invite for ${invite.invitedEmail}?`)) {
      revokeMutation.mutate(
        { organisationId: orgId, inviteId: invite.id },
        {
          onSuccess: () => {
            toast.success("Invite revoked successfully");
          },
          onError: () => {
            toast.error("Failed to revoke invite");
          },
        }
      );
    }
  };

  const handleResendInvite = (invite: InviteResponse) => {
    if (!orgId) return;

    resendMutation.mutate(
      { organisationId: orgId, inviteId: invite.id },
      {
        onSuccess: () => {
          toast.success("Invite resent successfully");
        },
        onError: () => {
          toast.error("Failed to resend invite");
        },
      }
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      accepted: "default",
      expired: "destructive",
      revoked: "destructive",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="Team Management"
        description="Manage your organisation's team members and invitations"
        actions={
          <Button onClick={() => setInviteModalOpen(true)}>
            <UserPlus className="size-4 mr-2" />
            Invite Team Member
          </Button>
        }
      />

      <DashboardPageContent>
        <div className="grid gap-6">
          {/* Team Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
                <Mail className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingInvites.length}</div>
                <p className="text-xs text-muted-foreground">Invitations awaiting acceptance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                <Users className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{acceptedInvites.length}</div>
                <p className="text-xs text-muted-foreground">Invites that have been accepted</p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Invites */}
          {pendingInvites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>Invites that haven&apos;t been accepted yet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingInvites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <Mail className="size-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium">{invite.invitedEmail}</p>
                          <p className="text-sm text-muted-foreground">
                            Invited {formatDistanceToNow(new Date(invite.createdAt))} ago by{" "}
                            {invite.invitedByName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <RoleBadge role={invite.role} />
                        {getStatusBadge(invite.status)}
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleResendInvite(invite)}>
                              <RefreshCw className="size-4 mr-2" />
                              Resend Invite
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRevokeInvite(invite)}
                              className="text-destructive"
                            >
                              <X className="size-4 mr-2" />
                              Revoke Invite
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardPageContent>

      {/* Invite Modal */}
      <InviteModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        organisationId={orgId}
      />
    </DashboardPage>
  );
}
