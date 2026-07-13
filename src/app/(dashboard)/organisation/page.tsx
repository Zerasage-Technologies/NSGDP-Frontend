"use client";

import { useEffect, useState } from "react";
import { Users, Database, UserPlus, Mail, CheckCircle, XCircle, Clock } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { getOrganisations } from "@/lib/mock";
import { toast } from "sonner";
import type { Organisation } from "@/types";

type AccessRequest = {
  id: string;
  userName: string;
  userEmail: string;
  requestedAt: Date;
  reason: string;
};

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: Date;
};

export default function MyOrganisationPage() {
  const { user } = useAuth();

  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Mock data
  const [accessRequests] = useState<AccessRequest[]>([
    {
      id: "1",
      userName: "John Doe",
      userEmail: "john.doe@example.com",
      requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      reason: "Need access to health data for research project on malaria prevention",
    },
    {
      id: "2",
      userName: "Jane Smith",
      userEmail: "jane.smith@example.com",
      requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      reason: "Policy analysis for Niger State government planning department",
    },
    {
      id: "3",
      userName: "Ahmed Ibrahim",
      userEmail: "ahmed.i@example.com",
      requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      reason: "Academic research on healthcare infrastructure distribution",
    },
  ]);

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: `${user?.firstName} ${user?.lastName}`,
      email: user?.email || "",
      role: "Administrator",
      joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      name: "Dr. Sarah Williams",
      email: "sarah.w@health.ng.gov",
      role: "Data Contributor",
      joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "m.chen@health.ng.gov",
      role: "Data Contributor",
      joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    },
  ]);

  useEffect(() => {
    const loadOrganisation = async () => {
      setLoading(true);
      const orgs = await getOrganisations();
      // Get first org for demo (in real app, would match user's org)
      setOrganisation(orgs[0] || null);
      setLoading(false);
    };

    loadOrganisation();
  }, []);

  const handleApprove = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Access request approved");
  };

  const handleDeny = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Access request denied");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Organisation profile updated");
    setSaving(false);
  };

  if (loading || !organisation) {
    return (
      <main className="flex-1 bg-muted/40">
        <Container className="py-12">
          <p className="text-center text-muted-foreground">Loading...</p>
        </Container>
      </main>
    );
  }

  // Only org admins and super admins can access
  if (user && user.role !== "admin" && user.role !== "super_admin") {
    return (
      <main className="flex-1 bg-muted/40">
        <Container className="py-12">
          <Card className="max-w-md mx-auto text-center p-8">
            <p className="text-muted-foreground">
              You don&apos;t have permission to access this page
            </p>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-muted/40">
      <div className="border-b bg-background">
        <Container size="wide" className="py-8">
          <div className="flex items-start gap-4">
            <div
              className="size-16 rounded-lg flex items-center justify-center text-2xl font-bold text-white shrink-0"
              style={{ backgroundColor: organisation.brandColor || "#3b82f6" }}
            >
              {organisation.acronym || organisation.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{organisation.name}</h1>
              <p className="mt-1 text-muted-foreground">{organisation.sector}</p>
            </div>
          </div>
        </Container>
      </div>

      <Container size="wide" className="py-8">
        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <Database className="size-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{organisation.datasetCount}</p>
                  <p className="text-sm text-muted-foreground">Datasets</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950">
                  <Users className="size-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{teamMembers.length}</p>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                  <Clock className="size-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{accessRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Organisation Profile</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="requests">
              Access Requests
              {accessRequests.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                  {accessRequests.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Edit Organisation Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Organisation Name
                      </label>
                      <Input defaultValue={organisation.name} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Acronym
                      </label>
                      <Input defaultValue={organisation.acronym} placeholder="e.g., MOH" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Sector
                    </label>
                    <Input defaultValue={organisation.sector} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Description
                    </label>
                    <Textarea
                      defaultValue={organisation.description}
                      rows={4}
                      placeholder="Describe your organisation..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Brand Color
                    </label>
                    <Input
                      type="color"
                      defaultValue={organisation.brandColor || "#3b82f6"}
                      className="h-12"
                    />
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                <Button size="sm">
                  <UserPlus className="size-4 mr-2" />
                  Invite Member
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="size-3" />
                            {member.email}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{member.role}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {member.joinedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Access Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {accessRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="size-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No pending access requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {accessRequests.map((request) => (
                      <div key={request.id} className="p-4 rounded-lg border">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium">{request.userName}</p>
                            <p className="text-sm text-muted-foreground">{request.userEmail}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {Math.floor(
                              (Date.now() - request.requestedAt.getTime()) / (24 * 60 * 60 * 1000)
                            )}{" "}
                            days ago
                          </span>
                        </div>
                        <p className="text-sm mb-4">{request.reason}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleApprove}
                          >
                            <CheckCircle className="size-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleDeny}
                          >
                            <XCircle className="size-4 mr-2" />
                            Deny
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </main>
  );
}
