"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Loader2,
  Users,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getGisBurdenBubbles } from "@/lib/mock";
import { getTrendData, getLGABurdenTable } from "@/lib/mock/analytics";
import { ANALYTICS_METRICS, NIGER_STATE_POPULATION } from "@/lib/constants/health";
import { NIGER_STATE_LGAS } from "@/lib/constants";
import { getWardsForLGA } from "@/lib/mock/facilities";
import type { AnalyticsMetric } from "@/types";
import { cn } from "@/lib/utils";

function configureLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require("leaflet") as typeof import("leaflet");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  { ssr: false }
);

const NIGER_STATE_CENTER: [number, number] = [9.9319, 6.547];
const NIGER_STATE_BOUNDS: [[number, number], [number, number]] = [
  [8.5, 3.5],
  [11.5, 8.5],
];

const YEARS = Array.from({ length: 13 }, (_, i) => 2013 + i);
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type ValueType = "cases" | "rate" | "coverage";

export default function GisMappingPage() {
  const [mapReady, setMapReady] = useState(false);
  const [filterOpen, setFilterOpen] = useState(true);
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [trendOpen, setTrendOpen] = useState(true);
  const [metric, setMetric] = useState<AnalyticsMetric>("severe_malaria");
  const [valueType, setValueType] = useState<ValueType>("cases");
  const [year, setYear] = useState("2024");
  const [month, setMonth] = useState("all");
  const [lga, setLga] = useState("all");
  const [ward, setWard] = useState("all");
  const [minCases, setMinCases] = useState("");
  const [maxCases, setMaxCases] = useState("");
  const [bubbles, setBubbles] = useState<
    Awaited<ReturnType<typeof getGisBurdenBubbles>>
  >([]);
  const [loading, setLoading] = useState(true);

  const wards = lga === "all" ? [] : getWardsForLGA(lga);

  useEffect(() => {
    configureLeafletIcons();
    setMapReady(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    getGisBurdenBubbles(metric, Number(year)).then((data) => {
      setBubbles(data);
      setLoading(false);
    });
  }, [metric, year]);

  const filteredBubbles = useMemo(() => {
    let results = [...bubbles];
    if (lga !== "all") results = results.filter((b) => b.lga === lga);
    if (minCases) results = results.filter((b) => b.cases >= Number(minCases));
    if (maxCases) results = results.filter((b) => b.cases <= Number(maxCases));
    if (month !== "all") {
      const factor = 0.7 + (Number(month) / 12) * 0.6;
      results = results.map((b) => ({
        ...b,
        cases: Math.round(b.cases * factor),
        radius: b.radius * (0.85 + factor * 0.15),
      }));
    }
    return results;
  }, [bubbles, lga, minCases, maxCases, month]);

  const burdenTable = useMemo(() => getLGABurdenTable(metric), [metric]);
  const filteredBurden = useMemo(() => {
    if (lga === "all") return burdenTable;
    return burdenTable.filter((r) => r.lga === lga);
  }, [burdenTable, lga]);

  const top5 = filteredBurden.slice(0, 5);
  const bottom5 = [...filteredBurden].reverse().slice(0, 5);

  const trendData = useMemo(
    () => getTrendData(metric, "annual"),
    [metric]
  );

  const metricLabel =
    ANALYTICS_METRICS.find((m) => m.id === metric)?.label ?? metric;

  const totalCases = filteredBubbles.reduce((s, b) => s + b.cases, 0);
  const totalFacilities = filteredBurden.reduce((s, r) => s + r.facilities, 0);

  const displayValue = (cases: number, population = 200000) => {
    if (valueType === "rate") {
      return `${((cases / population) * 1000).toFixed(1)}/1k`;
    }
    if (valueType === "coverage") {
      return `${Math.min(99, Math.round((cases / 5000) * 100))}%`;
    }
    return cases.toLocaleString();
  };

  if (!mapReady) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      <MapContainer
        center={NIGER_STATE_CENTER}
        zoom={8}
        minZoom={7}
        maxZoom={18}
        maxBounds={NIGER_STATE_BOUNDS}
        maxBoundsViscosity={1}
        zoomControl={false}
        className="absolute inset-0 z-0 h-full w-full"
      >
        <ZoomControl position="topleft" />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {filteredBubbles.map((bubble) => (
          <CircleMarker
            key={bubble.lga}
            center={[bubble.lat, bubble.lng]}
            radius={bubble.radius}
            pathOptions={{
              color: "#dc2626",
              fillColor: "#ef4444",
              fillOpacity: 0.55,
              weight: 1,
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{bubble.lga}</p>
                <p>{displayValue(bubble.cases)} cases</p>
                <p className="text-muted-foreground">{year}{month !== "all" ? ` · ${MONTHS[Number(month) - 1]}` : ""}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Filter toggle */}
      {!filterOpen && (
        <Button
          size="sm"
          className="absolute left-4 top-4 z-[1000] shadow-lg"
          onClick={() => setFilterOpen(true)}
        >
          <Filter className="size-4 mr-2" />
          Filters
        </Button>
      )}

      {/* Sliding filter panel */}
      <div
        className={cn(
          "absolute left-0 top-0 z-[1000] h-full w-80 transform bg-background/95 shadow-xl backdrop-blur transition-transform duration-300",
          filterOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold">Health Metrics Map</h2>
          <Button size="icon" variant="ghost" onClick={() => setFilterOpen(false)}>
            <X className="size-4" />
          </Button>
        </div>
        <div className="space-y-4 overflow-y-auto p-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Primary health metric
            </label>
            <Select value={metric} onValueChange={(v) => v && setMetric(v as AnalyticsMetric)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ANALYTICS_METRICS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Value type
            </label>
            <Select value={valueType} onValueChange={(v) => v && setValueType(v as ValueType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cases">Cases</SelectItem>
                <SelectItem value="rate">Rate</SelectItem>
                <SelectItem value="coverage">Coverage %</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Min</label>
              <Input
                type="number"
                placeholder="Min cases"
                value={minCases}
                onChange={(e) => setMinCases(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Max</label>
              <Input
                type="number"
                placeholder="Max cases"
                value={maxCases}
                onChange={(e) => setMaxCases(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Year</label>
            <Select value={year} onValueChange={(v) => v && setYear(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Month</label>
            <Select value={month} onValueChange={(v) => v && setMonth(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All months</SelectItem>
                {MONTHS.map((m, i) => (
                  <SelectItem key={m} value={String(i + 1)}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">LGA</label>
            <Select
              value={lga}
              onValueChange={(v) => {
                if (v) {
                  setLga(v);
                  setWard("all");
                }
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All LGAs</SelectItem>
                {NIGER_STATE_LGAS.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Ward</label>
            <Select value={ward} onValueChange={(v) => v && setWard(v)} disabled={lga === "all"}>
              <SelectTrigger><SelectValue placeholder="Select ward" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All wards</SelectItem>
                {wards.map((w) => (
                  <SelectItem key={w} value={w}>{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Population badge */}
      <div className="absolute right-4 top-4 z-[1000]">
        <Badge variant="secondary" className="gap-2 px-3 py-2 text-sm shadow-lg">
          <Users className="size-4" />
          Niger State Population: {(NIGER_STATE_POPULATION / 1_000_000).toFixed(1)}M
        </Badge>
      </div>

      {/* Burden summary panel */}
      {summaryOpen ? (
        <Card className="absolute right-4 top-16 z-[1000] w-72 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Burden Summary</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => setSummaryOpen(false)}>
              Hide
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {loading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Total cases</p>
                    <p className="font-semibold">{totalCases.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Facilities</p>
                    <p className="font-semibold">{totalFacilities}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">LGAs</p>
                    <p className="font-semibold">{lga === "all" ? 25 : 1}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Wards</p>
                    <p className="font-semibold">{ward === "all" ? "All" : 1}</p>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-green-700 dark:text-green-400">
                    Top 5 LGAs
                  </p>
                  <ul className="space-y-1">
                    {top5.map((r) => (
                      <li key={r.lga} className="flex justify-between">
                        <span>{r.lga}</span>
                        <span className="font-medium">{r.totalCases.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Bottom 5 LGAs
                  </p>
                  <ul className="space-y-1">
                    {bottom5.map((r) => (
                      <li key={r.lga} className="flex justify-between">
                        <span>{r.lga}</span>
                        <span className="font-medium">{r.totalCases.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Button
          size="sm"
          variant="secondary"
          className="absolute right-4 top-16 z-[1000] shadow-lg"
          onClick={() => setSummaryOpen(true)}
        >
          Show Summary
        </Button>
      )}

      {/* Mini trend chart */}
      {trendOpen ? (
        <Card className="absolute bottom-4 left-4 z-[1000] w-80 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs">
              Yearly cases of {metricLabel}
            </CardTitle>
            <Button size="sm" variant="ghost" onClick={() => setTrendOpen(false)}>
              <ChevronDown className="size-4" />
              Hide
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                  onClick={(state) => {
                    const payload = state?.activePayload?.[0]?.payload as
                      | { date: string }
                      | undefined;
                    if (payload?.date) setYear(payload.date);
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} width={30} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="cases"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              Click a year to filter the map
            </p>
          </CardContent>
        </Card>
      ) : (
        <Button
          size="sm"
          variant="secondary"
          className="absolute bottom-4 left-4 z-[1000] shadow-lg"
          onClick={() => setTrendOpen(true)}
        >
          <ChevronUp className="size-4 mr-1" />
          Show Trend
        </Button>
      )}
    </div>
  );
}
