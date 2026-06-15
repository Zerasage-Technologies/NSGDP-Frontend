"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Play,
  BookOpen,
  Wrench,
  Download,
  Map,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const heroSlides = [
  {
    title: "Empowering Niger State Through Geospatial Learning",
    subtitle:
      "Build skills in GIS, health data analysis, and portal tools with curated tutorials and sample datasets.",
    cta: { label: "Explore Resources", href: "#resources" },
    gradient: "from-primary via-primary/90 to-emerald-800",
  },
  {
    title: "GIS for Health — From Maps to Action",
    subtitle:
      "Learn how geospatial analysis supports disease surveillance, facility planning, and population health programmes.",
    cta: { label: "Watch Tutorials", href: "#resources" },
    gradient: "from-emerald-800 via-primary to-teal-900",
  },
];

const videoTutorials = [
  { title: "Introduction to NSPHCDA Data Portal", duration: "12 min", tags: ["Portal", "Basics"] },
  { title: "Navigating the Data Repository", duration: "18 min", tags: ["Data", "Search"] },
  { title: "Filtering Datasets by LGA and Category", duration: "15 min", tags: ["Filters", "LGA"] },
  { title: "Downloading and Citing Health Datasets", duration: "10 min", tags: ["Download", "Citation"] },
  { title: "Reading Disease Burden Maps", duration: "22 min", tags: ["GIS", "Maps"] },
  { title: "Health Facility Map Walkthrough", duration: "16 min", tags: ["Facilities", "Maps"] },
];

const ebooks = [
  {
    title: "QGIS Training Manual",
    description: "Comprehensive guide to QGIS for beginners and intermediate users.",
    pages: 420,
    tags: ["QGIS", "GIS"],
    url: "https://docs.qgis.org",
  },
  {
    title: "WHO Geospatial Toolkit for Public Health",
    description: "WHO framework for applying geospatial methods in public health programmes.",
    pages: 186,
    tags: ["WHO", "Public Health"],
    url: "https://www.who.int",
  },
  {
    title: "GRID3 Nigeria Geospatial Data Documentation",
    description: "Population and boundary data standards for Nigeria geospatial projects.",
    pages: 94,
    tags: ["GRID3", "Population"],
    url: "https://grid3.org",
  },
  {
    title: "PostGIS in Action",
    description: "Spatial database fundamentals for storing and querying health geodata.",
    pages: 512,
    tags: ["PostGIS", "Database"],
    url: "https://postgis.net",
  },
];

const coreTools = [
  {
    name: "QGIS",
    icon: Map,
    role: "Primary desktop GIS for visualising, editing, and analysing health geodata downloaded from the portal.",
    useCase: "Map malaria case clusters by LGA, overlay facility locations, and export maps for briefing packs.",
  },
  {
    name: "PostgreSQL / PostGIS",
    icon: Wrench,
    role: "Spatial database backend for storing boundary layers, facility registries, and aggregated health indicators.",
    useCase: "Run spatial queries to find facilities within 5 km of high-burden wards for outreach planning.",
  },
];

const sampleDatasets = [
  { title: "Sample LGA Boundaries (GeoJSON)", format: "GeoJSON", size: "2.4 MB" },
  { title: "Mock Malaria Cases by LGA (CSV)", format: "CSV", size: "48 KB" },
  { title: "Sample PHC Facility Points", format: "GeoJSON", size: "156 KB" },
  { title: "Population Estimates Template", format: "XLSX", size: "32 KB" },
];

const learningPath = [
  {
    stage: "GIS Basics",
    description: "Understand coordinates, layers, and map projections.",
    resources: ["QGIS Training Manual Ch. 1–3", "Intro to NSPHCDA Data Portal video"],
  },
  {
    stage: "Intermediate Geospatial",
    description: "Spatial joins, choropleth maps, and buffer analysis.",
    resources: ["QGIS Training Manual Ch. 4–8", "Reading Disease Burden Maps"],
  },
  {
    stage: "Health Data Analysis",
    description: "Combine health indicators with population and facility data.",
    resources: ["WHO Geospatial Toolkit", "Mock Malaria Cases sample"],
  },
  {
    stage: "Platform Admin",
    description: "Submit datasets, manage access, and use analytics dashboards.",
    resources: ["Submit Data guide", "Navigating the Data Repository"],
  },
];

