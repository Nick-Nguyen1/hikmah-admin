"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { AddressAutocomplete } from "@/components/address-autocomplete";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/profile-avatar";
import type { MapMarker } from "@/components/map-view";
import { ShortlistStartupButton } from "@/app/discover/startups/shortlist-startup-button";
import { RequestMatchButton } from "@/app/discover/investors/request-match-button";
import { ShortlistButton } from "@/app/discover/investors/shortlist-button";

const MapView = dynamic(
  () => import("@/components/map-view").then((m) => ({ default: m.MapView })),
  { ssr: false }
);

const RADIUS_OPTIONS = [10, 25, 50, 100] as const;

type StartupResult = {
  id: string;
  companyName: string;
  imageUrl: string | null;
  oneLiner: string | null;
  sector: string[];
  stage: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  distanceKm: number;
  user: { name: string | null; email: string };
};

type InvestorResult = {
  id: string;
  firmName: string | null;
  imageUrl: string | null;
  bio: string | null;
  sectors: string[];
  stages: string[];
  minCheck: number | null;
  maxCheck: number | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  distanceKm: number;
  user: { name: string | null; email: string };
};

type LocationMapSearchProps = {
  type: "startups" | "investors";
  myStartupId?: string | null;
};

export function LocationMapSearch({ type, myStartupId = null }: LocationMapSearchProps) {
  const [address, setAddress] = useState("");
  const [radiusKm, setRadiusKm] = useState(50);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [startups, setStartups] = useState<StartupResult[]>([]);
  const [investors, setInvestors] = useState<InvestorResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runSearchWithCoords(lat: number, lng: number) {
    setError("");
    setCenter({ lat, lng });
    setLoading(true);
    try {
      if (type === "startups") {
        const res = await fetch(
          `/api/startups/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`
        );
        const data = await res.json();
        setStartups(Array.isArray(data) ? data : []);
        setInvestors([]);
      } else {
        const res = await fetch(
          `/api/investors/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`
        );
        const data = await res.json();
        setInvestors(Array.isArray(data) ? data : []);
        setStartups([]);
      }
    } catch {
      setError("Something went wrong.");
    }
    setLoading(false);
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmed = address.trim();
    if (!trimmed) {
      setError("Enter an address.");
      return;
    }
    setLoading(true);
    try {
      const geoRes = await fetch(
        `/api/geocode?address=${encodeURIComponent(trimmed)}`
      );
      if (!geoRes.ok) {
        const data = await geoRes.json().catch(() => ({}));
        setError(data.error ?? "Could not find that address.");
        setCenter(null);
        setStartups([]);
        setInvestors([]);
        setLoading(false);
        return;
      }
      const { lat, lng } = await geoRes.json();
      await runSearchWithCoords(lat, lng);
    } catch {
      setError("Something went wrong.");
      setCenter(null);
      setStartups([]);
      setInvestors([]);
    }
    setLoading(false);
  }

  const markers: MapMarker[] =
    type === "startups"
      ? startups
          .filter((s) => s.latitude != null && s.longitude != null)
          .map((s) => ({
            id: s.id,
            lat: s.latitude!,
            lng: s.longitude!,
            name: s.companyName,
          }))
      : investors
          .filter((inv) => inv.latitude != null && inv.longitude != null)
          .map((inv) => ({
            id: inv.id,
            lat: inv.latitude!,
            lng: inv.longitude!,
            name: inv.firmName ?? inv.user.name ?? "Investor",
          }));

  const resultsCount = type === "startups" ? startups.length : investors.length;

  return (
    <div className="space-y-6">
      <Card className="border-emerald-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-emerald-900">Search by location</CardTitle>
          <CardDescription>
            Enter an address to see {type} within a radius on the map. Profiles
            with a saved location (set in Profile) will appear.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px] space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address or city
              </label>
              <AddressAutocomplete
                id="address"
                value={address}
                onChange={setAddress}
                onSelect={(addr, coords) => {
                  setAddress(addr);
                  runSearchWithCoords(coords.lat, coords.lng);
                }}
                placeholder="Search for a city or address worldwide..."
              />
            </div>
            <div className="w-[120px] space-y-2">
              <label htmlFor="radius" className="text-sm font-medium">
                Radius (km)
              </label>
              <select
                id="radius"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {RADIUS_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r} km
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Searching…" : "Show on map"}
            </Button>
          </form>
          {error && (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      {center && (
        <>
          <div className="space-y-2">
            <h3 className="font-medium text-emerald-900">Map</h3>
            <MapView
              center={center}
              markers={markers}
              radiusKm={radiusKm}
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-emerald-900">
              {type === "startups" ? "Startups" : "Investors"} within {radiusKm} km
              {resultsCount > 0 && ` (${resultsCount})`}
            </h3>
            {resultsCount === 0 ? (
              <p className="text-muted-foreground">
                No {type} with a saved location in this radius. Ask users to set
                their location in Profile.
              </p>
            ) : type === "startups" ? (
              <div className="space-y-4">
                {startups.map((s) => (
                  <Card key={s.id} className="border-emerald-100 shadow-sm">
                    <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                      <div className="flex items-start gap-3">
                        <ProfileAvatar
                          imageUrl={s.imageUrl}
                          name={s.companyName}
                          size="md"
                        />
                        <div>
                          <CardTitle className="text-lg">{s.companyName}</CardTitle>
                          <CardDescription>
                            {s.oneLiner ?? "—"} · {s.distanceKm.toFixed(1)} km away
                          </CardDescription>
                        </div>
                      </div>
                      <ShortlistStartupButton startupId={s.id} />
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Stage:</span> {s.stage}
                      </p>
                      {s.sector.length > 0 && (
                        <p>
                          <span className="font-medium">Sector:</span>{" "}
                          {s.sector.join(", ")}
                        </p>
                      )}
                      {s.location && (
                        <p>
                          <span className="font-medium">Location:</span> {s.location}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {investors.map((inv) => (
                  <Card key={inv.id} className="border-emerald-100 shadow-sm">
                    <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                      <div className="flex items-start gap-3">
                        <ProfileAvatar
                          imageUrl={inv.imageUrl}
                          name={inv.firmName ?? inv.user.name ?? "Investor"}
                          size="md"
                        />
                        <div>
                          <CardTitle className="text-lg">
                            {inv.firmName ?? inv.user.name ?? "Investor"}
                          </CardTitle>
                          <CardDescription>
                            {inv.distanceKm.toFixed(1)} km away
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {myStartupId && (
                          <RequestMatchButton
                            startupId={myStartupId}
                            investorId={inv.id}
                          />
                        )}
                        <ShortlistButton investorId={inv.id} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {inv.bio && (
                        <p className="text-muted-foreground">{inv.bio}</p>
                      )}
                      {inv.sectors.length > 0 && (
                        <p>
                          <span className="font-medium">Sectors:</span>{" "}
                          {inv.sectors.join(", ")}
                        </p>
                      )}
                      {inv.location && (
                        <p>
                          <span className="font-medium">Location:</span>{" "}
                          {inv.location}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
