"use client";

import type { Dataset } from "@/types";
import { HEALTH_CATEGORY_LABELS } from "@/lib/constants/health";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

interface DatasetDetailModalProps {
  dataset: Dataset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DatasetDetailModal({ dataset, open, onOpenChange }: DatasetDetailModalProps) {
  if (!dataset) return null;

  const totalSize = dataset.resources?.reduce((s, r) => s + r.sizeBytes, 0) ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dataset.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          <section>
            <h3 className="font-semibold mb-2">Basic Information</h3>
            <dl className="grid grid-cols-2 gap-2">
              <dt className="text-muted-foreground">Owner</dt>
              <dd>{dataset.organisation.name}</dd>
              <dt className="text-muted-foreground">Format</dt>
              <dd>{dataset.formats.join(", ")}</dd>
              <dt className="text-muted-foreground">File Size</dt>
              <dd>{totalSize > 0 ? formatBytes(totalSize) : "—"}</dd>
            </dl>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Technical Details</h3>
            <dl className="grid grid-cols-2 gap-2">
              <dt className="text-muted-foreground">Type</dt>
              <dd className="capitalize">{dataset.dataType ?? "attribute"}</dd>
              <dt className="text-muted-foreground">Source</dt>
              <dd>{dataset.source ?? "—"}</dd>
              <dt className="text-muted-foreground">Data Custodian</dt>
              <dd>{dataset.custodian ?? dataset.organisation.name}</dd>
              <dt className="text-muted-foreground">Update Frequency</dt>
              <dd>{dataset.updateFrequency ?? "—"}</dd>
              <dt className="text-muted-foreground">Portal Source</dt>
              <dd>{dataset.portalSource ?? "NSPHCDA Data Portal"}</dd>
              <dt className="text-muted-foreground">Category</dt>
              <dd>
                <Badge variant="secondary">
                  {HEALTH_CATEGORY_LABELS[dataset.healthCategory]}
                </Badge>
              </dd>
            </dl>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{dataset.description}</p>
          </section>

          {dataset.citation && (
            <section>
              <h3 className="font-semibold mb-2">Citation</h3>
              <p className="italic text-muted-foreground">{dataset.citation}</p>
            </section>
          )}

          {dataset.keyAttributes && dataset.keyAttributes.length > 0 && (
            <section>
              <h3 className="font-semibold mb-2">Key Attributes</h3>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-xs">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left">Field Name</th>
                      <th className="px-3 py-2 text-left">Example Value</th>
                      <th className="px-3 py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.keyAttributes.map((attr) => (
                      <tr key={attr.fieldName} className="border-t">
                        <td className="px-3 py-2 font-mono">{attr.fieldName}</td>
                        <td className="px-3 py-2">{attr.exampleValue}</td>
                        <td className="px-3 py-2 text-muted-foreground">{attr.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
