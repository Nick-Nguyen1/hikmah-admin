const NOMINATIM_HEADERS = {
  "User-Agent": "HikmahInvestors/1.0 (https://github.com/hikmah-investors)",
} as const;

/**
 * Search for addresses worldwide (Nominatim). Returns up to 8 matches.
 * Use with debounce; Nominatim allows 1 request per second.
 */
export async function searchAddresses(
  query: string
): Promise<{ display_name: string; lat: number; lng: number }[]> {
  const trimmed = query?.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "8");

  const res = await fetch(url.toString(), { headers: NOMINATIM_HEADERS });
  if (!res.ok) return [];

  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data
    .filter((item: { lat?: string; lon?: string }) => item.lat != null && item.lon != null)
    .map((item: { display_name: string; lat: string; lon: string }) => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }))
    .filter((r) => !Number.isNaN(r.lat) && !Number.isNaN(r.lng));
}

/**
 * Geocode an address string to lat/lng using Nominatim (OpenStreetMap).
 * Use sparingly; Nominatim allows 1 request per second.
 */
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  const trimmed = address?.trim();
  if (!trimmed) return null;

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), { headers: NOMINATIM_HEADERS });
  if (!res.ok) return null;

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;

  const first = data[0];
  const lat = parseFloat(first.lat);
  const lng = parseFloat(first.lon);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

  return { lat, lng };
}

/** Haversine distance in km between two points. */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
