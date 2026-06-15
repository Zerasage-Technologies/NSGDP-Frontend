"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FilterSidebar } from "@/components/filters/filter-sidebar";

interface FilterSection {
  id: string;
  label: string;
  options: Array<{ value: string; label: string; count?: number }>;
}

interface MobileFilterDrawerProps {
  filters: Record<string, string[]>;
  onFilterChange: (filterId: string, values: string[]) => void;
  sections: FilterSection[];
}

export function MobileFilterDrawer({
  filters,
  onFilterChange,
  sections,
}: MobileFilterDrawerProps) {
  const activeCount = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="lg:hidden" aria-label="Open filters">
            <SlidersHorizontal className="size-4 mr-2" />
            Filters
            {activeCount > 0 && (
              <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {activeCount}
              </span>
            )}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter Datasets</DialogTitle>
        </DialogHeader>
        <FilterSidebar
          filters={filters}
          onFilterChange={onFilterChange}
          sections={sections}
        />
      </DialogContent>
    </Dialog>
  );
}
