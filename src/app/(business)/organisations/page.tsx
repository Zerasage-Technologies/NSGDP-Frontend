"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Container } from "@/components/layout/container";
import { OrgCard } from "@/components/data/org-card";
import { Input } from "@/components/ui/input";
import { OrgCardSkeleton } from "@/components/feedback/skeletons";
import { getOrganisations } from "@/lib/mock";
import type { Organisation } from "@/types";
import { SECTORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function OrganisationsPage() {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [filteredOrgs, setFilteredOrgs] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrganisations = async () => {
      setLoading(true);
      const data = await getOrganisations();
      setOrganisations(data);
      setFilteredOrgs(data);
      setLoading(false);
    };

    fetchOrganisations();
  }, []);

  useEffect(() => {
    let filtered = organisations;

    if (selectedSector) {
      filtered = filtered.filter((org) => org.sector === selectedSector);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (org) =>
          org.name.toLowerCase().includes(query) ||
          org.acronym?.toLowerCase().includes(query) ||
          org.description?.toLowerCase().includes(query)
      );
    }

    setFilteredOrgs(filtered);
  }, [organisations, selectedSector, searchQuery]);

  // Count orgs per sector
  const sectorCounts = organisations.reduce((acc, org) => {
    acc[org.sector] = (acc[org.sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <main className="flex-1">
      <div className="border-b bg-muted/40">
        <Container size="wide" className="py-8">
          <h1 className="text-3xl font-bold">Organisations</h1>
          <p className="mt-2 text-muted-foreground">
            Browse data-contributing ministries, departments, and agencies
          </p>
        </Container>
      </div>

      <Container size="wide" className="py-8">
        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search organisations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Sector Filter Tabs */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedSector(null)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              selectedSector === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            All
            <span className="text-xs opacity-75">({organisations.length})</span>
          </button>
          {SECTORS.map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                selectedSector === sector
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {sector}
              <span className="text-xs opacity-75">
                ({sectorCounts[sector] || 0})
              </span>
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <OrgCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No organisations found</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOrgs.map((org) => (
              <OrgCard key={org.id} organisation={org} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
