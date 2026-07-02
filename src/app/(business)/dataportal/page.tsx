"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Database } from "lucide-react";
import { Container } from "@/components/layout/container";
import { GeoHealthDatasetCard } from "@/components/data/geohealth-dataset-card";
import { DatasetDetailModal } from "@/components/data/dataset-detail-modal";
import {
  AdvancedDatasetFilters,
  buildAdvancedFilterSections,
} from "@/components/filters/advanced-dataset-filters";
import { MobileFilterDrawer } from "@/components/filters/mobile-filter-drawer";
import { ActiveFilterChips } from "@/components/filters/active-filter-chips";
import { EmptyState } from "@/components/feedback/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/data/pagination";
import { DatasetCardSkeleton } from "@/components/feedback/skeletons";
import { getDatasets, getOrganisations } from "@/lib/mock";
import { DEFAULT_PORTAL_FILTERS } from "@/lib/constants/dataset-filters";
import type { Dataset, HealthCategory } from "@/types";

type SortOption = "recent" | "popular" | "name";

function DataportalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalDataset, setModalDataset] = useState<Dataset | null>(null);
  const [filters, setFilters] = useState<Record<string, string[]>>(DEFAULT_PORTAL_FILTERS);
  const [sort, setSort] = useState<SortOption>("recent");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [orgs, setOrgs] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    getOrganisations().then((data) =>
      setOrgs(data.map((o) => ({ value: o.slug, label: o.name })))
    );
  }, []);

  useEffect(() => {
    if (searchParams) {
      setPage(Number(searchParams.get("page")) || 1);
      setPageSize(Number(searchParams.get("limit")) || 20);
      setSort((searchParams.get("sort") as SortOption) || "recent");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const result = await getDatasets({
        organisations: filters.organisations,
        lgas: filters.lgas,
        formats: filters.formats,
        healthCategories: filters.categories.length
          ? (filters.categories as HealthCategory[])
          : undefined,
        diseases: filters.diseases,
        wards: filters.wards,
        facilities: filters.facilities,
        years: filters.years,
        programs: filters.programs,
        updateFrequency: filters.updateFrequency,
        statuses: filters.status,
        dataLicenses: filters.dataLicense,
        sort,
        page,
        pageSize,
      });
      setDatasets(result.data);
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages);
      setLoading(false);
    };
    fetch();
  }, [filters, sort, page, pageSize]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (sort !== "recent") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    if (pageSize !== 20) params.set("limit", String(pageSize));
    router.replace(params.toString() ? `/dataportal?${params}` : "/dataportal", { scroll: false });
  }, [sort, page, pageSize, router]);

  const filterSections = buildAdvancedFilterSections(orgs);

  const activeChips = Object.entries(filters).flatMap(([filterId, values]) =>
    values.map((value) => ({
      filterId,
      value,
      label: filterSections.find((s) => s.id === filterId)?.options.find((o) => o.value === value)?.label ?? value,
    }))
  );

  return (
    <main className="flex-1">
      <div className="border-b bg-muted/40">
        <Container size="wide" className="py-8">
          <h1 className="text-3xl font-bold">Health Data Portal</h1>
          <p className="mt-2 text-muted-foreground">
            Browse {total} health datasets from NSPHCDA and partner organisations
          </p>
        </Container>
      </div>

      <Container size="wide" className="py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20">
              <AdvancedDatasetFilters
                filters={filters}
                onFilterChange={(id, vals) => {
                  setFilters((p) => ({ ...p, [id]: vals }));
                  setPage(1);
                }}
                orgs={orgs}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <ActiveFilterChips
              chips={activeChips}
              onRemove={(id, val) =>
                setFilters((p) => ({ ...p, [id]: p[id].filter((v) => v !== val) }))
              }
              onClearAll={() => setFilters(DEFAULT_PORTAL_FILTERS)}
              className="mb-4"
            />

            <div className="flex items-center justify-between mb-6 gap-4">
              <p className="text-sm font-medium">
                {loading ? "Loading…" : `${total} datasets found`}
              </p>
              <div className="flex items-center gap-2">
                <MobileFilterDrawer
                  filters={filters}
                  onFilterChange={(id, vals) => {
                    setFilters((p) => ({ ...p, [id]: vals }));
                    setPage(1);
                  }}
                  sections={filterSections}
                />
                <Select value={sort} onValueChange={(v) => v && setSort(v as SortOption)}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Downloaded</SelectItem>
                    <SelectItem value="name">Alphabetical A–Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <DatasetCardSkeleton key={i} />
                ))}
              </div>
            ) : datasets.length === 0 ? (
              <EmptyState
                icon={Database}
                title="No datasets found"
                description="Try adjusting your filter selections"
                action={{
                  label: "Clear filters",
                  onClick: () => setFilters(DEFAULT_PORTAL_FILTERS),
                }}
              />
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {datasets.map((d) => (
                    <GeoHealthDatasetCard
                      key={d.id}
                      dataset={d}
                      onInfoClick={setModalDataset}
                    />
                  ))}
                </div>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  total={total}
                  onPageChange={setPage}
                  onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
                  className="mt-8"
                />
              </>
            )}
          </div>
        </div>
      </Container>

      <DatasetDetailModal
        dataset={modalDataset}
        open={!!modalDataset}
        onOpenChange={(o) => !o && setModalDataset(null)}
      />
    </main>
  );
}

export default function DataportalPage() {
  return (
    <Suspense>
      <DataportalContent />
    </Suspense>
  );
}
