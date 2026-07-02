"use client";

import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Users,
  Database,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const METRICS = [
  {
    icon: CheckCircle2,
    label: "Metadata Completeness",
    value: "87%",
    trend: "+4% vs last quarter",
    good: true,
    description: "Datasets with all 14 metadata fields filled",
  },
  {
    icon: TrendingUp,
    label: "On-Schedule Update Rate",
    value: "72%",
    trend: "-3% vs last quarter",
    good: false,
    description: "Datasets updated within their agreed frequency",
  },
  {
    icon: Clock,
    label: "Avg. Approval Turnaround",
    value: "6.4 days",
    trend: "-1.2 days vs last quarter",
    good: true,
    description: "From submission to publication (5-step pipeline)",
  },
  {
    icon: Users,
    label: "Active Contributors",
    value: "48",
    trend: "+12 this quarter",
    good: true,
    description: "Contributors who submitted at least one dataset",
  },
  {
    icon: AlertTriangle,
    label: "Open QA Flags",
    value: "9",
    trend: "5 critical",
    good: false,
    description: "Datasets with unresolved QA issues",
  },
  {
    icon: Database,
    label: "Published Datasets",
    value: "142",
    trend: "+18 this quarter",
    good: true,
    description: "Total datasets in public catalogue",
  },
];

const COMPLETENESS_TREND = [
  { month: "Oct",  score: 74 },
  { month: "Nov",  score: 78 },
  { month: "Dec",  score: 80 },
  { month: "Jan",  score: 82 },
  { month: "Feb",  score: 85 },
  { month: "Mar",  score: 87 },
];

const CATEGORY_COMPLETENESS = [
  { category: "Disease Surveillance",  score: 93 },
  { category: "Facility Registry",     score: 88 },
  { category: "Immunisation",          score: 85 },
  { category: "HRH Profiles",          score: 72 },
  { category: "Population",            score: 80 },
  { category: "Budget & Finance",      score: 60 },
];

export default function GovernanceHealthPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Governance Health Metrics</h2>
        <p className="text-muted-foreground mt-1">
          Real-time indicators measuring the quality, currency, and completeness of the repository.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {METRICS.map((m) => (
          <Card key={m.label} className={m.good === false ? "border-amber-200" : undefined}>
            <CardContent className="pt-5">
              <div className="flex items-start gap-4">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                    m.good === false ? "bg-amber-50" : "bg-primary/10"
                  }`}
                >
                  <m.icon
                    className={`size-5 ${m.good === false ? "text-amber-600" : "text-primary"}`}
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold">{m.value}</p>
                  <p className="text-sm font-medium">{m.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
                  <p
                    className={`text-xs mt-1 font-medium ${
                      m.good ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {m.trend}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Metadata Completeness Trend (6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={COMPLETENESS_TREND}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Completeness"]} />
                <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Completeness by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={CATEGORY_COMPLETENESS} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} />
                <YAxis dataKey="category" type="category" width={130} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Score"]} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {CATEGORY_COMPLETENESS.map((entry) => (
                    <Cell
                      key={entry.category}
                      fill={entry.score >= 80 ? "#16a34a" : entry.score >= 70 ? "#d97706" : "#dc2626"}
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
