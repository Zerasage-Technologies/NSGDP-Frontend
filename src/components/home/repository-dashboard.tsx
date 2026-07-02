import Link from "next/link";
import { Database, Download, Users, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { statusIconBg } from "@/lib/constants/status-surfaces";

const STATS = [
  { icon: Database, value: "142",   label: "Published Datasets",         iconClass: statusIconBg.primary },
  { icon: Download, value: "8,430", label: "Downloads this month",       iconClass: statusIconBg.emerald },
  { icon: Users,    value: "318",   label: "Registered Contributors",    iconClass: statusIconBg.blue },
  { icon: Clock,    value: "14",    label: "Pending Approvals",          iconClass: statusIconBg.amber },
];

const RECENTLY_UPDATED = [
  { title: "Routine Immunisation Coverage Q1 2026",     org: "NSPHCDA",        date: "2 hours ago" },
  { title: "Niger State Health Facility Registry v1.2", org: "NSPHCDA",        date: "Yesterday" },
  { title: "LGA Population Estimates 2025",             org: "NPC Niger State", date: "3 days ago" },
  { title: "Malaria Burden — All LGAs 2025",            org: "NSPHCDA",        date: "1 week ago" },
];

export function RepositoryDashboard() {
  return (
    <section className="py-12 border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 space-y-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold">Repository at a Glance</h2>
            <p className="text-muted-foreground mt-1">Live statistics from the NSPHCDA Data Portal</p>
          </div>
          <Link href="/dataportal">
            <Button variant="outline" size="sm">
              Browse All Datasets
              <ArrowRight className="size-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-5 flex items-center gap-4">
                <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${stat.iconClass}`}>
                  <stat.icon className="size-5" aria-hidden />
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recently updated */}
        <Card>
          <div className="px-5 py-4 border-b">
            <p className="font-semibold text-sm">Recently Updated Datasets</p>
          </div>
          <ul className="divide-y">
            {RECENTLY_UPDATED.map((item) => (
              <li key={item.title} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors">
                <Database className="size-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <Link href="/dataportal" className="text-sm font-medium hover:text-primary hover:underline truncate block">
                    {item.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">{item.org}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.date}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
