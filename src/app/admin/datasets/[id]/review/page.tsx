"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { getDatasetBySlug } from "@/lib/mock";
import { mockDatasets } from "@/lib/mock/datasets";
import type { Dataset } from "@/types";
import { QAChecklistItem } from "@/components/data/qa-checklist-item";
import { StatusBadge } from "@/components/data/status-badge";
import { VisibilityBadge } from "@/components/data/visibility-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const QA_ITEMS = [
  { id: "metadata", label: "Metadata is complete and accurate", note: "Title, description, tags, LGA coverage" },
  { id: "format", label: "File format is valid and readable", note: "No corruption, correct MIME type" },
  { id: "license", label: "License and visibility are appropriate", note: "Matches data sensitivity" },
  { id: "quality", label: "Data quality meets minimum standards", note: "No obvious errors or missing values" },
  { id: "geo", label: "Geospatial data uses correct CRS (EPSG:4326)", note: "If applicable" },
];

export default function AdminReviewSinglePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [comment, setComment] = useState("");
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    const found = mockDatasets.find((d) => d.id === id);
    if (found) {
      setDataset(found);
    } else {
      getDatasetBySlug(id).then(setDataset);
    }
    setLoading(false);
  }, [id]);

  const contributorName = "Ibrahim Suleiman";
  const allChecked = QA_ITEMS.every((item) => checklist[item.id]);
  const canReject = comment.trim().length >= 20;

  const handleAction = (action: "approve" | "revise" | "reject") => {
    if (action === "approve") {
      setConfirmAction("approve");
      return;
    }
    if (action === "reject") {
      if (!canReject) return;
      setConfirmAction("reject");
      return;
    }
    if (action === "revise") {
      if (comment.trim().length < 10) {
        toast.error("Please provide a revision comment.");
        return;
      }
      toast.success(`Revision requested. Comment will be emailed to ${contributorName}.`);
      router.push("/admin/datasets");
    }
  };

  const confirm = () => {
    if (confirmAction === "approve") {
      toast.success(`"${dataset?.title}" approved and published.`);
    } else {
      toast.success(`"${dataset?.title}" rejected. Contributor notified.`);
    }
    setConfirmAction(null);
    router.push("/admin/datasets");
  };

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!dataset) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Dataset not found</p>
        <Link href="/admin/datasets" className={cn(buttonVariants({ variant: "link" }), "mt-4 inline-block")}>
          Back to queue
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/datasets" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "inline-flex")}>
        <ChevronLeft className="size-4" />
        Back to queue
      </Link>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: metadata 60% */}
        <div className="lg:col-span-3 space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{dataset.title}</h1>
            <p className="text-muted-foreground mt-1">{dataset.organisation.name}</p>
            <div className="flex gap-2 mt-3">
              <StatusBadge status={dataset.status} />
              <VisibilityBadge visibility={dataset.visibility} />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{dataset.description}</p>
            </CardContent>
          </Card>

          {dataset.resources && dataset.resources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resource Files</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {dataset.resources.map((r) => (
                    <li key={r.id} className="flex justify-between border-b pb-2 last:border-0">
                      <span>{r.name}</span>
                      <span className="text-muted-foreground">{r.format}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Formats</p>
                <p>{dataset.formats.join(", ")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">LGA Coverage</p>
                <p>{dataset.lgaCoverage.join(", ")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Downloads</p>
                <p>{dataset.downloadCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p>{new Date(dataset.updatedAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: QA panel 40% */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quality Assurance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {QA_ITEMS.map((item) => (
                <QAChecklistItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  note={item.note}
                  checked={!!checklist[item.id]}
                  onCheckedChange={(v) =>
                    setChecklist((prev) => ({ ...prev, [item.id]: v }))
                  }
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reviewer Comment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comments for contributor (required for revision/reject)…"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Revision comments will be emailed to {contributorName}
              </p>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => handleAction("approve")}
                  disabled={!allChecked}
                  className="w-full"
                >
                  <CheckCircle className="size-4" />
                  Approve & Publish
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAction("revise")}
                  className="w-full"
                >
                  <RotateCcw className="size-4" />
                  Request Revision
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleAction("reject")}
                  disabled={!canReject}
                  className="w-full"
                >
                  <XCircle className="size-4" />
                  Reject {canReject ? "" : "(min. 20 chars)"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === "approve" ? "Confirm Approval" : "Confirm Rejection"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === "approve"
                ? `Publish "${dataset.title}" to the public catalogue?`
                : `Reject "${dataset.title}"? The contributor will be notified.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
            <Button
              variant={confirmAction === "reject" ? "destructive" : "default"}
              onClick={confirm}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
