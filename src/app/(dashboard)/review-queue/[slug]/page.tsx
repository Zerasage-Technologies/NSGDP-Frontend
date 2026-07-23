"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Globe, Loader2, Send, XCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ApprovalPipeline } from "@/components/data/approval-pipeline";
import { LifecycleBadge } from "@/components/data/lifecycle-badge";
import { QAChecklistItem } from "@/components/data/qa-checklist-item";
import { HelpTooltip } from "@/components/feedback/help-tooltip";
import { QA_DIMENSIONS, isQAChecklistPassed, type QAResult } from "@/lib/constants/qa-checklist";
import {
  useReviewDataset,
  useReviewDatasetPreview,
  useApproveDataset,
  useRejectDataset,
  useRequestRevision,
  useMarkUnderReview,
  useSaveQAChecklist,
  usePublishDataset,
  useUnpublishDataset,
} from "@/lib/hooks/useReviewQueue";
import { useOrganisations } from "@/lib/hooks/useOrganisations";
import { useRequireAccess } from "@/lib/hooks/useRequireAccess";
import { formatDate } from "@/lib/utils/date";
import type { LifecycleStage } from "@/types";

type QAState = Record<string, { result: QAResult; notes: string }>;

function initQAState(): QAState {
  return Object.fromEntries(QA_DIMENSIONS.map((d) => [d.id, { result: "pending" as QAResult, notes: "" }]));
}

function toLifecycleStage(status: string, publishedAt: string | null): LifecycleStage {
  const map: Record<string, LifecycleStage> = {
    draft: "draft",
    pending: "submitted",
    under_review: "under_review",
    approved: publishedAt ? "published" : "approved",
    rejected: "under_review",
    archived: "archived",
  };
  return map[status] ?? "submitted";
}

