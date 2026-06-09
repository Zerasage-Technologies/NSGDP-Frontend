import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/layout/container";
import { DatasetCard } from "@/components/data/dataset-card";
import { GroupTile } from "@/components/data/group-tile";
import { getDatasets, getGroups, getStatistics } from "@/lib/mock";

export default async function HomePage() {
  // Fetch data
  const stats = await getStatistics();
  const { data: featuredDatasets } = await getDatasets({ sort: "popular", pageSize: 6 });
  const groups = await getGroups();

  return (
    <main className="flex-1">
      {/* Hero (PUB-01) */}
      <section className="bg-primary text-primary-foreground">
        <Container className="py-20 text-center">
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
        </Container>
      </section>

      {/* Topline stats */}
      <section className="border-b bg-secondary/40">
        <Container size="wide">
          <div className="grid grid-cols-2 gap-4 py-8 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.datasets}</div>
              <div className="text-sm text-muted-foreground">Datasets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.organisations}</div>
              <div className="text-sm text-muted-foreground">Organisations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.downloads.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.lgasCovered}</div>
              <div className="text-sm text-muted-foreground">LGAs Covered</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Datasets */}
      <section className="py-12">
        <Container size="wide">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular Datasets</h2>
            <Button variant="outline">
              <a href="/datasets">View All</a>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDatasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        </Container>
      </section>

      {/* Browse by Topic */}
      <section className="py-12 bg-muted/40">
        <Container size="wide">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Browse by Topic</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Explore datasets organized by thematic areas
              </p>
            </div>
            <Button variant="outline">
              <a href="/groups">All Topics</a>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {groups.slice(0, 10).map((group) => (
              <GroupTile key={group.id} group={group} />
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
