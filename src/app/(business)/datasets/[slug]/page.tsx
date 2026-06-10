import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Download, Calendar, FileText, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Container } from "@/components/layout/container";
import { VisibilityBadge } from "@/components/data/visibility-badge";
import { StatusBadge } from "@/components/data/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDatasetBySlug, getDatasets } from "@/lib/mock";

interface DatasetPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DatasetPage({ params }: DatasetPageProps) {
  const { slug } = await params;
  const dataset = await getDatasetBySlug(slug);

  if (!dataset) {
    notFound();
  }

  // Get related datasets (same group)
  const relatedResult = await getDatasets({
    groups: dataset.groups.length > 0 ? [dataset.groups[0].slug] : [],
    pageSize: 3,
  });
  const relatedDatasets = relatedResult.data.filter((d) => d.id !== dataset.id);

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
            <Link href="/datasets" className="hover:text-foreground">
              Datasets
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
                        <Button size="sm">
                          <Download className="size-4" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dataset Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Download className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">
                      {dataset.downloadCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Downloads</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {formatDistanceToNow(new Date(dataset.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">Last updated</p>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                      href={`/datasets/${related.slug}`}
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
