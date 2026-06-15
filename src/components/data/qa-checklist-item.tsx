"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface QAChecklistItemProps {
  id: string;
  label: string;
  note?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function QAChecklistItem({
  id,
  label,
  note,
  checked,
  onCheckedChange,
  className,
}: QAChecklistItemProps) {
  return (
    <div className={cn("flex items-start gap-3 rounded-lg border p-3", className)}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </label>
        {note && (
          <p className="text-xs text-muted-foreground mt-1">{note}</p>
        )}
      </div>
    </div>
  );
}
