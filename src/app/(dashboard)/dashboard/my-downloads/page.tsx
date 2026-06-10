"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Calendar, FileText, Search } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/feedback/empty-state";
import { getDatasets } from "@/lib/mock";
import type { Dataset } from "@/types";

type DownloadHistory = {
  id: string;
  dataset: Dataset;
  downloadedAt: Date;
  fileCount: number;
};

export default function MyDownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadHistory[]>([]);
  const [filteredDownloads, setFilteredDownloads] = useState<DownloadHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadDownloads = async () => {
      setLoading(true);
      
      // Mock download history
      const result = await getDatasets({ pageSize: 12 });
      const mockHistory: DownloadHistory[] = result.data.map((dataset, index) => ({
        id: `download-${index}`,
        dataset,
        downloadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        fileCount: dataset.resources?.length || 0,
      }));

      setDownloads(mockHistory);
      setFilteredDownloads(mockHistory);
      setLoading(false);
    };

    loadDownloads();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = downloads.filter((item) =>
        item.dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dataset.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDownloads(filtered);
    } else {
      setFilteredDownloads(downloads);
    }
  }, [searchQuery, downloads]);

  return (
    <main className="flex-1 bg-muted/40">
      <div className="border-b bg-background">
        <Container size="wide" className="py-8">
          <h1 className="text-3xl font-bold">My Downloads</h1>
          <p className="mt-2 text-muted-foreground">
            View and re-download your dataset history
          </p>
        </Container>
      </div>

      <Container size="wide" className="py-8">
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

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredDownloads.length === 0 ? (
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
                    onClick: () => (window.location.href = "/datasets"),
                  }
            }
          />
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid gap-6 sm:grid-cols-3 mb-6">
              <Card className="p-6">
                <p className="text-3xl font-bold mb-1">{downloads.length}</p>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </Card>
              <Card className="p-6">
                <p className="text-3xl font-bold mb-1">
                  {downloads.reduce((sum, d) => sum + d.fileCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Files Downloaded</p>
              </Card>
              <Card className="p-6">
                <p className="text-3xl font-bold mb-1">
                  {downloads.filter(
                    (d) =>
                      new Date().getTime() - d.downloadedAt.getTime() <
                      7 * 24 * 60 * 60 * 1000
                  ).length}
                </p>
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
                      <th className="px-6 py-3 text-left text-sm font-medium">Files</th>
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
                                href={`/datasets/${item.dataset.slug}`}
                                className="font-medium hover:text-primary transition-colors block mb-1"
                              >
                                {item.dataset.title}
                              </Link>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {item.dataset.organisation.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">
                            {item.fileCount} {item.fileCount === 1 ? "file" : "files"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="size-4" />
                            {item.downloadedAt.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <Download className="size-4 mr-2" />
                              Re-download
                            </Button>
                            <Link href={`/datasets/${item.dataset.slug}`}>
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

            {/* Show count */}
            <p className="text-sm text-muted-foreground text-center mt-6">
              Showing {filteredDownloads.length} of {downloads.length} downloads
            </p>
          </>
        )}
      </Container>
    </main>
  );
}
