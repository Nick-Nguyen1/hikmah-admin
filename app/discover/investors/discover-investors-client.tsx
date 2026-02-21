"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RequestMatchButton } from "./request-match-button";
import { ShortlistButton } from "./shortlist-button";
import { ProfileAvatar } from "@/components/profile-avatar";
import { LocationMapSearch } from "@/components/location-map-search";

type Investor = {
  id: string;
  firmName: string | null;
  imageUrl: string | null;
  bio: string | null;
  sectors: string[];
  stages: string[];
  minCheck: number | null;
  maxCheck: number | null;
  location: string | null;
  user: { name: string | null; email: string };
};

export function DiscoverInvestorsClient({
  initialInvestors,
  myStartupId,
}: {
  initialInvestors: Investor[];
  myStartupId: string | null;
}) {
  const [investors, setInvestors] = useState(initialInvestors);
  const [sector, setSector] = useState("");
  const [stage, setStage] = useState("");
  const [location, setLocation] = useState("");
  const [minCheck, setMinCheck] = useState("");
  const [maxCheck, setMaxCheck] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (sector) params.set("sector", sector);
    if (stage) params.set("stage", stage);
    if (location) params.set("location", location);
    if (minCheck) params.set("minCheck", minCheck);
    if (maxCheck) params.set("maxCheck", maxCheck);
    if (q) params.set("q", q);
    setLoading(true);
    fetch(`/api/investors?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setInvestors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sector, stage, location, minCheck, maxCheck, q]);

  return (
    <div className="space-y-6">
      <LocationMapSearch type="investors" myStartupId={myStartupId} />
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
        <Input
          type="number"
          placeholder="Min check (K)"
          value={minCheck}
          onChange={(e) => setMinCheck(e.target.value)}
          className="max-w-[100px]"
        />
        <Input
          type="number"
          placeholder="Max check (K)"
          value={maxCheck}
          onChange={(e) => setMaxCheck(e.target.value)}
          className="max-w-[100px]"
        />
      </div>
      <div className="flex gap-4">
<Button variant="outline" asChild className="border-emerald-700 text-emerald-800 hover:bg-emerald-50">
        <Link href="/shortlist">View my shortlist</Link>
      </Button>
      </div>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : investors.length === 0 ? (
        <p className="text-muted-foreground">No investors match your filters.</p>
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
                    <CardDescription>{inv.bio ?? "—"}</CardDescription>
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
                {inv.sectors.length > 0 && (
                  <p>
                    <span className="font-medium">Sectors:</span> {inv.sectors.join(", ")}
                  </p>
                )}
                {inv.stages.length > 0 && (
                  <p>
                    <span className="font-medium">Stages:</span> {inv.stages.join(", ")}
                  </p>
                )}
                {(inv.minCheck != null || inv.maxCheck != null) && (
                  <p>
                    <span className="font-medium">Check size:</span>{" "}
                    {inv.minCheck != null && inv.maxCheck != null
                      ? `${inv.minCheck}K – ${inv.maxCheck}K`
                      : inv.minCheck != null
                        ? `${inv.minCheck}K+`
                        : `Up to ${inv.maxCheck}K`}
                  </p>
                )}
                {inv.location && (
                  <p>
                    <span className="font-medium">Location:</span> {inv.location}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
