import Link from "next/link";
import { Download, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Dataset } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VisibilityBadge } from "./visibility-badge";
import { cn } from "@/lib/utils";

interface DatasetCardProps {
  dataset: Dataset;
  className?: string;
}

export function DatasetCard({ dataset, className }: DatasetCardProps) {
  return (
    <Link href={`/datasets/${dataset.slug}`}>
      <Card
        className={cn(
          "group relative transition-all hover:shadow-md hover:border-primary/50",
          className
        )}
      >
        {/* Visibility Badge (top-right) */}
        <div className="absolute right-3 top-3">
          <VisibilityBadge visibility={dataset.visibility} />
        </div>

        <CardHeader>
          {/* Organisation */}
          <div className="flex items-center gap-2 mb-2">
            {dataset.organisation.logoUrl ? (
              <img
                src={dataset.organisation.logoUrl}
                alt=""
                className="size-6 rounded object-cover"
              />
            ) : (
              <div className="flex size-6 items-center justify-center rounded bg-primary/10 text-primary text-xs font-semibold">
                {dataset.organisation.name.charAt(0)}
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              {dataset.organisation.name}
            </span>
          </div>

          <CardTitle className="line-clamp-2 pr-8">{dataset.title}</CardTitle>
          
          {dataset.description && (
            <CardDescription className="line-clamp-2">
              {dataset.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Groups (max 3) */}
          {dataset.groups.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {dataset.groups.slice(0, 3).map((group) => (
                <Badge key={group.id} variant="secondary" className="text-xs">
                  {group.name}
                </Badge>
              ))}
              {dataset.groups.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{dataset.groups.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Formats */}
          {dataset.formats.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {dataset.formats.map((format) => (
                <Badge key={format} variant="outline" className="text-xs font-mono">
                  {format}
                </Badge>
              ))}
            </div>
          )}

          {/* Metadata Footer */}
          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="size-3" />
              <span>
                {formatDistanceToNow(new Date(dataset.updatedAt), { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center gap-1 font-medium">
              <Download className="size-3" />
              <span>{dataset.downloadCount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
