"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Target, TrendingUp, FileText, Download, CheckCircle2, Circle, Clock, Pencil, Trash2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { getProgramById, deleteProgram } from "@/lib/mock/programs";
import { DocumentCard } from "@/components/data/document-card";
import { mockDocuments } from "@/lib/mock/documents";
import { useProgramPermissions } from "@/lib/hooks/useProgramPermissions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MOCK_MILESTONES = [
  { id: "m1", title: "Microplanning complete",     targetDate: "2026-02-15", completedDate: "2026-02-12", status: "completed" as const },
  { id: "m2", title: "LGA-level mobilisation",     targetDate: "2026-03-01", completedDate: "2026-02-28", status: "completed" as const },
  { id: "m3", title: "Phase 1 vaccination days",   targetDate: "2026-03-15", completedDate: "2026-03-14", status: "completed" as const },
  { id: "m4", title: "Mid-campaign LQAS survey",   targetDate: "2026-04-01", completedDate: undefined,    status: "pending" as const },
  { id: "m5", title: "Phase 2 mop-up",             targetDate: "2026-04-20", completedDate: undefined,    status: "pending" as const },
  { id: "m6", title: "Post-campaign coverage survey",targetDate:"2026-05-10",completedDate: undefined,    status: "pending" as const },
];

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { canUpload, canEdit, canDelete } = useProgramPermissions();
  const program = getProgramById(id);

  if (!program) {
    return (
      <Container className="py-16 text-center text-muted-foreground">
        Programme not found.{" "}
        <Link href="/programs" className="text-primary hover:underline">Back to Programmes</Link>
      </Container>
    );
  }

  const linkedDocs = mockDocuments.filter((d) => d.programId === program.id);
  const showEdit = canEdit(program.organisationId);
  const coveragePct = Math.round((program.reachCount / program.targetCount) * 100);

  const handleDelete = () => {
    if (!window.confirm(`Delete "${program.name}"? This cannot be undone.`)) return;
    deleteProgram(program.id);
    toast.success("Programme deleted (mock)");
    router.push("/programs");
  };

  return (
    <main className="flex-1">
      <div className="border-b bg-muted/40">
        <Container className="py-6">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/programs">
              <Button variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{program.name}</h1>
                <Badge
                  variant="secondary"
                  className={cn(
                    program.status === "completed" && "bg-emerald-100 text-emerald-800",
                    program.status === "ongoing"   && "bg-amber-100 text-amber-800"
                  )}
                >
                  {program.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{program.description}</p>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              {showEdit && (
                <Link
                  href={`/programs/${program.id}/edit`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Link>
              )}
              {canDelete && (
                <Button size="sm" variant="outline" className="text-destructive" onClick={handleDelete}>
                  <Trash2 className="size-3.5 mr-1.5" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8 space-y-8">
        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: TrendingUp,  label: "Coverage",          value: `${coveragePct}%` },
            { icon: Target,      label: "Reached / Target",  value: `${(program.reachCount/1000).toFixed(0)}K / ${(program.targetCount/1000).toFixed(0)}K` },
            { icon: MapPin,      label: "LGAs Covered",      value: String(program.lgasCovered) },
            { icon: Calendar,    label: "Active Days",        value: String(program.activeDays) },
          ].map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="pt-5 flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <kpi.icon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progress — {program.primaryMetric}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{program.reachCount.toLocaleString()} reached</span>
              <span className="font-bold text-lg text-primary">{coveragePct}%</span>
              <span className="text-muted-foreground">{program.targetCount.toLocaleString()} target</span>
            </div>
            <div className="h-4 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(100, coveragePct)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              Milestone Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {MOCK_MILESTONES.map((m) => (
                <li key={m.id} className="flex items-start gap-3">
                  {m.status === "completed" ? (
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-500 mt-0.5" />
                  ) : (
                    <Circle className="size-5 shrink-0 text-muted-foreground/40 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={cn("text-sm font-medium", m.status !== "completed" && "text-muted-foreground")}>
                      {m.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Target: {new Date(m.targetDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      {m.completedDate && ` · Completed: ${new Date(m.completedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Reports / Documents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                Programme Documents
              </CardTitle>
              {canUpload && (
                <Link
                  href={`/programs/${program.id}/upload`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
                >
                  <Download className="size-3.5 rotate-180" />
                  Upload Report
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {program.reports?.map((report) => (
              <div key={report.id} className="flex items-center gap-3 rounded-lg border p-3">
                <FileText className="size-5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{report.title}</p>
                  <p className="text-xs text-muted-foreground">{report.fileFormat} · {new Date(report.uploadedAt).toLocaleDateString()}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => toast.success(`Downloading ${report.title} (mock)`)}>
                  <Download className="size-3.5" />
                </Button>
              </div>
            ))}
            {linkedDocs.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
            {!program.reports?.length && !linkedDocs.length && (
              <p className="text-sm text-muted-foreground py-4 text-center">No documents yet.</p>
            )}
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
