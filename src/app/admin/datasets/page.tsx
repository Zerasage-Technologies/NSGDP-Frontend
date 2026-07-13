"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Archive } from "lucide-react";
import { getReviewQueue, archiveDataset } from "@/lib/mock";
import { useAuth } from "@/lib/auth";
import type { Dataset, DatasetStatus } from "@/types";
import { AgeBadge } from "@/components/data/age-badge";
import { StatusBadge } from "@/components/data/status-badge";
import { LifecycleBadge } from "@/components/data/lifecycle-badge";
import { FreshnessIndicator } from "@/components/data/freshness-indicator";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TableRowSkeleton } from "@/components/feedback/skeletons";
import { EmptyState } from "@/components/feedback/empty-state";
import { FileCheck } from "lucide-react";
import { toast } from "sonner";

const TABS: Array<{ key: DatasetStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "submitted", label: "Submitted" },
  { key: "under_review", label: "Under Review" },
  { key: "needs_revision", label: "Needs Revision" },
  { key: "published", label: "Published" },
  { key: "archived", label: "Archived" },
];

export default function AdminReviewQueuePage() {
  const { user } = useAuth();

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<DatasetStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    getReviewQueue({ status: tab, query }).then((data) => {
      setDatasets(data);
      setLoading(false);
    });
  }, [tab, query]);

  const handleArchive = (d: Dataset) => {
    if (!user) return;
    archiveDataset(d.id, {
      archivedAt: new Date().toISOString(),
      archivedBy: `${user.firstName} ${user.lastName}`,
      reason: "Archived from review queue",
    });
    setDatasets((prev) => prev.map((x) => x.id === d.id ? { ...x, status: "archived" as const, lifecycleStage: "archived" } : x));
    toast.success(`"${d.title}" archived`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Review Queue</h1>
        <p className="text-muted-foreground mt-1">Manage dataset submissions through the approval pipeline</p>
      </div>

      <div className="flex flex-wrap gap-2">
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

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search datasets…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="px-4 py-3 w-10">
                <input type="checkbox" aria-label="Select all" className="rounded" />
              </th>
              <th className="px-4 py-3 font-medium">Dataset Title</th>
              <th className="px-4 py-3 font-medium">Organisation</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Freshness</th>
              <th className="px-4 py-3 font-medium">Age</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => <TableRowSkeleton key={i} cols={8} />)
            ) : datasets.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8">
                  <EmptyState icon={FileCheck} title="Queue is empty" description="No datasets match your filters" />
                </td>
              </tr>
            ) : (
              datasets.map((d) => (
                <tr key={d.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(d.id)}
                      onChange={(e) => {
                        const next = new Set(selected);
                        if (e.target.checked) next.add(d.id);
                        else next.delete(d.id);
                        setSelected(next);
                      }}
                      aria-label={`Select ${d.title}`}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium max-w-xs">
                    <span className="line-clamp-1">{d.title}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{d.organisation.name}</td>
                  <td className="px-4 py-3">
                    {d.lifecycleStage ? (
                      <LifecycleBadge stage={d.lifecycleStage} />
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <FreshnessIndicator
                      lastUpdated={d.updatedAt}
                      updateFrequency={d.updateFrequency}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <AgeBadge submittedAt={d.updatedAt} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Link
                        href={`/admin/datasets/${d.id}/review`}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        Review
                      </Link>
                      {d.status === "published" && (
                        <Link
                          href={`/admin/datasets/${d.id}/approve`}
                          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                        >
                          Approve
                        </Link>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleArchive(d)}
                        aria-label={`Archive ${d.title}`}
                      >
                        <Archive className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
