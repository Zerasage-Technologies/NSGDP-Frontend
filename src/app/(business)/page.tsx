import Link from "next/link";
import { Search, Lock, FileText, BarChart3 } from "lucide-react";
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
      {/* Hero Section */}
      <section className="hero-section bg-gradient-to-b from-primary/8 via-transparent to-transparent">
        <Container className="py-16 sm:py-24">
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Government Data Platform
              </p>
              <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight">
                Explore Niger State Data
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Access verified, up-to-date datasets from Niger State Government to support evidence-based planning, research, and decision-making.
              </p>
            </div>

            {/* Search Bar */}
            <form className="mx-auto w-full max-w-3xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search datasets by keyword, region, or topic…"
                  className="h-14 bg-background pl-12 pr-4 text-base shadow-sm border-primary/20 focus:border-primary/50"
                  aria-label="Search datasets"
                />
                <Button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-4 pt-4">
              <div className="stat-card text-center space-y-1">
                <div className="text-4xl font-bold text-primary">{stats.datasets}</div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Active Datasets</p>
              </div>
              <div className="stat-card text-center space-y-1">
                <div className="text-4xl font-bold text-primary">{stats.organisations}</div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Organizations</p>
              </div>
              <div className="stat-card text-center space-y-1">
                <div className="text-4xl font-bold text-primary">{stats.downloads.toLocaleString()}</div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Downloads</p>
              </div>
              <div className="stat-card text-center space-y-1">
                <div className="text-4xl font-bold text-primary">{stats.lgasCovered}</div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">LGAs Covered</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Credibility & Trust Info Bar */}
      <section className="credibility-section border-b bg-accent/40">
        <Container size="wide">
          <div className="grid gap-6 sm:gap-8 py-10 sm:grid-cols-3">
            <div className="trust-feature flex gap-4">
              <div className="flex-shrink-0">
                <Lock className="size-5 text-primary mt-0.5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Verified & Trustworthy</h3>
                <p className="text-sm text-muted-foreground mt-1">All datasets are sourced from official government agencies and verified for accuracy.</p>
              </div>
            </div>
            <div className="trust-feature flex gap-4">
              <div className="flex-shrink-0">
                <FileText className="size-5 text-primary mt-0.5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Open Licenses</h3>
                <p className="text-sm text-muted-foreground mt-1">All data is published under open licenses (CC BY, OGL) for free reuse.</p>
              </div>
            </div>
            <div className="trust-feature flex gap-4">
              <div className="flex-shrink-0">
                <BarChart3 className="size-5 text-primary mt-0.5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Regularly Updated</h3>
                <p className="text-sm text-muted-foreground mt-1">Datasets are maintained and updated to reflect the latest information.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Datasets */}
      <section className="featured-section py-16 sm:py-20">
        <Container size="wide">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">Popular Datasets</h2>
              <p className="text-muted-foreground mt-2">Most downloaded and viewed datasets this month</p>
            </div>
            <Link href="/datasets">
              <Button variant="outline" className="w-full sm:w-auto">
                View All Datasets
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDatasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        </Container>
      </section>

      {/* Browse by Topic */}
      <section className="topics-section py-16 sm:py-20 bg-secondary/30">
        <Container size="wide">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">Browse by Topic</h2>
              <p className="text-muted-foreground mt-2">Explore datasets organized by thematic areas and sectors</p>
            </div>
            <Link href="/groups">
              <Button variant="outline" className="w-full sm:w-auto">
                View All Topics
              </Button>
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {groups.slice(0, 10).map((group) => (
              <GroupTile key={group.id} group={group} />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-16 sm:py-20">
        <Container>
          <div className="rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-8 sm:p-12 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Have Data to Share?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Government agencies and organizations can publish datasets on this portal to increase accessibility and transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
              <Link href="/register">
                <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                  Submit Dataset
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
