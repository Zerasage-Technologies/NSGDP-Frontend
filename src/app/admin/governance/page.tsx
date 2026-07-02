"use client";

import Link from "next/link";
import { FileCheck, ShieldCheck, Users, BookOpen, GitBranch, Database, ArrowRight, HeartPulse } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const GOVERNANCE_AREAS = [
  {
    icon: GitBranch,
    title: "Approval Workflows",
    description: "5-step pipeline: Draft → Submitted → Under Review (QA checklist) → Approved → Published. Archived is an admin end-of-life action.",
    status: "active" as const,
    link: "/admin/datasets",
    linkLabel: "Open Review Queue",
  },
  {
    icon: ShieldCheck,
    title: "Role & Permission Management",
    description: "9-role model with atomic permission delegation. Super Admin can grant specific permissions to user groups beyond their base role.",
    status: "active" as const,
    link: "/admin/permissions",
    linkLabel: "Manage Permissions",
  },
  {
    icon: FileCheck,
    title: "Data Quality Standards",
    description: "8-dimension QA checklist applied to every dataset before publication: completeness, accuracy, consistency, timeliness, validity, uniqueness, geo-refs, documentation.",
    status: "active" as const,
    link: "/admin/datasets",
    linkLabel: "Review Datasets",
  },
  {
    icon: BookOpen,
    title: "SOP Management",
    description: "Standard Operating Procedures governing submission, validation, publication, archival, and data correction. Publicly accessible to contributors.",
    status: "active" as const,
    link: "/admin/governance/sops",
    linkLabel: "Manage SOPs",
  },
  {
    icon: Database,
    title: "Data Sharing Agreements",
    description: "Track partner data-sharing agreements, access conditions, and license obligations for restricted datasets.",
    status: "active" as const,
    link: "/admin/organisations",
    linkLabel: "Manage Agreements",
  },
  {
    icon: HeartPulse,
    title: "Governance Health Dashboard",
    description: "Real-time metrics: metadata completeness, on-schedule update rate, approval turnaround, open QA flags, contributor counts.",
    status: "active" as const,
    link: "/admin/governance/health",
    linkLabel: "View Health Metrics",
  },
  {
    icon: Users,
    title: "User & Organisation Audit",
    description: "Org-scoped user management, access logs, and periodic access review for compliance with the data governance policy.",
    status: "active" as const,
    link: "/admin/user-groups",
    linkLabel: "Manage User Groups",
  },
];

export default function AdminGovernancePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Governance Overview</h1>
        <p className="text-muted-foreground mt-1">
          Central control panel for NSPHCDA data governance, compliance, and publication rules.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {GOVERNANCE_AREAS.map((area) => (
          <Card key={area.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <area.icon className="size-5 text-primary" aria-hidden />
                </div>
                <Badge
                  variant={area.status === "active" ? "default" : "outline"}
                  className="capitalize text-xs"
                >
                  {area.status}
                </Badge>
              </div>
              <CardTitle className="text-base mt-2">{area.title}</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                {area.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-0">
              {area.status === "active" ? (
                <Link href={area.link}>
                  <Button variant="outline" size="sm" className="w-full">
                    {area.linkLabel}
                    <ArrowRight className="size-3.5 ml-1.5" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" className="w-full" disabled>
                  {area.linkLabel}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
