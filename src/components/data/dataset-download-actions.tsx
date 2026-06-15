"use client";

import { useState, useEffect } from "react";
import { Download, Lock, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { LoginPromptModal } from "@/components/feedback/login-prompt-modal";
import { useMockSession } from "@/lib/auth/mock-session";
import { toast } from "sonner";
import type { Visibility } from "@/types";
import { cn } from "@/lib/utils";

type DownloadState =
  | "guest"
  | "ready"
  | "request"
  | "pending"
  | "approved"
  | "hidden";

interface DatasetDownloadActionsProps {
  datasetId: string;
  datasetSlug: string;
  datasetTitle: string;
  visibility: Visibility;
  className?: string;
}

function getInitialState(
  visibility: Visibility,
  isAuthenticated: boolean,
  accessState: "none" | "pending" | "approved"
): DownloadState {
  if (visibility === "private") return "hidden";
  if (!isAuthenticated) return "guest";
  if (visibility === "restricted") {
    if (accessState === "approved") return "approved";
    if (accessState === "pending") return "pending";
    return "request";
  }
  return "ready";
}

export function DatasetDownloadActions({
  datasetId,
  datasetSlug,
  datasetTitle,
  visibility,
  className,
}: DatasetDownloadActionsProps) {
  const {
    isAuthenticated,
    getDatasetAccess,
    requestDatasetAccess,
    approveDatasetAccess,
    pendingDownloadSlug,
    setPendingDownloadSlug,
  } = useMockSession();

  const accessState = getDatasetAccess(datasetId);
  const [state, setState] = useState<DownloadState>(() =>
    getInitialState(visibility, isAuthenticated, accessState)
  );
  const [loginOpen, setLoginOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setState(getInitialState(visibility, isAuthenticated, getDatasetAccess(datasetId)));
  }, [visibility, isAuthenticated, accessState, datasetId, getDatasetAccess]);

  // Auto-trigger download after login redirect
  useEffect(() => {
    if (
      pendingDownloadSlug === datasetSlug &&
      isAuthenticated &&
      (visibility === "public" || getDatasetAccess(datasetId) === "approved")
    ) {
      setPendingDownloadSlug(null);
      handleDownload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingDownloadSlug, isAuthenticated, datasetSlug]);

  const handleDownload = async () => {
    setDownloading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setDownloading(false);
    toast.success(`Download started: ${datasetTitle}`);
  };

  const handlePrimaryClick = () => {
    if (state === "guest") {
      setPendingDownloadSlug(datasetSlug);
      setLoginOpen(true);
      return;
    }
    if (state === "request") {
      setRequestOpen(true);
      return;
    }
    if (state === "ready" || state === "approved") {
      handleDownload();
    }
  };

  const submitAccessRequest = () => {
    if (reason.trim().length < 20) {
      toast.error("Please provide at least 20 characters explaining your need.");
      return;
    }
    requestDatasetAccess(datasetId, reason);
    setRequestOpen(false);
    setState("pending");
    toast.success("Access request submitted. You will be notified when approved.");

    // Mock admin approval after 8 seconds for demo
    setTimeout(() => {
      approveDatasetAccess(datasetId);
      setState("approved");
      toast.success("Access approved! You can now download this dataset.");
    }, 8000);
  };

  if (state === "hidden") return null;

  const buttonConfig: Record<
    Exclude<DownloadState, "hidden">,
    { label: string; icon: React.ReactNode; variant: "default" | "outline" | "secondary"; disabled?: boolean }
  > = {
    guest: { label: "Log in to Download", icon: <Lock className="size-4" />, variant: "default" },
    ready: { label: "Download Dataset", icon: <Download className="size-4" />, variant: "default" },
    request: { label: "Request Access", icon: <Lock className="size-4" />, variant: "outline" },
    pending: { label: "Access Pending", icon: <Clock className="size-4" />, variant: "secondary", disabled: true },
    approved: { label: "Download", icon: <Download className="size-4" />, variant: "default" },
  };

  const cfg = buttonConfig[state];

  return (
    <div className={cn("space-y-3", className)}>
      <Button
        className="w-full"
        variant={cfg.variant}
        onClick={handlePrimaryClick}
        disabled={cfg.disabled || downloading}
      >
        {downloading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          cfg.icon
        )}
        {downloading ? "Preparing download…" : cfg.label}
      </Button>

      {visibility === "restricted" && state === "request" && (
        <p className="text-xs text-muted-foreground text-center">
          This dataset requires admin approval before download.
        </p>
      )}

      <LoginPromptModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        redirectAfterAuth={`/datasets/${datasetSlug}`}
      />

      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Access</DialogTitle>
            <DialogDescription>
              Explain why you need access to &ldquo;{datasetTitle}&rdquo;. An administrator will review your request.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe your intended use (min. 20 characters)…"
            rows={4}
            aria-label="Reason for access request"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitAccessRequest} disabled={reason.trim().length < 20}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
