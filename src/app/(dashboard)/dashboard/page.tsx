"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Database,
  Download,
  Upload,
  Users,
  Bell,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { StatusBadge } from "@/components/data/status-badge";
import { DatasetActivityPanel } from "@/components/data/dataset-activity-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMockSession } from "@/lib/auth/mock-session";
import { getDatasets, getOverdueDatasets } from "@/lib/mock";
import { OutbreakAlertBanner } from "@/components/home/outbreak-alert-banner";
import { mockAlerts } from "@/lib/mock/alerts";
import { alertSurface } from "@/lib/constants/status-surfaces";
import { cn } from "@/lib/utils";
import type { Dataset } from "@/types";

export default function DashboardPage() {
  const { currentUser } = useMockSession();
  const [myDatasets, setMyDatasets] = useState<Dataset[]>([]);
  const [recentDownloads, setRecentDownloads] = useState<Dataset[]>([]);
  const [overdueDatasets, setOverdueDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Get datasets for contributors and org admins
      if (["contributor", "admin", "super_admin"].includes(currentUser.role)) {
        const result = await getDatasets({ pageSize: 6, includePrivate: true });
        setMyDatasets(result.data.slice(0, 6));
      }

      // Get recent downloads for all authenticated users
      const downloads = await getDatasets({ pageSize: 4 });
      setRecentDownloads(downloads.data.slice(0, 4));

      if (["contributor", "admin", "super_admin", "admin"].includes(currentUser.role)) {
        const overdue = await getOverdueDatasets();
        setOverdueDatasets(overdue);
      }

      setLoading(false);
    };

    loadData();
  }, [currentUser.role]);

  return (
    <main className="flex-1 bg-muted/40">
      <div className="border-b bg-background">
        <Container size="wide" className="py-8">
          <h1 className="text-3xl font-bold">Welcome back, {currentUser.fullName}!</h1>
          <p className="mt-2 text-muted-foreground">
            {currentUser.role === "registered" && "Browse datasets and track your downloads"}
            {currentUser.role === "contributor" && "Manage your datasets and contributions"}
            {currentUser.role === "admin" && "Manage your organization and datasets"}
            {currentUser.role === "super_admin" && "System overview and administration"}
          </p>
        </Container>
      </div>

      <Container size="wide" className="py-8">
        <OutbreakAlertBanner alerts={mockAlerts} />

        {overdueDatasets.length > 0 && (
          <div className={cn("mb-6 rounded-lg border px-4 py-3 text-sm", alertSurface.amber)}>
            <p className="font-semibold flex items-center gap-2">
              <AlertCircle className="size-4" />
              {overdueDatasets.length} dataset{overdueDatasets.length > 1 ? "s" : ""} overdue for update
            </p>
            <ul className="mt-2 space-y-1 text-xs">
              {overdueDatasets.slice(0, 3).map((d) => (
                <li key={d.id}>· {d.title} — last updated {new Date(d.updatedAt).toLocaleDateString()}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-muted animate-pulse mb-4" />
                  <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
          {/* All Users */}
          <StatsCard
            icon={Download}
            label="My Downloads"
            value="23"
            trend="+3 this week"
            iconColor="text-blue-600"
            bgColor="bg-blue-50 dark:bg-blue-950"
          />

          {/* Contributors+ */}
          {["contributor", "admin", "super_admin"].includes(currentUser.role) && (
            <>
              <StatsCard
                icon={Database}
                label="My Datasets"
                value="8"
                trend="2 pending review"
                iconColor="text-green-600"
                bgColor="bg-green-50 dark:bg-green-950"
              />
              <StatsCard
                icon={TrendingUp}
                label="Total Downloads"
                value="1,284"
                trend="+124 this month"
                iconColor="text-purple-600"
                bgColor="bg-purple-50 dark:bg-purple-950"
              />
            </>
          )}

          {/* Org Admin+ */}
          {["admin", "super_admin"].includes(currentUser.role) && (
            <StatsCard
              icon={Users}
              label="Team Members"
              value="12"
              trend="3 pending approvals"
              iconColor="text-orange-600"
              bgColor="bg-orange-50 dark:bg-orange-950"
            />
          )}

          {/* Super Admin */}
          {currentUser.role === "super_admin" && (
            <StatsCard
              icon={FileText}
              label="Review Queue"
              value="15"
              trend="4 aging items"
              iconColor="text-red-600"
              bgColor="bg-red-50 dark:bg-red-950"
            />
          )}
            </>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Datasets (Contributors+) */}
            {["contributor", "admin", "super_admin"].includes(currentUser.role) && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>My Datasets</CardTitle>
                  <Button size="sm">
                    <Upload className="size-4 mr-2" />
                    Upload New
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
                      ))}
                    </div>
                  ) : myDatasets.length > 0 ? (
                    <div className="space-y-4">
                      {myDatasets.map((dataset) => (
                        <div key={dataset.id} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                          <Database className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-1">
                              <Link
                                href={`/dataportal/${dataset.slug}`}
                                className="font-medium hover:text-primary transition-colors"
                              >
                                {dataset.title}
                              </Link>
                              <StatusBadge status={dataset.status} />
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {dataset.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>{dataset.resources?.length || 0} resources</span>
                              <span>{dataset.downloadCount} downloads</span>
                              <span>Updated {new Date(dataset.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Link href="/dashboard/my-datasets">
                        <Button variant="outline" className="w-full">
                          View All My Datasets
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Database className="size-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">You haven&apos;t uploaded any datasets yet</p>
                      <Button>
                        <Upload className="size-4 mr-2" />
                        Upload Your First Dataset
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recent Downloads */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : recentDownloads.length > 0 ? (
                  <div className="space-y-4">
                    {recentDownloads.map((dataset) => (
                      <div key={dataset.id} className="flex items-start gap-4 p-4 rounded-lg border">
                        <Download className="size-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/dataportal/${dataset.slug}`}
                            className="font-medium hover:text-primary transition-colors block mb-1"
                          >
                            {dataset.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            Downloaded 2 days ago • {dataset.resources?.length || 0} files
                          </p>
                        </div>
                      </div>
                    ))}
                    <Link href="/dashboard/my-downloads">
                      <Button variant="outline" className="w-full">
                        View All Downloads
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Download className="size-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No downloads yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Pending Actions */}
            {["contributor", "admin", "super_admin"].includes(currentUser.role) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pending Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ActionItem
                    icon={AlertCircle}
                    text="2 datasets awaiting review"
                    color="text-orange-600"
                    href="/dashboard/my-datasets?status=pending"
                  />
                  {currentUser.role !== "contributor" && (
                    <ActionItem
                      icon={Users}
                      text="3 access requests pending"
                      color="text-blue-600"
                      href="/dashboard/organisation"
                    />
                  )}
                  <ActionItem
                    icon={CheckCircle2}
                    text="Complete your profile"
                    color="text-green-600"
                    href="/dashboard/profile"
                  />
                </CardContent>
              </Card>
            )}

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Notifications
                  <Bell className="size-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <NotificationItem
                  text="Your dataset 'Health Facilities' was approved"
                  time="2 hours ago"
                />
                <NotificationItem
                  text="New comment on 'Population Data 2024'"
                  time="1 day ago"
                />
                <NotificationItem
                  text="Access granted to 'Education Statistics'"
                  time="3 days ago"
                />
                <Button variant="ghost" size="sm" className="w-full">
                  View All Notifications
                </Button>
              </CardContent>
            </Card>

            {/* Portal Activity */}
            {["contributor", "admin", "super_admin"].includes(currentUser.role) && (
              <DatasetActivityPanel />
            )}

            {/* My Organizations (Org Admin+) */}
            {["admin", "super_admin"].includes(currentUser.role) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">My Organizations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link
                    href="/dashboard/organisation"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      MH
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">Ministry of Health</p>
                      <p className="text-xs text-muted-foreground">15 datasets</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}

// Helper Components
function StatsCard({
  icon: Icon,
  label,
  value,
  trend,
  iconColor,
  bgColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  iconColor: string;
  bgColor: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`size-6 ${iconColor}`} />
          </div>
        </div>
        <p className="text-2xl font-bold mb-1">{value}</p>
        <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
        <p className="text-xs text-muted-foreground">{trend}</p>
      </CardContent>
    </Card>
  );
}

function ActionItem({
  icon: Icon,
  text,
  color,
  href,
}: {
  icon: React.ElementType;
  text: string;
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <Icon className={`size-5 shrink-0 mt-0.5 ${color}`} />
      <p className="text-sm flex-1">{text}</p>
    </Link>
  );
}

function NotificationItem({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border">
      <Clock className="size-4 text-muted-foreground shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm mb-1">{text}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}
