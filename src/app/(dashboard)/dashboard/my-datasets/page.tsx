"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Database, Upload, Edit, Trash2, Eye, Search } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/data/status-badge";
import { VisibilityBadge } from "@/components/data/visibility-badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { getDatasets } from "@/lib/mock";
import type { Dataset, DatasetStatus } from "@/types";

const statusFilters: { value: DatasetStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "under_review", label: "Under Review" },
  { value: "draft", label: "Drafts" },
  { value: "needs_revision", label: "Needs Revision" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
];

export default function MyDatasetsPage() {
  const searchParams = useSearchParams();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DatasetStatus | "all">(
    (searchParams?.get("status") as DatasetStatus) || "all"
  );

  useEffect(() => {
    const loadDatasets = async () => {
      setLoading(true);
      
      // Mock user's datasets
      const result = await getDatasets({ pageSize: 50, includePrivate: true });
      setDatasets(result.data);
      setFilteredDatasets(result.data);
      
      setLoading(false);
    };

    loadDatasets();
  }, []);

  useEffect(() => {
    let filtered = datasets;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((d) => d.status === statusFilter);
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDatasets(filtered);
  }, [datasets, statusFilter, searchQuery]);

  // Count by status
  const statusCounts: Record<DatasetStatus | "all", number> = {
    all: datasets.length,
    published: datasets.filter((d) => d.status === "published").length,
    under_review: datasets.filter((d) => d.status === "under_review").length,
    draft: datasets.filter((d) => d.status === "draft").length,
    needs_revision: datasets.filter((d) => d.status === "needs_revision").length,
    rejected: datasets.filter((d) => d.status === "rejected").length,
    archived: datasets.filter((d) => d.status === "archived").length,
    submitted: datasets.filter((d) => d.status === "submitted").length,
  };

  return (
    <main className="flex-1 bg-muted/40">
      <div className="border-b bg-background">
        <Container size="wide" className="py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Datasets</h1>
              <p className="mt-2 text-muted-foreground">
                Manage your uploaded datasets and track their status
              </p>
            </div>
            <Link href="/dashboard/upload">
              <Button>
                <Upload className="size-4 mr-2" />
                Upload New Dataset
              </Button>
            </Link>
          </div>
        </Container>
      </div>

      <Container size="wide" className="py-8">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === filter.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted border"
              }`}
            >
              {filter.label}
              {statusCounts[filter.value] > 0 && (
                <span className="ml-2 opacity-75">({statusCounts[filter.value]})</span>
              )}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search my datasets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredDatasets.length === 0 ? (
          <EmptyState
            icon={Database}
            title={searchQuery ? "No datasets found" : "No datasets yet"}
            description={
              searchQuery
                ? "Try adjusting your search or filters"
                : "Upload your first dataset to get started"
            }
            action={
              searchQuery
                ? undefined
                : {
                    label: "Upload Dataset",
                    onClick: () => (window.location.href = "/dashboard/upload"),
                  }
            }
          />
        ) : (
          <>
            {/* Datasets Table */}
            <div className="rounded-lg border bg-background overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium">Dataset</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Visibility</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Downloads</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Last Updated</th>
                      <th className="px-6 py-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredDatasets.map((dataset) => (
                      <tr
                        key={dataset.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <Database className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <Link
                                href={`/datasets/${dataset.slug}`}
                                className="font-medium hover:text-primary transition-colors block mb-1"
                              >
                                {dataset.title}
                              </Link>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {dataset.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={dataset.status} />
                        </td>
                        <td className="px-6 py-4">
                          <VisibilityBadge visibility={dataset.visibility} />
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">
                            {dataset.downloadCount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">
                            {new Date(dataset.updatedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/datasets/${dataset.slug}`}>
                              <Button size="sm" variant="ghost">
                                <Eye className="size-4" />
                              </Button>
                            </Link>
                            <Link href={`/dashboard/edit/${dataset.slug}`}>
                              <Button size="sm" variant="ghost">
                                <Edit className="size-4" />
                              </Button>
                            </Link>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground text-center mt-6">
              Showing {filteredDatasets.length} of {datasets.length} datasets
            </p>
          </>
        )}
      </Container>
    </main>
  );
}
