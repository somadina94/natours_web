"use client";

import { useMemo } from "react";
import Map, { Layer, Marker, NavigationControl, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "lucide-react";
import type { Tour, TourLocation } from "@/types/tour";
import { Card } from "@/components/ui/card";

type LngLat = [number, number];

function collectPoints(tour: Tour): LngLat[] {
  const pts: LngLat[] = [];
  const seen = new Set<string>();
  const push = (p: LngLat) => {
    const key = `${p[0].toFixed(5)},${p[1].toFixed(5)}`;
    if (seen.has(key)) return;
    seen.add(key);
    pts.push(p);
  };
  const start = tour.startLocation?.coordinates;
  if (start && start.length >= 2) {
    push([start[0]!, start[1]!]);
  }
  const sorted = [...(tour.locations ?? [])].sort(
    (a, b) => (a.day ?? 0) - (b.day ?? 0),
  );
  for (const loc of sorted) {
    if (loc.coordinates?.length >= 2) {
      push([loc.coordinates[0]!, loc.coordinates[1]!]);
    }
  }
  return pts;
}

function lineFeature(locations: TourLocation[]) {
  const coordinates = [...locations]
    .sort((a, b) => (a.day ?? 0) - (b.day ?? 0))
    .filter((l) => l.coordinates?.length >= 2)
    .map((l) => [l.coordinates[0]!, l.coordinates[1]!] as LngLat);
  if (coordinates.length < 2) return null;
  return {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        properties: {},
        geometry: {
          type: "LineString" as const,
          coordinates,
        },
      },
    ],
  };
}

export function TourMap({ tour }: { tour: Tour }) {
  const points = useMemo(() => collectPoints(tour), [tour]);
  const line = useMemo(() => {
    if (!tour.locations?.length) return null;
    return lineFeature(tour.locations);
  }, [tour.locations]);

  const hasGeometry = points.length > 0;

  const initialView = useMemo(() => {
    if (points.length) {
      const lngs = points.map((p) => p[0]);
      const lats = points.map((p) => p[1]);
      const lng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
      const lat = (Math.min(...lats) + Math.max(...lats)) / 2;
      const span = Math.max(
        Math.max(...lngs) - Math.min(...lngs),
        Math.max(...lats) - Math.min(...lats),
      );
      const zoom = span > 8 ? 3 : span > 3 ? 4 : span > 1 ? 6 : 8;
      return { longitude: lng, latitude: lat, zoom };
    }
    return { longitude: -115, latitude: 51, zoom: 4 };
  }, [points]);

  return (
    <Card className="overflow-hidden border-border/60 shadow-md">
      <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3 text-sm font-medium">
        <MapPin className="size-4 text-primary" aria-hidden />
        Route overview
      </div>
      <div className="relative h-[min(52vh,520px)] w-full">
        {!hasGeometry ? (
          <div
            className="flex h-full flex-col items-center justify-center gap-2 bg-muted/40 p-6 text-center text-sm text-muted-foreground"
            role="status"
          >
            <MapPin className="size-8 opacity-50" aria-hidden />
            Map preview is unavailable for this tour (no coordinates yet).
          </div>
        ) : (
          <Map
            initialViewState={initialView}
            style={{ width: "100%", height: "100%" }}
            mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
            reuseMaps
          >
            <NavigationControl position="top-right" showCompass={false} />
            {line ? (
              <Source id="route" type="geojson" data={line}>
                <Layer
                  id="route-line"
                  type="line"
                  paint={{
                    "line-color": "#28b487",
                    "line-width": 3,
                    "line-opacity": 0.9,
                  }}
                />
              </Source>
            ) : null}
            {points.map((p, i) => (
              <Marker
                key={`${p[0]}-${p[1]}-${i}`}
                longitude={p[0]}
                latitude={p[1]}
                anchor="bottom"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <MapPin className="size-4" aria-hidden />
                </span>
              </Marker>
            ))}
          </Map>
        )}
      </div>
    </Card>
  );
}
