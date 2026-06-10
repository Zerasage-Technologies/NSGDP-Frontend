"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { GeoJSON as GeoJSONType } from "geojson";
import { Loader2, Maximize2, Minimize2, Layers, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  { ssr: false }
);

// Niger State coordinates (approximate center)
const NIGER_STATE_CENTER: [number, number] = [9.9319, 6.5470];
const DEFAULT_ZOOM = 8;

interface DatasetMapProps {
  geoJsonData?: GeoJSONType.FeatureCollection | GeoJSONType.Feature;
  markers?: Array<{
    id: string;
    position: [number, number];
    title: string;
    description?: string;
  }>;
  lgaCoverage?: string[];
  height?: string;
  showControls?: boolean;
}

export function DatasetMap({
  geoJsonData,
  markers,
  lgaCoverage,
  height = "500px",
  showControls = true,
}: DatasetMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [baseLayer, setBaseLayer] = useState<"osm" | "satellite">("osm");
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Import Leaflet CSS
    import("leaflet/dist/leaflet.css").then(() => {
      setMapReady(true);
      setLoading(false);
    });
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const baseLayers = {
    osm: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },
  };

  if (loading || !mapReady) {
    return (
      <Card className="flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <Loader2 className="size-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </Card>
    );
  }

  return (
    <div
      className={`relative ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-background"
          : ""
      }`}
    >
      <Card
        className="overflow-hidden"
        style={{ height: isFullscreen ? "100vh" : height }}
      >
        {/* Map Controls */}
        {showControls && (
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            {/* Layer Switcher */}
            <Button
              size="sm"
              variant="secondary"
              className="shadow-lg"
              onClick={() => setBaseLayer(baseLayer === "osm" ? "satellite" : "osm")}
            >
              <Layers className="size-4 mr-2" />
              {baseLayer === "osm" ? "Satellite" : "Map"}
            </Button>

            {/* Fullscreen Toggle */}
            <Button
              size="sm"
              variant="secondary"
              className="shadow-lg"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="size-4" />
              ) : (
                <Maximize2 className="size-4" />
              )}
            </Button>
          </div>
        )}

        {/* LGA Coverage Badge */}
        {lgaCoverage && lgaCoverage.length > 0 && (
          <div className="absolute bottom-4 left-4 z-[1000]">
            <div className="bg-background/95 backdrop-blur rounded-lg px-3 py-2 shadow-lg border">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="size-4 text-primary" />
                <span className="font-medium">
                  {lgaCoverage.includes("All")
                    ? "All 25 LGAs"
                    : `${lgaCoverage.length} LGAs covered`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Map */}
        <MapContainer
          center={NIGER_STATE_CENTER}
          zoom={DEFAULT_ZOOM}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <ZoomControl position="bottomright" />

          {/* Base Layer */}
          <TileLayer
            url={baseLayers[baseLayer].url}
            attribution={baseLayers[baseLayer].attribution}
          />

          {/* GeoJSON Layer */}
          {geoJsonData && (
            <GeoJSON
              data={geoJsonData}
              style={{
                color: "#3b82f6",
                weight: 2,
                fillOpacity: 0.2,
                fillColor: "#3b82f6",
              }}
              onEachFeature={(feature, layer) => {
                if (feature.properties) {
                  const popupContent = `
                    <div class="p-2">
                      <h3 class="font-bold mb-1">${feature.properties.name || "Location"}</h3>
                      ${
                        feature.properties.description
                          ? `<p class="text-sm">${feature.properties.description}</p>`
                          : ""
                      }
                    </div>
                  `;
                  layer.bindPopup(popupContent);
                }
              }}
            />
          )}

          {/* Point Markers */}
          {markers &&
            markers.map((marker) => (
              <Marker key={marker.id} position={marker.position}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold mb-1">{marker.title}</h3>
                    {marker.description && (
                      <p className="text-sm text-muted-foreground">
                        {marker.description}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </Card>

      {/* Fullscreen Overlay for ESC instruction */}
      {isFullscreen && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
          <div className="bg-background/95 backdrop-blur rounded-lg px-4 py-2 shadow-lg border text-sm">
            Press <kbd className="px-2 py-1 bg-muted rounded">ESC</kbd> or click{" "}
            <Minimize2 className="inline size-3" /> to exit fullscreen
          </div>
        </div>
      )}
    </div>
  );
}
