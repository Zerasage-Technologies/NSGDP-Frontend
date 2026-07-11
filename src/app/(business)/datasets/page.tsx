"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Grid3x3, List, Database } from "lucide-react";
import { Container } from "@/components/layout/container";
import { DatasetCard } from "@/components/data/dataset-card";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { MobileFilterDrawer } from "@/components/filters/mobile-filter-drawer";
import { ActiveFilterChips } from "@/components/filters/active-filter-chips";
import { EmptyState } from "@/components/feedback/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/data/pagination";
import { DatasetCardSkeleton } from "@/components/feedback/skeletons";
import { getDatasets, getGroups, getOrganisations } from "@/lib/mock";
import type { Dataset } from "@/types";
import { NIGER_STATE_LGAS, FILE_FORMATS } from "@/lib/constants/core";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";
type SortOption = "recent" | "popular" | "name";

function DatasetsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Initialize filters from URL after mount
  const [filters, setFilters] = useState<Record<string, string[]>>({
    groups: [],
    organisations: [],
    lgas: [],
    formats: [],
  });

  const [sort, setSort] = useState<SortOption>("recent");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  // Sync filters from URL on mount
  useEffect(() => {
    if (searchParams) {
      setFilters({
        groups: searchParams.get("groups")?.split(",").filter(Boolean) || [],
        organisations: searchParams.get("organisations")?.split(",").filter(Boolean) || [],
        lgas: searchParams.get("lgas")?.split(",").filter(Boolean) || [],
        formats: searchParams.get("formats")?.split(",").filter(Boolean) || [],
      });
      setSort((searchParams.get("sort") as SortOption) || "recent");
      setPage(Number(searchParams.get("page")) || 1);
      setPageSize(Number(searchParams.get("limit")) || 20);
    }
  }, [searchParams]);

  // Fetch filter options
  const [groups, setGroups] = useState<Array<{ value: string; label: string }>>([]);
  const [orgs, setOrgs] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    // Load filter options
    const loadFilterOptions = async () => {
      const [groupsData, orgsData] = await Promise.all([
        getGroups(),
        getOrganisations(),
      ]);

      setGroups(
        groupsData.map((g) => ({ value: g.slug, label: g.name }))
      );
      setOrgs(
        orgsData.map((o) => ({ value: o.slug, label: o.name }))
      );
    };

    loadFilterOptions();
  }, []);

  useEffect(() => {
    // Fetch datasets based on filters
    const fetchDatasets = async () => {
      setLoading(true);
      const result = await getDatasets({
        groups: filters.groups,
        organisations: filters.organisations,
        lgas: filters.lgas,
        formats: filters.formats,
        sort,
        page,
        pageSize,
      });
      setDatasets(result.data);
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages);
      setLoading(false);
    };

    fetchDatasets();
  }, [filters, sort, page, pageSize]);

  // Update URL when filters change
  useEffect(() => {
    if (typeof window === "undefined") return; // Skip on server
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(","));
      }
    });
    if (sort !== "recent") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    if (pageSize !== 20) params.set("limit", String(pageSize));

    const newUrl = params.toString() ? `?${params.toString()}` : "/datasets";
    router.replace(newUrl, { scroll: false });
  }, [filters, sort, page, pageSize, router]);

  const handleFilterChange = (filterId: string, values: string[]) => {
    setFilters((prev) => ({ ...prev, [filterId]: values }));
    setPage(1); // Reset to page 1 when filters change
  };

  const removeFilter = (filterId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: prev[filterId].filter((v) => v !== value),
    }));
  };

  const clearAllFilters = () => {
    setFilters({ groups: [], organisations: [], lgas: [], formats: [] });
    setPage(1);
  };

  // Build active filter chips
  const activeChips = Object.entries(filters).flatMap(([filterId, values]) => {
    const labelMap: Record<string, Array<{ value: string; label: string }>> = {
      groups,
      organisations: orgs,
      lgas: NIGER_STATE_LGAS.map((lga) => ({ value: lga, label: lga })),
      formats: FILE_FORMATS.map((f) => ({ value: f, label: f })),
    };

    return values.map((value) => ({
      filterId,
      value,
      label: labelMap[filterId]?.find((o) => o.value === value)?.label || value,
    }));
  });

  const filterSections = [
    { id: "groups", label: "Topics", options: groups },
    { id: "organisations", label: "Organisations", options: orgs },
    {
      id: "lgas",
      label: "LGAs",
      options: NIGER_STATE_LGAS.map((lga) => ({ value: lga, label: lga })),
    },
    {
      id: "formats",
      label: "File Formats",
      options: FILE_FORMATS.map((f) => ({ value: f, label: f })),
    },
  ];

  return (
    <main className="flex-1">
      <div className="border-b bg-muted/40">
        <Container size="wide" className="py-8">
          <h1 className="text-3xl font-bold">Browse Datasets</h1>
          <p className="mt-2 text-muted-foreground">
            Explore {total} open datasets from Niger State
          </p>
        </Container>
      </div>

      <Container size="wide" className="py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                sections={filterSections}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Active Filters */}
            <ActiveFilterChips
              chips={activeChips}
              onRemove={removeFilter}
              onClearAll={clearAllFilters}
              className="mb-6"
            />

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <p className="text-sm text-muted-foreground">
                {loading ? "Loading..." : `${total} datasets found`}
              </p>

              <div className="flex items-center gap-2 sm:gap-4">
                <MobileFilterDrawer
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  sections={filterSections}
                />
                {/* Sort */}
                <Select value={sort} onValueChange={(v) => v && setSort(v as SortOption)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="flex rounded-lg border">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-l-lg",
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                    aria-label="Grid view"
                  >
                    <Grid3x3 className="size-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-r-lg border-l",
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                    aria-label="List view"
                  >
                    <List className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid" ? "sm:grid-cols-2" : "grid-cols-1"
                )}
              >
                {[...Array(6)].map((_, i) => (
                  <DatasetCardSkeleton key={i} />
                ))}
              </div>
            ) : datasets.length === 0 ? (
              <EmptyState
                icon={Database}
                title="No datasets found"
                description="Try adjusting your filters or search terms"
                action={{
                  label: "Clear all filters",
                  onClick: clearAllFilters,
                }}
              />
            ) : (
              <>
                <div
                  className={cn(
                    "grid gap-6",
                    viewMode === "grid" ? "sm:grid-cols-2" : "grid-cols-1"
                  )}
                >
                  {datasets.map((dataset) => (
                    <DatasetCard key={dataset.id} dataset={dataset} />
                  ))}
                </div>

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  total={total}
                  onPageChange={setPage}
                  onPageSizeChange={(s) => {
                    setPageSize(s);
                    setPage(1);
                  }}
                  className="mt-8"
                />
              </>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}

export default function DatasetsPage() {
  return (
    <Suspense fallback={
      <main className="flex-1">
        <div className="border-b bg-muted/40">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">Browse Datasets</h1>
            <p className="mt-2 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <DatasetsContent />
    </Suspense>
  );
}
