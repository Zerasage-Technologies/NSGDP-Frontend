"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Users,
  Mail,
  Phone,
  Globe,
  MapPin,
  UserPlus,
  MoreVertical,
  RefreshCw,
  Ban,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { apiClient } from "@/lib/api/client";
import type { Organisation } from "@/lib/api/organisations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleBadge } from "@/components/ui/role-badge";
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

export default function OrganisationManagementPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const orgId = user?.organisationId;
  const orgName = user?.organisationName;

  // Fetch full organization details
  const { data: organisation, isLoading: orgLoading } = useQuery({
    queryKey: ['organisation', orgId],
    queryFn: async () => {
      if (!orgId) return null;
      const response = await apiClient.get<{ data: Organisation }>(`/organisations/${orgId}`);
      return response.data.data;
    },
    enabled: !!orgId,
  });

  // Fetch invites for this org - only if we have an orgId
  const { data: invites, isLoading: invitesLoading, error } = useOrganisationInvites(orgId || "");

  const revokeMutation = useRevokeInvite();
  const resendMutation = useResendInvite();

  // Log error for debugging (but don't show toast)
  if (error) {
    console.error("Failed to fetch invites:", error);
  }

  // Wait for auth to load
  if (authLoading) {
    return (
      <DashboardPage>
        <DashboardPageHeader
          title="Organization Management"
          description="Loading..."
        />
      </DashboardPage>
    );
  }

  // Role guard - only org admins
  if (!user || user.role !== "admin") {
    router.replace("/dashboard");
    return null;
  }

  // Check if user has an organisation
  if (!orgId) {
    return (
      <DashboardPage>
        <DashboardPageHeader
          title="Organization Management"
          description="You must belong to an organization to access this page"
        />
      </DashboardPage>
    );
  }

  const pendingInvites = invites?.filter((inv) => inv.status === "pending") || [];
  const acceptedInvites = invites?.filter((inv) => inv.status === "accepted") || [];
  const revokedInvites = invites?.filter((inv) => inv.status === "revoked") || [];

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
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-green-600">
            <CheckCircle2 className="h-3 w-3" />
            Accepted
          </Badge>
        );
      case "revoked":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Revoked
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Expired
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardPage>
      <DashboardPageHeader
        title={orgName || "Organization Management"}
        description="Manage your organization profile, team members, and invitations"
        actions={
          <Button onClick={() => setInviteModalOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        }
      />

      <DashboardPageContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              <Building2 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="h-4 w-4 mr-2" />
              Team Members
            </TabsTrigger>
            <TabsTrigger value="invites">
              <Mail className="h-4 w-4 mr-2" />
              Invitations ({pendingInvites.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>
                  View and manage your organization&apos;s profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {orgLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Organization Name
                        </label>
                        <p className="text-lg font-semibold">{organisation?.name || orgName || "—"}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Organization Type
                        </label>
                        <p className="text-lg capitalize">{organisation?.type || "—"}</p>
                      </div>
                    </div>

                    {organisation?.description && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Description
                        </label>
                        <p className="text-sm">{organisation.description}</p>
                      </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                      {organisation?.email && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </label>
                          <p className="text-sm">{organisation.email}</p>
                        </div>
                      )}
                      {organisation?.phone && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone
                          </label>
                          <p className="text-sm">{organisation.phone}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {organisation?.website && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Website
                          </label>
                          <a 
                            href={organisation.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {organisation.website}
                          </a>
                        </div>
                      )}
                      {organisation?.address && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Address
                          </label>
                          <p className="text-sm">{organisation.address}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        {organisation?.createdAt && (
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Created
                            </label>
                            <p className="text-sm">
                              {new Date(organisation.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        )}
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">
                            Status
                          </label>
                          <Badge variant={organisation?.isActive ? "default" : "secondary"}>
                            {organisation?.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Quick Stats</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{acceptedInvites.length}</div>
                        <p className="text-sm text-muted-foreground">Active Members</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{pendingInvites.length}</div>
                        <p className="text-sm text-muted-foreground">Pending Invites</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-sm text-muted-foreground">Datasets</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Members Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Team Members</CardTitle>
                <CardDescription>
                  Members who have accepted their invitations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {acceptedInvites.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-lg font-medium">No active members yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Invite team members to get started
                    </p>
                    <Button
                      onClick={() => setInviteModalOpen(true)}
                      className="mt-4"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite Member
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {acceptedInvites.map((invite) => (
                      <div
                        key={invite.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                            {invite.invitedEmail.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{invite.invitedEmail}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <RoleBadge role={invite.role} />
                              <span className="text-sm text-muted-foreground">
                                Joined {formatDistanceToNow(new Date(invite.acceptedAt!), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>
                  Invitations awaiting acceptance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {invitesLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : pendingInvites.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-lg font-medium">No pending invitations</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      All invitations have been accepted or revoked
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingInvites.map((invite) => (
                      <div
                        key={invite.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-medium">{invite.invitedEmail}</p>
                            {getStatusBadge(invite.status)}
                            <RoleBadge role={invite.role} />
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Invited by {invite.invitedByName}</p>
                            <p>Sent {formatDistanceToNow(new Date(invite.createdAt), { addSuffix: true })}</p>
                            <p>Expires {formatDistanceToNow(new Date(invite.expiresAt), { addSuffix: true })}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleResendInvite(invite)}
                              disabled={resendMutation.isPending}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Resend Invite
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRevokeInvite(invite)}
                              disabled={revokeMutation.isPending}
                              className="text-destructive"
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Revoke Invite
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {revokedInvites.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Revoked Invitations</CardTitle>
                  <CardDescription>
                    Previously revoked invitations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {revokedInvites.map((invite) => (
                      <div
                        key={invite.id}
                        className="flex items-center justify-between p-4 border rounded-lg opacity-60"
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-medium">{invite.invitedEmail}</p>
                            {getStatusBadge(invite.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Invited {formatDistanceToNow(new Date(invite.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
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
