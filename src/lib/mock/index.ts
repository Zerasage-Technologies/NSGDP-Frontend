// Centralized mock API - typed accessors that mimic the future REST API
// These will be replaced with real API calls when backend is ready

import type { Dataset, Organisation, Group, Visibility, DatasetStatus } from "@/types";
import { mockDatasets } from "./datasets";
import { mockOrganisations } from "./organisations";
import { mockGroups } from "./groups";
import { simulateDelay } from "./delay";

// ============================================================================
// DATASETS
// ============================================================================

export interface DatasetFilters {
  query?: string;
  groups?: string[];
  organisations?: string[];
  lgas?: string[];
  formats?: string[];
  visibility?: Visibility;
  status?: DatasetStatus;
  sort?: "recent" | "popular" | "name";
  page?: number;
  pageSize?: number;
}

export async function getDatasets(filters: DatasetFilters = {}) {
  await simulateDelay();

  let results = [...mockDatasets];

  // Apply filters
  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q) ||
        d.organisation.name.toLowerCase().includes(q)
    );
  }

  if (filters.groups?.length) {
    results = results.filter((d) =>
      d.groups.some((g) => filters.groups!.includes(g.slug))
    );
  }

  if (filters.organisations?.length) {
    results = results.filter((d) =>
      filters.organisations!.includes(d.organisation.slug)
    );
  }

  if (filters.lgas?.length) {
    results = results.filter((d) => {
      if (d.lgaCoverage.includes("All")) return true;
      return d.lgaCoverage.some((lga) => filters.lgas!.includes(lga));
    });
  }

  if (filters.formats?.length) {
    results = results.filter((d) =>
      d.formats.some((f) => filters.formats!.includes(f))
    );
  }

  if (filters.visibility) {
    results = results.filter((d) => d.visibility === filters.visibility);
  }

  if (filters.status) {
    results = results.filter((d) => d.status === filters.status);
  }

  // Sort
  const sort = filters.sort || "recent";
  if (sort === "recent") {
    results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } else if (sort === "popular") {
    results.sort((a, b) => b.downloadCount - a.downloadCount);
  } else if (sort === "name") {
    results.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Pagination
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 20;
  const total = results.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedResults = results.slice(start, end);

  return {
    data: paginatedResults,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function getDatasetBySlug(slug: string): Promise<Dataset | null> {
  await simulateDelay();
  return mockDatasets.find((d) => d.slug === slug) || null;
}

// ============================================================================
// ORGANISATIONS
// ============================================================================

export interface OrganisationFilters {
  sector?: string;
  query?: string;
}

export async function getOrganisations(filters: OrganisationFilters = {}) {
  await simulateDelay();

  let results = [...mockOrganisations];

  if (filters.sector) {
    results = results.filter((o) => o.sector === filters.sector);
  }

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.acronym?.toLowerCase().includes(q) ||
        o.description?.toLowerCase().includes(q)
    );
  }

  // Sort by name
  results.sort((a, b) => a.name.localeCompare(b.name));

  return results;
}

export async function getOrganisationBySlug(slug: string): Promise<Organisation | null> {
  await simulateDelay();
  return mockOrganisations.find((o) => o.slug === slug) || null;
}

// ============================================================================
// GROUPS
// ============================================================================

export async function getGroups() {
  await simulateDelay();
  return mockGroups.sort((a, b) => b.datasetCount - a.datasetCount);
}

export async function getGroupBySlug(slug: string): Promise<Group | null> {
  await simulateDelay();
  return mockGroups.find((g) => g.slug === slug) || null;
}

// ============================================================================
// SEARCH
// ============================================================================

export interface SearchResult {
  type: "dataset" | "organisation" | "group";
  item: Dataset | Organisation | Group;
}

export async function searchAll(query: string): Promise<SearchResult[]> {
  await simulateDelay();

  if (!query.trim()) return [];

  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  // Search datasets
  mockDatasets
    .filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q)
    )
    .slice(0, 10)
    .forEach((item) => results.push({ type: "dataset", item }));

  // Search organisations
  mockOrganisations
    .filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.acronym?.toLowerCase().includes(q)
    )
    .slice(0, 5)
    .forEach((item) => results.push({ type: "organisation", item }));

  // Search groups
  mockGroups
    .filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q)
    )
    .slice(0, 5)
    .forEach((item) => results.push({ type: "group", item }));

  return results;
}

// ============================================================================
// STATISTICS (for homepage)
// ============================================================================

export async function getStatistics() {
  await simulateDelay();

  return {
    datasets: mockDatasets.filter((d) => d.status === "published").length,
    organisations: mockOrganisations.length,
    downloads: mockDatasets.reduce((sum, d) => sum + d.downloadCount, 0),
    lgasCovered: 25,
  };
}
