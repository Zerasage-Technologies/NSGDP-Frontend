"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import type { FeatureCollection } from "geojson";

// Prevent server-side rendering
export const dynamic = "force-dynamic";

// Lazy load the map component
const DatasetMap = lazy(() =>
  import("@/components/map/dataset-map").then((mod) => ({
    default: mod.DatasetMap,
  }))
);

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDatasets, getGroups } from "@/lib/mock";
import { Search, Filter, MapPin, Database } from "lucide-react";
import type { Dataset } from "@/types";
import Link from "next/link";

export default function MapExplorePage() {
  const [mounted, setMounted] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>([]);
  const [groups, setGroups] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock GeoJSON data for Niger State LGAs (simplified) - inside component to avoid SSR issues
  const nigerStateBoundary: FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: "Niger State",
          description: "Niger State boundary",
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [6.2, 10.5],
              [7.8, 10.5],
              [7.8, 8.8],
              [6.2, 8.8],
              [6.2, 10.5],
            ],
          ],
        },
      },
    ],
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [datasetsResult, groupsData] = await Promise.all([
        getDatasets({ pageSize: 50 }),
        getGroups(),
      ]);
      setDatasets(datasetsResult.data);
      setFilteredDatasets(datasetsResult.data);
      setGroups(groupsData);
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = datasets;

    // Filter by group
    if (selectedGroup !== "all") {
      filtered = filtered.filter((d) =>
        d.groups.some((g) => g.slug === selectedGroup)
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDatasets(filtered);
  }, [datasets, selectedGroup, searchQuery]);

  // Generate mock markers from datasets with LGA coverage
  const mapMarkers = filteredDatasets
    .filter((d) => d.lgaCoverage.length > 0)
    .slice(0, 20) // Limit to 20 markers for performance
    .map((dataset) => ({
      id: dataset.id,
      position: [
        9.9319 + (Math.random() - 0.5) * 1.5,
        6.547 + (Math.random() - 0.5) * 1.5,
      ] as [number, number],
      title: dataset.title,
      description: `${dataset.organisation.name} • ${dataset.downloadCount} downloads`,
    }));

  // Don't render until mounted on client
  if (!mounted) {
    return (
      <main className="flex-1">
        <div className="border-b bg-background">
          <Container size="wide" className="py-8">
            <h1 className="text-3xl font-bold">Explore Data on Map</h1>
            <p className="mt-2 text-muted-foreground">Loading...</p>
          </Container>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      {/* Header */}
      <div className="border-b bg-background">
        <Container size="wide" className="py-8">
          <h1 className="text-3xl font-bold">Explore Data on Map</h1>
          <p className="mt-2 text-muted-foreground">
            Visualize geospatial datasets across Niger State
          </p>
        </Container>
      </div>

      <Container size="wide" className="py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar - Filters & Dataset List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search datasets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="size-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Topic</label>
                  <Select 
                    value={selectedGroup} 
                    onValueChange={(value) => setSelectedGroup(value || "all")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Topics</SelectItem>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.slug}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Dataset List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="size-4" />
                  Datasets ({filteredDatasets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
                      ))}
                    </div>
                  ) : filteredDatasets.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="size-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No datasets found</p>
                    </div>
                  ) : (
                    filteredDatasets.map((dataset) => (
                      <button
                        key={dataset.id}
                        onClick={() => setSelectedDataset(dataset)}
                        className={`w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors ${
                          selectedDataset?.id === dataset.id
                            ? "border-primary bg-primary/5"
                            : ""
                        }`}
                      >
                        <p className="font-medium text-sm line-clamp-2 mb-1">
                          {dataset.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          {dataset.lgaCoverage.includes("All")
                            ? "All LGAs"
                            : `${dataset.lgaCoverage.length} LGAs`}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-[calc(100vh-200px)] border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">Loading map...</p>
                </div>
              }
            >
              <DatasetMap
                geoJsonData={nigerStateBoundary}
                markers={mapMarkers}
                height="calc(100vh - 200px)"
                showControls={true}
              />
            </Suspense>

            {/* Selected Dataset Info */}
            {selectedDataset && (
              <Card className="mt-4">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{selectedDataset.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedDataset.organisation.name}
                      </p>
                    </div>
                    <Button size="sm" onClick={() => setSelectedDataset(null)}>
                      Clear
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    {selectedDataset.description || "No description available."}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedDataset.groups.map((group) => (
                      <Badge key={group.id} variant="secondary">
                        {group.name}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">LGA Coverage</p>
                      <p className="text-sm font-medium">
                        {selectedDataset.lgaCoverage.includes("All")
                          ? "All 25 LGAs"
                          : `${selectedDataset.lgaCoverage.length} LGAs`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Downloads</p>
                      <p className="text-sm font-medium">
                        {selectedDataset.downloadCount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <Link href={`/dataportal/${selectedDataset.slug}`}>
                    <Button className="w-full">View Full Details</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
