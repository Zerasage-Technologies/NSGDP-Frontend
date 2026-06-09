import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VisibilityBadge } from "@/components/data/visibility-badge";
import { StatusBadge } from "@/components/data/status-badge";
import { RoleBadge } from "@/components/data/role-badge";

const STATS = [
  { label: "Datasets", value: "—" },
  { label: "Organisations", value: "—" },
  { label: "Downloads", value: "—" },
  { label: "LGAs Covered", value: "25" },
];

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero (PUB-01) */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-primary-foreground/80">
            Niger State Government
          </p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            Open Data Portal
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/90">
            Niger State&apos;s official open data repository for geospatial and
            health datasets.
          </p>

          <form className="mx-auto mt-8 flex max-w-2xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search datasets by keyword, LGA, or topic…"
                className="h-12 bg-background pl-10 text-foreground"
                aria-label="Search datasets"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 bg-teal text-teal-foreground hover:bg-teal/90">
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Topline stats */}
      <section className="border-b bg-secondary/40">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Design-system proof (temporary baseline marker) */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-lg font-semibold">Design system — baseline check</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Foundation scaffolded. Temporary section verifying tokens &amp;
          components render correctly.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <VisibilityBadge visibility="public" />
          <VisibilityBadge visibility="restricted" />
          <VisibilityBadge visibility="private" />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status="draft" />
          <StatusBadge status="under_review" />
          <StatusBadge status="needs_revision" />
          <StatusBadge status="published" />
          <StatusBadge status="rejected" />
          <StatusBadge status="archived" />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <RoleBadge role="registered" />
          <RoleBadge role="contributor" />
          <RoleBadge role="org_admin" />
          <RoleBadge role="super_admin" />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Danger</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </section>
    </main>
  );
}
