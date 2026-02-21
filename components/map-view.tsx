"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  [key: string]: unknown;
};

/** Round to 3 decimals (~111m) to treat as same location. */
function locationKey(lat: number, lng: number): string {
  return `${lat.toFixed(3)},${lng.toFixed(3)}`;
}

/**
 * Spread markers that share the same location into a small circle so they don't stack.
 * Uses ~40m radius in degrees at mid-latitudes.
 */
function spreadOverlappingMarkers(markers: MapMarker[]): MapMarker[] {
  const SPREAD_DEGREES = 0.0004; // ~40–45m
  const byKey = new Map<string, MapMarker[]>();
  for (const m of markers) {
    const key = locationKey(m.lat, m.lng);
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push(m);
  }
  const result: MapMarker[] = [];
  for (const group of byKey.values()) {
    if (group.length <= 1) {
      result.push(...group);
      continue;
    }
    const lat0 = group[0]!.lat;
    const lng0 = group[0]!.lng;
    group.forEach((m, i) => {
      const angle = (2 * Math.PI * i) / group.length;
      const lat = lat0 + SPREAD_DEGREES * Math.cos(angle);
      const lng = lng0 + (SPREAD_DEGREES * Math.sin(angle)) / Math.cos((lat0 * Math.PI) / 180);
      result.push({ ...m, lat, lng });
    });
  }
  return result;
}

type MapViewProps = {
  center: { lat: number; lng: number };
  markers: MapMarker[];
  radiusKm?: number;
  className?: string;
};

// Fix default icon in Leaflet with Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

export function MapView({ center, markers, radiusKm, className = "" }: MapViewProps) {
  const spreadMarkers = spreadOverlappingMarkers(markers);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const map = L.map("map-container").setView([center.lat, center.lng], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const markerLayer = L.layerGroup().addTo(map);
    spreadMarkers.forEach((m) => {
      L.marker([m.lat, m.lng], { icon: defaultIcon })
        .bindPopup(m.name)
        .addTo(markerLayer);
    });

    if (radiusKm != null && radiusKm > 0) {
      L.circle([center.lat, center.lng], { radius: radiusKm * 1000 }).addTo(map);
    }

    if (spreadMarkers.length > 0) {
      const group = L.featureGroup(
        spreadMarkers.map((m) => L.marker([m.lat, m.lng]))
      );
      const bounds = group.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds.pad(0.2));
    }

    return () => {
      map.remove();
    };
  }, [center.lat, center.lng, radiusKm, JSON.stringify(spreadMarkers.map((m) => ({ id: m.id, lat: m.lat, lng: m.lng })))]);

  return (
    <div
      id="map-container"
      className={`h-[400px] w-full rounded-lg border border-emerald-200 bg-muted ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
