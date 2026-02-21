"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShortlistStartupButton } from "./shortlist-startup-button";
import { ProfileAvatar } from "@/components/profile-avatar";
import { LocationMapSearch } from "@/components/location-map-search";

type Startup = {
  id: string;
  companyName: string;
  imageUrl: string | null;
  oneLiner: string | null;
  sector: string[];
  stage: string;
  fundingAmount: number | null;
  location: string | null;
  user: { name: string | null; email: string };
};

export function DiscoverStartupsClient({
  initialStartups,
}: {
  initialStartups: Startup[];
}) {
  const [startups, setStartups] = useState(initialStartups);
  const [sector, setSector] = useState("");
  const [stage, setStage] = useState("");
  const [location, setLocation] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (sector) params.set("sector", sector);
    if (stage) params.set("stage", stage);
    if (location) params.set("location", location);
    if (q) params.set("q", q);
    setLoading(true);
    fetch(`/api/startups?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setStartups(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sector, stage, location, q]);

  return (
    <div className="space-y-6">
      <LocationMapSearch type="startups" />
      <div className="flex flex-wrap gap-4 rounded-lg border p-4">
        <Input
          placeholder="Search..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="Sector"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="max-w-[120px]"
        />
        <Input
          placeholder="Stage"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="max-w-[120px]"
        />
        <Input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="max-w-[140px]"
        />
      </div>
      <Button variant="outline" asChild className="border-emerald-700 text-emerald-800 hover:bg-emerald-50">
        <Link href="/shortlist/startups">View my shortlist</Link>
      </Button>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : startups.length === 0 ? (
        <p className="text-muted-foreground">No startups match your filters.</p>
      ) : (
        <div className="space-y-4">
          {startups.map((s) => (
            <Card key={s.id} className="border-emerald-100 shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                <div className="flex items-start gap-3">
                  <ProfileAvatar imageUrl={s.imageUrl} name={s.companyName} size="md" />
                  <div>
                    <CardTitle className="text-lg">{s.companyName}</CardTitle>
                    <CardDescription>{s.oneLiner ?? "—"}</CardDescription>
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
                    <span className="font-medium">Sector:</span> {s.sector.join(", ")}
                  </p>
                )}
                {s.location && (
                  <p>
                    <span className="font-medium">Location:</span> {s.location}
                  </p>
                )}
                <p className="text-muted-foreground">
                  Contact: {s.user.name ?? s.user.email}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
