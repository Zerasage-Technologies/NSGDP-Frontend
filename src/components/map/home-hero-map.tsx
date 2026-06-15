"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  { ssr: false }
);

const NIGER_STATE_CENTER: [number, number] = [9.6, 6.5];
const DEFAULT_ZOOM = 7;

export function HomeHeroMap() {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet") as typeof import("leaflet");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
    setMapReady(true);
  }, []);

  if (!mapReady) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={NIGER_STATE_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        touchZoom={false}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <ZoomControl position="topleft" />
      </MapContainer>

      {/* Niger State highlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[400]"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 h-[52%] w-[42%] -translate-x-1/2 -translate-y-[45%] rounded-[38%] border-2 border-primary/50 bg-primary/20 shadow-[inset_0_0_60px_rgba(26,71,49,0.15)]" />
      </div>

      {/* Population badge */}
      <div className="absolute top-4 right-4 z-[500] rounded-lg border bg-background/95 px-4 py-2 shadow-lg backdrop-blur">
        <p className="text-xs font-medium text-muted-foreground">Niger State Population</p>
        <p className="text-lg font-bold text-primary">5.9M</p>
      </div>
    </div>
  );
}
