"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FileText, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Container } from "@/components/layout/container";
import { VisibilityBadge } from "@/components/data/visibility-badge";
import { StatusBadge } from "@/components/data/status-badge";
import { DatasetDownloadActions } from "@/components/data/dataset-download-actions";
import { DatasetMapSection } from "@/components/data/dataset-map-section";
import { DatasetActivityPanel } from "@/components/data/dataset-activity-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataset, useDatasets } from "@/lib/hooks/useDatasets";
import { useCategories } from "@/lib/hooks/useCategories";
import { useOrganisations } from "@/lib/hooks/useOrganisations";
import { transformDataset } from "@/lib/adapters/dataset-adapter";
import { DatasetCardSkeleton } from "@/components/feedback/skeletons";
import type { PaginatedResponse } from "@/lib/types/common";
import type { Category } from "@/lib/api/categories";
import type { Organisation } from "@/lib/api/organisations";

interface DatasetPageProps {
  params: Promise<{ slug: string }>;
}

export default function DatasetPage({ params }: DatasetPageProps) {
  const { slug } = use(params);
  
  // Fetch dataset by slug (public endpoint - approved only)
  const { data: backendDataset, isLoading, error } = useDataset(slug);
  
  // Fetch reference data for transformation
  const { data: categoriesResponse } = useCategories() as { data?: PaginatedResponse<Category> };
  const { data: organisationsResponse } = useOrganisations(1, 100) as { data?: PaginatedResponse<Organisation> };
  
  // Transform backend dataset to frontend format
  const dataset = backendDataset
    ? transformDataset(backendDataset, categoriesResponse?.data ?? [], organisationsResponse?.data ?? [])
    : null;
  
  // Fetch related datasets (same category)
  const { data: relatedData } = useDatasets(
    dataset?.healthCategory && backendDataset?.category_id
      ? {
          categoryId: backendDataset.category_id,
          limit: 4,
          status: 'approved',
        }
      : undefined
  );
  
  const relatedDatasets = relatedData?.data
    ? relatedData.data
        .filter((d) => d.id !== dataset?.id)
        .slice(0, 3)
        .map((d) => transformDataset(d, categoriesResponse?.data ?? [], organisationsResponse?.data ?? []))
    : [];

  if (isLoading) {
    return (
      <main className="flex-1">
        <Container size="wide" className="py-8">
          <DatasetCardSkeleton />
        </Container>
      </main>
    );
  }

  if (error || !dataset) {
    notFound();
  }

  // Format file size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <main className="flex-1">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/40">
        <Container size="wide" className="py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="size-4" />
            <Link href="/dataportal" className="hover:text-foreground">
              Data Portal
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-foreground">{dataset.title}</span>
          </nav>
        </Container>
      </div>

      {/* Header */}
      <div className="border-b bg-background">
        <Container size="wide" className="py-8">
          <div className="flex items-start gap-4">
            {/* Organisation Logo */}
            {dataset.organisation.logoUrl ? (
              <Image
                src={dataset.organisation.logoUrl}
                alt=""
                width={64}
                height={64}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-lg bg-primary/10 text-primary text-2xl font-bold">
                {dataset.organisation.name.charAt(0)}
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{dataset.title}</h1>
                  <Link
                    href={`/organisations/${dataset.organisation.slug}`}
                    className="mt-2 inline-block text-sm text-muted-foreground hover:text-primary"
                  >
                    {dataset.organisation.name}
                  </Link>
                </div>
                <VisibilityBadge visibility={dataset.visibility} />
              </div>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatusBadge status={dataset.status} />
                {dataset.groups.map((group) => (
                  <Link key={group.id} href={`/groups/${group.slug}`}>
                    <Badge variant="secondary" className="hover:bg-secondary/80">
                      {group.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container size="wide" className="py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {dataset.description || "No description available."}
                </p>
              </CardContent>
            </Card>

            {/* Resources / Files */}
            {dataset.resources && dataset.resources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Data Files & Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {dataset.resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                            <FileText className="size-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{resource.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {resource.format} • {formatBytes(resource.sizeBytes)} •
                              Updated{" "}
                              {formatDistanceToNow(new Date(resource.updatedAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                        <DatasetDownloadActions
                          datasetId={dataset.id}
                          datasetSlug={dataset.slug}
                          datasetTitle={dataset.title}
                          visibility={dataset.visibility}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Spatial preview for geo datasets */}
            <DatasetMapSection
              formats={dataset.formats}
              lgaCoverage={dataset.lgaCoverage}
            />

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      File Formats
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {dataset.formats.map((format) => (
                        <Badge key={format} variant="outline">
                          {format}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      LGA Coverage
                    </p>
                    <p className="mt-1 text-sm">
                      {dataset.lgaCoverage.includes("All")
                        ? "All 25 LGAs"
                        : `${dataset.lgaCoverage.length} LGAs`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Download</CardTitle>
              </CardHeader>
              <CardContent>
                <DatasetDownloadActions
                  datasetId={dataset.id}
                  datasetSlug={dataset.slug}
                  datasetTitle={dataset.title}
                  visibility={dataset.visibility}
                />
              </CardContent>
            </Card>

            <DatasetActivityPanel />

            {/* Related Datasets */}
            {relatedDatasets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Related Datasets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {relatedDatasets.map((related) => (
                    <Link
                      key={related.id}
                      href={`/dataportal/${related.slug}`}
                      className="block group"
                    >
                      <p className="text-sm font-medium group-hover:text-primary line-clamp-2">
                        {related.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {related.organisation.name}
                      </p>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