export default function LearningPage() {
  const [slide, setSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const prevSlide = () => setSlide((s) => (s === 0 ? heroSlides.length - 1 : s - 1));
  const nextSlide = () => setSlide((s) => (s === heroSlides.length - 1 ? 0 : s + 1));

  const handleMockDownload = (title: string) => {
    toast.success(`Download started: ${title}`);
  };

  return (
    <main className="flex-1">
      {/* Hero carousel */}
      <section className="relative overflow-hidden border-b">
        <div className={`absolute inset-0 bg-gradient-to-br ${heroSlides[slide].gradient}`} />
        <Container className="relative py-16 sm:py-24">
          <div className="max-w-2xl space-y-6 text-primary-foreground">
            <h1 className="text-4xl font-bold sm:text-5xl">{heroSlides[slide].title}</h1>
            <p className="text-lg text-primary-foreground/90">{heroSlides[slide].subtitle}</p>
            <Link href={heroSlides[slide].cta.href}>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                {heroSlides[slide].cta.label}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
          <div className="absolute right-4 bottom-4 flex items-center gap-3 sm:right-8 sm:bottom-8">
            <Button
              variant="outline"
              size="icon"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <div className="flex gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlide(i)}
                  className={`size-2.5 rounded-full transition-colors ${
                    i === slide ? "bg-white" : "bg-white/40"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Search */}
      <section className="border-b bg-muted/40 py-6">
        <Container>
          <form
            className="relative mx-auto max-w-xl"
            onSubmit={(e) => {
              e.preventDefault();
              toast.info(`Searching tutorials for "${searchQuery || "all topics"}"…`);
            }}
          >
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tutorials, guides, and tools…"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </Container>
      </section>

      {/* Tabs */}
      <section id="resources" className="py-12 sm:py-16">
        <Container size="wide">
          <Tabs defaultValue="video">
            <TabsList className="mb-8 flex h-auto w-full flex-wrap justify-start gap-1">
              <TabsTrigger value="video">Video Tutorials</TabsTrigger>
              <TabsTrigger value="ebooks">E-Books & Guides</TabsTrigger>
              <TabsTrigger value="tools">Core Tools</TabsTrigger>
              <TabsTrigger value="samples">Sample Data & Tutorials</TabsTrigger>
              <TabsTrigger value="path">Learning Path</TabsTrigger>
            </TabsList>

            {/* Video */}
            <TabsContent value="video" className="space-y-8">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle>Featured Playlist — QGIS & Geospatial Analysis</CardTitle>
                  <CardDescription>
                    24-video YouTube playlist covering GIS fundamentals through health spatial analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button>
                      <Play className="size-4" />
                      Watch Playlist
                      <ExternalLink className="size-3 ml-1" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {videoTutorials.map((video) => (
                  <Card key={video.title}>
                    <div className="mx-(--card-spacing) mb-0 flex h-32 items-center justify-center rounded-lg bg-muted">
                      <Play className="size-10 text-muted-foreground/50" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-base">{video.title}</CardTitle>
                      <CardDescription>{video.duration}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {video.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" variant="outline">
                        Watch
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* E-Books */}
            <TabsContent value="ebooks">
              <div className="grid gap-6 sm:grid-cols-2">
                {ebooks.map((book) => (
                  <Card key={book.title}>
                    <CardHeader>
                      <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="size-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{book.title}</CardTitle>
                      <CardDescription className="leading-relaxed">
                        {book.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline">{book.pages} pages</Badge>
                        {book.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <a href={book.url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline">
                          Access Resource
                          <ExternalLink className="size-3" />
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Core Tools */}
            <TabsContent value="tools">
              <div className="grid gap-6 md:grid-cols-2">
                {coreTools.map((tool) => (
                  <Card key={tool.name}>
                    <CardHeader>
                      <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <tool.icon className="size-5 text-primary" />
                      </div>
                      <CardTitle>{tool.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Role in Project
                        </p>
                        <p className="text-sm leading-relaxed">{tool.role}</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Example Use Case
                        </p>
                        <p className="text-sm leading-relaxed">{tool.useCase}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Sample Data */}
            <TabsContent value="samples">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {sampleDatasets.map((sample) => (
                  <Card key={sample.title}>
                    <CardHeader>
                      <CardTitle className="text-base leading-snug">{sample.title}</CardTitle>
                      <CardDescription>
                        {sample.format} · {sample.size}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleMockDownload(sample.title)}
                      >
                        <Download className="size-4" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Learning Path */}
            <TabsContent value="path">
              <div className="relative space-y-0">
                {learningPath.map((stage, i) => (
                  <div key={stage.stage} className="relative flex gap-6 pb-10 last:pb-0">
                    {i < learningPath.length - 1 && (
                      <div className="absolute left-4 top-10 h-[calc(100%-2.5rem)] w-0.5 bg-border" />
                    )}
                    <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {i + 1}
                    </div>
                    <Card className="flex-1">
                      <CardHeader>
                        <CardTitle>{stage.stage}</CardTitle>
                        <CardDescription>{stage.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {stage.resources.map((r) => (
                            <li key={r}>• {r}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Container>
      </section>
    </main>
  );
}
