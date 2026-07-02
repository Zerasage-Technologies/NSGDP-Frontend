"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Send, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApprovalPipeline } from "@/components/admin/approval-pipeline";
import { QAChecklistItem, type QAResult } from "@/components/data/qa-checklist-item";
import { QA_DIMENSIONS, isQAChecklistPassed } from "@/lib/constants/qa-checklist";
import { normalizeLifecycleStage } from "@/lib/constants/dataset-lifecycle";
import { getDatasets, archiveDataset } from "@/lib/mock";
import type { Dataset, LifecycleStage } from "@/types";
import { useMockSession } from "@/lib/auth/mock-session";
import { LifecycleBadge } from "@/components/data/lifecycle-badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { HelpTooltip } from "@/components/feedback/help-tooltip";

type QAState = Record<string, { result: QAResult; notes: string }>;

function initQAState(): QAState {
  return Object.fromEntries(
    QA_DIMENSIONS.map((d) => [d.id, { result: "pending" as QAResult, notes: "" }])
  );
}

export default function AdminDatasetReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { currentUser } = useMockSession();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [stage, setStage] = useState<LifecycleStage>("under_review");
  const [qa, setQA] = useState<QAState>(initQAState());
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archiveReason, setArchiveReason] = useState("");

  useEffect(() => {
    getDatasets({ page: 1, pageSize: 50 }).then((res) => {
      const found = res.data.find((d) => d.id === id);
      if (found) {
        setDataset(found);
        const normalized = normalizeLifecycleStage(found.lifecycleStage ?? "under_review");
        // Opening the review screen means active review — not still queued as submitted
        setStage(
          normalized === "draft" || normalized === "submitted" ? "under_review" : normalized
        );
      }
    });
  }, [id]);

  const passCount = Object.values(qa).filter((v) => v.result === "pass").length;
  const failCount = Object.values(qa).filter((v) => v.result === "fail").length;
  const pendingCount = Object.values(qa).filter((v) => v.result === "pending").length;
  const naCount = Object.values(qa).filter((v) => v.result === "na").length;
  const allChecksPassed = isQAChecklistPassed(qa);
  const canSendForApproval = allChecksPassed && stage === "under_review";

  const handleSendForApproval = () => {
    setStage("approved");
    toast.success("QA checklist complete — sent for director approval");
    router.push(`/admin/datasets/${id}/approve`);
  };

  const handleReject = () => {
    if (!rejectNote.trim()) { toast.error("Rejection reason required"); return; }
    toast.success("Dataset returned to submitter with revision request");
    setRejectOpen(false);
    router.push("/admin/datasets");
  };

  const handleArchive = () => {
    if (!archiveReason.trim()) { toast.error("Archive reason required"); return; }
    if (!dataset) return;
    archiveDataset(dataset.id, {
      archivedAt: new Date().toISOString(),
      archivedBy: currentUser.fullName,
      reason: archiveReason,
    });
    setStage("archived");
    toast.success("Dataset archived");
    setArchiveOpen(false);
    router.push("/admin/datasets");
  };

  if (!dataset) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading dataset…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/datasets">
          <Button variant="ghost" size="icon" aria-label="Back to Review Queue">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Review Dataset</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{dataset.title}</p>
        </div>
        <div className="ml-auto">
          <LifecycleBadge stage={stage} />
        </div>
      </div>

      {/* Approval Pipeline */}
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

      {/* Dataset metadata summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Submission Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-3">
            {[
              ["Organisation",     dataset.organisation.name],
              ["Category",        dataset.healthCategory],
              ["Format",          dataset.formats.join(", ")],
              ["Custodian",       dataset.custodian ?? "—"],
              ["Update Frequency",dataset.updateFrequency ?? "—"],
              ["License",         dataset.dataLicense ?? "—"],
              ["Submitted",       new Date(dataset.updatedAt).toLocaleDateString()],
              ["Reporting Period",dataset.reportingPeriod ?? "—"],
              ["Coverage",        dataset.geographicCoverage ?? `${dataset.lgaCoverage.length} LGAs`],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="font-medium capitalize">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {/* QA Checklist */}
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
              onResultChange={(result) =>
                setQA((prev) => ({ ...prev, [dim.id]: { ...prev[dim.id], result } }))
              }
              onNotesChange={(notes) =>
                setQA((prev) => ({ ...prev, [dim.id]: { ...prev[dim.id], notes } }))
              }
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-between border-t pt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setRejectOpen(true)}
            className="text-destructive hover:text-destructive"
          >
            <XCircle className="size-4 mr-1.5" />
            Request Revision
          </Button>
          <Button
            variant="outline"
            onClick={() => setArchiveOpen(true)}
          >
            <Archive className="size-4 mr-1.5" />
            Archive
          </Button>
        </div>
        <Button onClick={handleSendForApproval} disabled={!canSendForApproval}>
          <CheckCircle2 className="size-4 mr-1.5" />
          Send for Director Approval
          <Send className="size-4 ml-1.5" />
        </Button>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Revision</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Describe the revisions needed. The submitter will receive this feedback.
            </p>
            <Textarea
              rows={4}
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="E.g. Reporting period is missing. LGA names must match official list…"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Send Revision Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Dialog */}
      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Dataset</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Archived datasets are removed from the public catalogue but remain accessible to admins.
            </p>
            <Textarea
              rows={3}
              value={archiveReason}
              onChange={(e) => setArchiveReason(e.target.value)}
              placeholder="Reason for archiving…"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveOpen(false)}>Cancel</Button>
            <Button onClick={handleArchive}>Archive Dataset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
