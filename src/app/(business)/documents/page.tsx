"use client";

import { useState, useMemo } from "react";
import { Search, BookOpen, Lock } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DocumentCard } from "@/components/data/document-card";
import { mockDocuments } from "@/lib/mock/documents";
import type { DocumentCategory } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORIES: Array<{ id: DocumentCategory | "all"; label: string }> = [
  { id: "all",        label: "All" },
  { id: "policy",     label: "Policies" },
  { id: "sop",        label: "SOPs" },
  { id: "report",     label: "Reports" },
  { id: "evaluation", label: "Evaluations" },
  { id: "guideline",  label: "Guidelines" },
  { id: "research",   label: "Research" },
  { id: "archive",    label: "Archive" },
];

export default function DocumentsPage() {
  const [category, setCategory] = useState<DocumentCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [showRestricted, setShowRestricted] = useState(false);

  const filtered = useMemo(() => {
    return mockDocuments.filter((doc) => {
      if (category !== "all" && doc.category !== category) return false;
      if (!showRestricted && doc.restricted) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          doc.title.toLowerCase().includes(q) ||
          doc.description?.toLowerCase().includes(q) ||
          doc.tags?.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [category, query, showRestricted]);

  return (
    <main className="flex-1">
      <div className="border-b bg-muted/40">
        <Container className="py-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="size-7 text-primary" />
            <h1 className="text-3xl font-bold">Document Repository</h1>
          </div>
          <p className="text-muted-foreground">
            Policies, SOPs, research reports, evaluation findings, and historical archives for Niger State health data governance.
          </p>
        </Container>
      </div>

      <Container className="py-8">
        <div className="flex flex-col gap-5">
          {/* Search + filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search documents…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant={showRestricted ? "default" : "outline"}
              size="sm"
              onClick={() => setShowRestricted(!showRestricted)}
            >
              <Lock className="size-3.5 mr-1.5" />
              Show restricted
            </Button>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium border transition-colors",
                  category === cat.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted border-border"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results */}
          <p className="text-sm text-muted-foreground">
            {filtered.length} document{filtered.length !== 1 ? "s" : ""} found
          </p>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center text-muted-foreground gap-3">
              <BookOpen className="size-12 opacity-30" />
              <p className="font-medium">No documents found</p>
              <p className="text-sm">Try changing your search or category filter</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
