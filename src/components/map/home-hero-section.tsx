"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

const HomeHeroMap = dynamic(
  () => import("@/components/map/home-hero-map").then((mod) => mod.HomeHeroMap),
  { ssr: false }
);

export function HomeHeroSection() {
  return (
    <section className="relative h-[min(100vh,900px)] min-h-[560px]">
      <HomeHeroMap />
      <div className="pointer-events-none absolute inset-0 z-[600] bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
      <div className="absolute inset-0 z-[700] flex items-center">
        <Container className="pointer-events-auto py-16">
          <div className="max-w-2xl space-y-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#E8A020]">
              {BRAND.heroSuperLabel}
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Welcome to Niger State Health and Geospatial Data Portal
            </h1>
            <p className="text-lg text-white/85 sm:text-xl">
              Centralised geospatial health data for evidence-based planning, disease
              surveillance, and equitable service delivery across all 25 Local Government
              Areas.
            </p>
            <Link href="/dataportal">
              <Button size="lg" className="mt-2 bg-[#E8A020] text-foreground hover:bg-[#E8A020]/90">
                Browse Repository
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </section>
  );
}