export default function ReviewDatasetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  const { allowed, isLoading: isAccessLoading } = useRequireAccess(
    ["admin", "super_admin"],
    ["approve:datasets", "publish:datasets"]
  );

  const [qa, setQA] = useState<QAState>(initQAState());
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [revisionComment, setRevisionComment] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { data: dataset, isLoading, error } = useReviewDataset(slug);
  const { data: previewData, isLoading: isPreviewLoading } = useReviewDatasetPreview(slug);
  const { data: organisationsData } = useOrganisations(1, 100);
  const organisation = organisationsData?.data?.find((o) => o.id === dataset?.organisation_id);

  const markUnderReviewMutation = useMarkUnderReview();
  const requestRevisionMutation = useRequestRevision();
  const saveChecklistMutation = useSaveQAChecklist();
  const approveMutation = useApproveDataset();
  const rejectMutation = useRejectDataset();
  const publishMutation = usePublishDataset();
  const unpublishMutation = useUnpublishDataset();

  // Opening the review screen means active review, mirroring nsgdp-admin's
  // existing (real, working) review workflow.
  useEffect(() => {
    if (dataset?.status === "pending" && !markUnderReviewMutation.isPending) {
      markUnderReviewMutation.mutate(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset?.status]);

  if (isAccessLoading || !allowed) return null;

  if (isLoading) {
    return (
      <Container size="wide" className="py-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </Container>
    );
  }

  if (error || !dataset) {
    return (
      <Container size="wide" className="py-8 space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="size-4 mr-1.5" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertDescription>Dataset not found or you don&apos;t have permission to view it.</AlertDescription>
        </Alert>
      </Container>
    );
  }

  const stage = toLifecycleStage(dataset.status, dataset.published_at);
  const passCount = Object.values(qa).filter((v) => v.result === "pass").length;
  const failCount = Object.values(qa).filter((v) => v.result === "fail").length;
  const naCount = Object.values(qa).filter((v) => v.result === "na").length;
  const pendingCount = Object.values(qa).filter((v) => v.result === "pending").length;
  const allChecksPassed = isQAChecklistPassed(qa);
  const canSendForApproval = allChecksPassed && stage === "under_review";
  const canDecide = stage === "approved" && !dataset.published_at;

  const handleSendForApproval = () => {
    const items = QA_DIMENSIONS.map((d) => ({
      dimensionId: d.id,
      result: qa[d.id].result,
      notes: qa[d.id].notes || undefined,
    }));
    saveChecklistMutation.mutate({ slug, items });
  };

  const handleRequestRevision = () => {
    if (revisionComment.length < 20) return;
    requestRevisionMutation.mutate(
      { slug, comment: revisionComment },
      { onSuccess: () => router.push("/review-queue") }
    );
  };

  const handleReject = () => {
    if (rejectReason.length < 20) return;
    rejectMutation.mutate({ slug, reason: rejectReason }, { onSuccess: () => router.push("/review-queue") });
  };

  const handleApprove = () => approveMutation.mutate({ slug });

  return (
    <Container size="wide" className="py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/review-queue")} aria-label="Back to Review Queue">
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Review Dataset</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{dataset.title}</p>
        </div>
        <div className="ml-auto">
          <LifecycleBadge stage={stage} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            Approval Pipeline
            <HelpTooltip content="Five practical stages. The QA checklist below replaces separate metadata, technical, and quality gates — complete all 8 dimensions in one review session." />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ApprovalPipeline currentStage={stage} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Submission Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-3">
            {[
              ["Organisation", organisation?.name ?? "—"],
              ["Format", dataset.format?.toUpperCase()],
              ["Visibility", dataset.visibility],
              ["License", dataset.license ?? "—"],
              ["Submitted", dataset.submitted_at ? formatDate(dataset.submitted_at) : formatDate(dataset.created_at)],
              [
                "Coverage",
                dataset.geographic_coverage?.length ? `${dataset.geographic_coverage.length} location(s)` : "—",
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="font-medium capitalize">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {isPreviewLoading ? (
            <Skeleton className="h-40" />
          ) : previewData ? (
            (() => {
              const preview = previewData.preview as {
                type?: string;
                columns?: string[];
                rows?: Record<string, unknown>[];
                message?: string;
              };
              if (preview?.type === "tabular" && preview.columns) {
                return (
                  <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/50">
                        <tr>
                          {preview.columns.map((col) => (
                            <th key={col} className="px-3 py-2 text-left font-medium whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {(preview.rows ?? []).slice(0, 10).map((row, i) => (
                          <tr key={i}>
                            {preview.columns!.map((col) => (
                              <td key={col} className="px-3 py-2 whitespace-nowrap">
                                {String(row[col] ?? "")}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              return (
                <p className="text-sm text-muted-foreground">
                  {preview?.message ?? "Preview not available for this file type."}
                </p>
              );
            })()
          ) : (
            <p className="text-sm text-muted-foreground">Preview not available.</p>
          )}
        </CardContent>
      </Card>

      {stage === "under_review" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Quality Assurance Checklist
              <HelpTooltip content="Score all 8 governance dimensions in this single review. This replaces separate metadata, technical, and QA micro-stages." />
            </h2>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{passCount} Pass</span>
              <span className="text-destructive font-semibold">{failCount} Fail</span>
              <span className="text-muted-foreground">{naCount} N/A</span>
              <span className="text-muted-foreground">{pendingCount} Pending</span>
            </div>
          </div>

          <div className="space-y-3">
            {QA_DIMENSIONS.map((dim) => (
              <QAChecklistItem
                key={dim.id}
                dimension={dim}
                result={qa[dim.id].result}
                notes={qa[dim.id].notes}
                onResultChange={(result) => setQA((prev) => ({ ...prev, [dim.id]: { ...prev[dim.id], result } }))}
                onNotesChange={(notes) => setQA((prev) => ({ ...prev, [dim.id]: { ...prev[dim.id], notes } }))}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-between border-t pt-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setRevisionOpen(true)}
              className="text-destructive hover:text-destructive"
            >
              <XCircle className="size-4 mr-1.5" />
              Request Revision
            </Button>
            <Button onClick={handleSendForApproval} disabled={!canSendForApproval || saveChecklistMutation.isPending}>
              <CheckCircle2 className="size-4 mr-1.5" />
              Send for Director Approval
              <Send className="size-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {canDecide && (
        <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40">
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-emerald-800 dark:text-emerald-200">
              This dataset passed the QA checklist and is awaiting a final decision. Approving does not
              make it public — publish it separately once it&apos;s ready to go live.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setRejectOpen(true)}
                className="text-destructive hover:text-destructive"
              >
                <XCircle className="size-4 mr-1.5" />
                Reject
              </Button>
              <Button className="ml-auto" onClick={handleApprove} disabled={approveMutation.isPending}>
                {approveMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin mr-1.5" />
                ) : (
                  <CheckCircle2 className="size-4 mr-1.5" />
                )}
                Approve
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {dataset.status === "approved" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Publication</CardTitle>
          </CardHeader>
          <CardContent>
            {dataset.published_at ? (
              <Button variant="outline" onClick={() => unpublishMutation.mutate(slug)} disabled={unpublishMutation.isPending}>
                Unpublish
              </Button>
            ) : (
              <Button onClick={() => publishMutation.mutate(slug)} disabled={publishMutation.isPending}>
                <Globe className="size-4 mr-1.5" />
                Publish to Public Catalogue
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={revisionOpen} onOpenChange={setRevisionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Revision</DialogTitle>
            <DialogDescription>Describe the revisions needed. The submitter will receive this feedback.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Textarea
              rows={4}
              value={revisionComment}
              onChange={(e) => setRevisionComment(e.target.value)}
              placeholder="E.g. Reporting period is missing. LGA names must match official list…"
            />
            <p className="text-sm text-muted-foreground">{revisionComment.length}/20 characters minimum</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevisionOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleRequestRevision}
              disabled={requestRevisionMutation.isPending || revisionComment.length < 20}
            >
              Send Revision Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Dataset</DialogTitle>
            <DialogDescription>Explain why this dataset is being returned.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain why this dataset is being returned (minimum 20 characters)…"
            />
            <p className="text-sm text-muted-foreground">{rejectReason.length}/20 characters minimum</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectMutation.isPending || rejectReason.length < 20}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
