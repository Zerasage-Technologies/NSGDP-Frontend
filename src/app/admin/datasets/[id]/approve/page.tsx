"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApprovalPipeline } from "@/components/admin/approval-pipeline";
import { LifecycleBadge } from "@/components/data/lifecycle-badge";
import { getDatasets } from "@/lib/mock";
import type { Dataset } from "@/types";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export default function AdminDatasetApprovePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  useEffect(() => {
    getDatasets({ page: 1, pageSize: 50 }).then((res) => {
      const found = res.data.find((d) => d.id === id);
      if (found) setDataset(found);
    });
  }, [id]);

  const handlePublish = () => {
    toast.success("Dataset published to public catalogue");
    router.push("/admin/datasets");
  };

  const handleReject = () => {
    if (!rejectReason.trim()) { toast.error("Rejection reason required"); return; }
    toast.success("Dataset returned for revision");
    router.push("/admin/datasets");
  };

  if (!dataset) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/admin/datasets/${id}/review`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Director Approval</h1>
          <p className="text-sm text-muted-foreground">{dataset.title}</p>
        </div>
        <div className="ml-auto">
          <LifecycleBadge stage="approved" />
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Approval Pipeline</CardTitle></CardHeader>
        <CardContent>
          <ApprovalPipeline currentStage="approved" />
        </CardContent>
      </Card>

      <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40">
        <CardContent className="pt-6">
          <p className="text-sm text-emerald-800 dark:text-emerald-200">
            This dataset passed the 8-dimension QA checklist in a single review session and is
            awaiting director sign-off. Once published it will be visible in the public catalogue.
          </p>
        </CardContent>
      </Card>

      {showReject && (
        <Card>
          <CardHeader><CardTitle className="text-base text-destructive">Rejection Reason</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain why this dataset is being returned…"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowReject(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleReject}>Confirm Rejection</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 border-t pt-4">
        <Button variant="outline" onClick={() => setShowReject(true)} className="text-destructive">
          <XCircle className="size-4 mr-1.5" />
          Reject
        </Button>
        <Button className="ml-auto" onClick={handlePublish}>
          <Globe className="size-4 mr-1.5" />
          Approve & Publish
        </Button>
      </div>
    </div>
  );
}
