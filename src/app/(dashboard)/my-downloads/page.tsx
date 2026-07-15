"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Calendar, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/feedback/empty-state";
import { useDownloadHistory } from "@/lib/hooks/useDownloadHistory";
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageContent,
} from "@/components/layout/dashboard-page-header";

export default function MyDownloadsPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: downloadHistory, isLoading } = useDownloadHistory(page, 20);

  const filteredDownloads = downloadHistory?.data.filter((item) =>
    searchQuery
      ? item.dataset.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const totalDownloads = downloadHistory?.meta.total || 0;
  const thisWeekCount = downloadHistory?.data.filter(
    (d) =>
      new Date().getTime() - new Date(d.downloadedAt).getTime() <
      7 * 24 * 60 * 60 * 1000
  ).length || 0;

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="My Downloads"
        description="View and re-download your dataset history"
      />

      <DashboardPageContent>
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search downloads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : !filteredDownloads || filteredDownloads.length === 0 ? (
          <EmptyState
            icon={Download}
            title={searchQuery ? "No downloads found" : "No downloads yet"}
            description={
              searchQuery
                ? "Try adjusting your search terms"
                : "Datasets you download will appear here for easy re-access"
            }
            action={
              searchQuery
                ? undefined
                : {
                    label: "Browse Datasets",
                    onClick: () => (window.location.href = "/dataportal"),
                  }
            }
          />
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid gap-6 sm:grid-cols-3 mb-6">
              <Card className="p-6">
                <p className="text-3xl font-bold mb-1">{totalDownloads}</p>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </Card>
              <Card className="p-6">
                <p className="text-3xl font-bold mb-1">
                  {downloadHistory?.data.length || 0}
                </p>
                <p className="text-sm text-muted-foreground">On This Page</p>
              </Card>
              <Card className="p-6">
                <p className="text-3xl font-bold mb-1">{thisWeekCount}</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </Card>
            </div>

            {/* Download History Table */}
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium">Dataset</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Format</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Downloaded</th>
                      <th className="px-6 py-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredDownloads.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <FileText className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <Link
                                href={`/dataportal/${item.dataset.slug}`}
                                className="font-medium hover:text-primary transition-colors block mb-1"
                              >
                                {item.dataset.title}
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                Version {item.dataset.version}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {item.dataset.format.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="size-4" />
                            {new Date(item.downloadedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/dataportal/${item.dataset.slug}`}>
                              <Button size="sm" variant="outline">
                                <Download className="size-4 mr-2" />
                                Re-download
                              </Button>
                            </Link>
                            <Link href={`/dataportal/${item.dataset.slug}`}>
                              <Button size="sm" variant="ghost">
                                View Dataset
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Pagination */}
            {downloadHistory && downloadHistory.meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {downloadHistory.meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(downloadHistory.meta.totalPages, p + 1))}
                  disabled={page === downloadHistory.meta.totalPages}
                >
                  Next
                </Button>
              </div>
            )}

            {/* Show count */}
            <p className="text-sm text-muted-foreground text-center mt-6">
              Showing {filteredDownloads.length} of {totalDownloads} downloads
            </p>
          </>
        )}
      </DashboardPageContent>
    </DashboardPage>
  );
}
