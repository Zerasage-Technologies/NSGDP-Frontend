"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Eye, Globe, ClipboardCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/data/status-badge";
import { VisibilityBadge } from "@/components/data/visibility-badge";
import { AgeBadge } from "@/components/data/age-badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { useReviewQueue, usePublishDataset } from "@/lib/hooks/useReviewQueue";
import { useOrganisations } from "@/lib/hooks/useOrganisations";
import { useRequireAccess } from "@/lib/hooks/useRequireAccess";
import { formatDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils";
import type { DatasetStatus } from "@/types";

const TABS: Array<{ key: DatasetStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "under_review", label: "Under Review" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function ReviewQueuePage() {
  const { allowed, isLoading: isAccessLoading } = useRequireAccess(
    ["admin", "super_admin"],
    ["approve:datasets", "publish:datasets"]
  );
  const [tab, setTab] = useState<DatasetStatus | "all">("all");
  const [query, setQuery] = useState("");

  const { data: datasets, isLoading } = useReviewQueue(tab, { search: query || undefined });
  const { data: organisationsData } = useOrganisations(1, 100);
  const publishMutation = usePublishDataset();

  if (isAccessLoading || !allowed) {
    return null;
  }

  const items = datasets ?? [];

  return (
    <main className="flex-1 bg-muted/40">
      <div className="border-b bg-background">
        <Container size="wide" className="py-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ClipboardCheck className="size-7" />
            Review Queue
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage dataset submissions through the approval pipeline
          </p>
        </Container>
      </div>

      <Container size="wide" className="py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((t) => (
            <Button
              key={t.key}
              variant={tab === t.key ? "default" : "outline"}
              size="sm"
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </Button>
          ))}
        </div>

        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search datasets…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title="Queue is empty"
            description="No datasets match your filters"
          />
        ) : (
          <div className="rounded-lg border bg-background overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Dataset Title</th>
                    <th className="px-4 py-3 font-medium">Organisation</th>
                    <th className="px-4 py-3 font-medium">Visibility</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Age</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((dataset) => {
                    const org = organisationsData?.data?.find((o) => o.id === dataset.organisation_id);
                    const needsReview = dataset.status === "pending" || dataset.status === "under_review";
                    return (
                      <tr key={dataset.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium max-w-xs">
                          <span className="line-clamp-1">{dataset.title}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{org ? org.name : "Unknown"}</td>
                        <td className="px-4 py-3">
                          <VisibilityBadge visibility={dataset.visibility} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={dataset.status} publishedAt={dataset.published_at} />
                        </td>
                        <td className="px-4 py-3">
                          {needsReview ? (
                            <AgeBadge submittedAt={dataset.submitted_at || dataset.created_at} />
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              {formatDate(dataset.submitted_at || dataset.created_at)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Link
                              href={`/review-queue/${dataset.slug}`}
                              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                            >
                              <Eye className="size-3.5 mr-1" />
                              {needsReview ? "Review" : "View"}
                            </Link>
                            {dataset.status === "approved" && !dataset.published_at && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => publishMutation.mutate(dataset.slug)}
                                disabled={publishMutation.isPending}
                                aria-label={`Publish ${dataset.title}`}
                              >
                                <Globe className="size-3.5 mr-1" />
                                Publish
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {items.length > 0 && (
          <p className="text-sm text-muted-foreground text-center mt-6">
            {items.length} dataset{items.length !== 1 ? "s" : ""}
          </p>
        )}
      </Container>
    </main>
  );
}
