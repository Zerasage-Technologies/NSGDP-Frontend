"use client";

import { useState } from "react";
import { BookOpen, Plus, Upload, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSOPs } from "@/lib/mock/sops";
import type { SOP, SOPCategory } from "@/types";
import { statusPill } from "@/lib/constants/status-surfaces";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORY_STYLES: Record<SOPCategory, string> = {
  submission:  statusPill.blue,
  validation:  statusPill.purple,
  publication: statusPill.emerald,
  archival:    statusPill.gray,
  correction:  "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
};

const CATEGORY_LABELS: Record<SOPCategory, string> = {
  submission:  "Submission",
  validation:  "Validation",
  publication: "Publication",
  archival:    "Archival",
  correction:  "Correction",
};

export default function AdminSOPsPage() {
  const [sops, setSops] = useState<SOP[]>(mockSOPs);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Standard Operating Procedures</h2>
          <p className="text-muted-foreground mt-1">
            Official SOPs governing data submission, validation, publication, archival, and correction.
          </p>
        </div>
        <Button onClick={() => toast.success("New SOP form (mock)")}>
          <Plus className="size-4 mr-1.5" />
          New SOP
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sops.map((sop) => (
          <Card key={sop.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="size-5 text-primary" />
                </div>
                <Badge
                  variant="secondary"
                  className={cn("border-0 shrink-0 text-xs", CATEGORY_STYLES[sop.category])}
                >
                  {CATEGORY_LABELS[sop.category]}
                </Badge>
              </div>
              <CardTitle className="text-base mt-2 leading-snug">{sop.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col">
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                {sop.summary}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">v{sop.version}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  Effective {new Date(sop.effectiveDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </span>
                {sop.lastReviewed && (
                  <>
                    <span>·</span>
                    <span>Reviewed {new Date(sop.lastReviewed).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
                  </>
                )}
              </div>
              <div className="flex gap-2 mt-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => toast.success(`Downloading ${sop.title} (mock)`)}
                >
                  <Upload className="size-3.5 mr-1.5 rotate-180" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toast.success(`Editing ${sop.title} (mock)`)}
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
