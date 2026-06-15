import { Syringe, Calendar, Target, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCampaigns } from "@/lib/mock";
import type { CampaignStatus } from "@/types";

function statusBadgeVariant(status: CampaignStatus) {
  switch (status) {
    case "ongoing":
      return "default" as const;
    case "completed":
      return "secondary" as const;
    case "planned":
      return "outline" as const;
  }
}

function statusLabel(status: CampaignStatus) {
  switch (status) {
    case "ongoing":
      return "Ongoing";
    case "completed":
      return "Completed";
    case "planned":
      return "Planned";
  }
}

function coverageBarColor(pct: number): string {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CampaignsPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/90 via-primary to-primary/95" />
        <Container className="relative py-14 sm:py-20">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Syringe className="size-7 text-white" />
            </div>
            <div className="text-primary-foreground">
              <h1 className="text-4xl font-bold sm:text-5xl">Campaigns</h1>
              <p className="mt-3 max-w-xl text-lg text-primary-foreground/90">
                Track vaccination campaigns across Niger State — coverage, targets, and LGA
                reach in one dashboard.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Campaign cards */}
      <section className="py-12 sm:py-16">
        <Container size="wide">
          <div className="grid gap-6 md:grid-cols-2">
            {mockCampaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                  <CardTitle className="text-lg leading-snug">{campaign.name}</CardTitle>
                  <Badge variant={statusBadgeVariant(campaign.status)}>
                    {statusLabel(campaign.status)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="size-4 shrink-0" />
                      <span>
                        {formatDate(campaign.startDate)}
                        {campaign.endDate ? ` – ${formatDate(campaign.endDate)}` : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Target className="size-4 shrink-0" />
                      <span>{campaign.primaryMetric}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-4 shrink-0" />
                      <span>{campaign.lgasCovered} LGAs covered</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="size-4 shrink-0" />
                      <span>{campaign.activeDays} active days</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {campaign.coveragePercent}%
                      </p>
                      <p className="text-xs text-muted-foreground">Coverage</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {campaign.vaccinatedCount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Vaccinated</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {campaign.targetCount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Target</p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-medium">Coverage progress</span>
                      <span className="text-muted-foreground">{campaign.coveragePercent}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${coverageBarColor(campaign.coveragePercent)}`}
                        style={{ width: `${Math.max(campaign.coveragePercent, 2)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
