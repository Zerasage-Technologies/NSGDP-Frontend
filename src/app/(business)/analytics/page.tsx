"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Download,
  MapPin,
  ArrowUpDown,
} from "lucide-react";
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
} from "recharts";
import { toast } from "sonner";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeaderSkeleton } from "@/components/feedback/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { getHealthAnalytics } from "@/lib/mock";
import { ANALYTICS_METRICS } from "@/lib/constants/health";
import type { AnalyticsMetric, LGABurden } from "@/types";
import { cn } from "@/lib/utils";

type TrendMode = "annual" | "seasonal";
type SortKey = keyof Pick<
  LGABurden,
  "rank" | "lga" | "totalCases" | "facilities" | "population" | "incidencePer1000"
>;

export default function HealthAnalyticsPage() {
  const [metric, setMetric] = useState<AnalyticsMetric>("severe_malaria");
  const [trendMode, setTrendMode] = useState<TrendMode>("annual");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Awaited<ReturnType<typeof getHealthAnalytics>> | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    setLoading(true);
    getHealthAnalytics(metric).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [metric]);

  const trendData = trendMode === "annual" ? data?.trendAnnual : data?.trendSeasonal;

  const sortedBurden = useMemo(() => {
    if (!data?.burdenTable) return [];
    return [...data.burdenTable].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortAsc ? Number(av) - Number(bv) : Number(bv) - Number(av);
    });
  }, [data?.burdenTable, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === "lga");
    }
  };

  const metricLabel =
    ANALYTICS_METRICS.find((m) => m.id === metric)?.label ?? metric;

  if (loading && !data) {
    return (
      <main className="flex-1 py-8">
        <Container size="wide" className="space-y-6">
          <PageHeaderSkeleton />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="flex-1 py-8">
      <Container size="wide" className="space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Health Analytics Dashboard</h1>
            <p className="mt-2 text-muted-foreground">
              Real-time insights into health indicators across Niger State
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={metric}
              onValueChange={(v) => v && setMetric(v as AnalyticsMetric)}
            >
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {ANALYTICS_METRICS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() =>
                toast.success(`Export started for ${metricLabel} (mock)`)
              }
            >
              <Download className="size-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-lg bg-red-100 p-3 dark:bg-red-950">
                <Activity className="size-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {data?.kpis.totalCases.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Cases</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-950">
                <MapPin className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {data?.kpis.healthFacilities.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Health Facilities</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-950">
                <BarChart3 className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data?.kpis.lgasCovered}</p>
                <p className="text-xs text-muted-foreground">LGAs Covered</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-950">
                <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data?.kpis.outlierFacilities}</p>
                <p className="text-xs text-muted-foreground">Outlier Facilities</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Trends Over Time</CardTitle>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={trendMode === "annual" ? "default" : "outline"}
                  onClick={() => setTrendMode("annual")}
                >
                  Trends
                </Button>
                <Button
                  size="sm"
                  variant={trendMode === "seasonal" ? "default" : "outline"}
                  onClick={() => setTrendMode("seasonal")}
                >
                  Seasonality
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData ?? []}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="cases"
                      stroke="#16a34a"
                      strokeWidth={2}
                      name="State Total"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top 10 LGAs by Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data?.topLGAs ?? []}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="lga"
                      tick={{ fontSize: 10 }}
                      width={55}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="cases"
                      fill="#16a34a"
                      name="Cases"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">LGA Burden Summary</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  {(
                    [
                      ["rank", "Rank"],
                      ["lga", "LGA"],
                      ["totalCases", "Total Cases"],
                      ["facilities", "Facilities"],
                      ["population", "Population"],
                      ["incidencePer1000", "Incidence / 1,000"],
                    ] as const
                  ).map(([key, label]) => (
                    <th key={key} className="pb-3 pr-4 font-medium">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 hover:text-foreground"
                        onClick={() => handleSort(key)}
                      >
                        {label}
                        <ArrowUpDown className="size-3" />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedBurden.map((row) => (
                  <tr
                    key={row.lga}
                    className={cn(
                      "border-b last:border-0",
                      row.incidencePer1000 > 7 && "bg-red-50 dark:bg-red-950/30"
                    )}
                  >
                    <td className="py-2.5 pr-4">{row.rank}</td>
                    <td className="py-2.5 pr-4 font-medium">{row.lga}</td>
                    <td className="py-2.5 pr-4">{row.totalCases.toLocaleString()}</td>
                    <td className="py-2.5 pr-4">{row.facilities}</td>
                    <td className="py-2.5 pr-4">{row.population.toLocaleString()}</td>
                    <td className="py-2.5 pr-4">{row.incidencePer1000}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Outlier Facilities
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                (z-score ≥ 2.0 indicates statistical outlier)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <p className="mb-4 text-sm font-medium text-red-600 dark:text-red-400">
              High Outliers ({data?.outliers.length ?? 0})
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Facility</th>
                  <th className="pb-3 pr-4 font-medium">LGA</th>
                  <th className="pb-3 pr-4 font-medium">Total Cases</th>
                  <th className="pb-3 pr-4 font-medium">Z-Score</th>
                  <th className="pb-3 font-medium">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {data?.outliers.map((row) => (
                  <tr key={row.facility} className="border-b last:border-0">
                    <td className="py-2.5 pr-4 font-medium">{row.facility}</td>
                    <td className="py-2.5 pr-4">{row.lga}</td>
                    <td className="py-2.5 pr-4">{row.totalCases.toLocaleString()}</td>
                    <td className="py-2.5 pr-4">{row.zScore.toFixed(1)}</td>
                    <td
                      className={cn(
                        "py-2.5",
                        row.interpretation.includes("Very high")
                          ? "text-red-600 dark:text-red-400"
                          : row.interpretation.includes("Elevated")
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-muted-foreground"
                      )}
                    >
                      {row.interpretation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
