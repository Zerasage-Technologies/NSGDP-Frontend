"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ActiveFilterChip {
  filterId: string;
  value: string;
  label: string;
}

interface ActiveFilterChipsProps {
  chips: ActiveFilterChip[];
  onRemove: (filterId: string, value: string) => void;
  onClearAll: () => void;
  className?: string;
}

export function ActiveFilterChips({
  chips,
  onRemove,
  onClearAll,
  className,
}: ActiveFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Active filters:</span>
        {chips.map((chip) => (
          <Badge
            key={`${chip.filterId}-${chip.value}`}
            variant="secondary"
            className="gap-1"
          >
            {chip.label}
            <button
              onClick={() => onRemove(chip.filterId, chip.value)}
              className="ml-1 rounded-full hover:bg-background/50"
              aria-label={`Remove ${chip.label} filter`}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
        {chips.length > 1 && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}
