"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddressAutocomplete } from "@/components/address-autocomplete";
import type { StartupProfile, InvestorProfile } from "@prisma/client";

type Props =
  | {
      type: "startup";
      profile: StartupProfile;
      userId: string;
    }
  | {
      type: "investor";
      profile: InvestorProfile;
      userId: string;
    };

export function ProfileEditForm(props: Props) {
  const router = useRouter();
  const { type, profile } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [companyName, setCompanyName] = useState(
    type === "startup" ? profile.companyName : ""
  );
  const [imageUrl, setImageUrl] = useState(
    (profile as { imageUrl?: string | null }).imageUrl ?? ""
  );
  const [oneLiner, setOneLiner] = useState(
    type === "startup" ? (profile.oneLiner ?? "") : ""
  );
  const [description, setDescription] = useState(
    type === "startup" ? (profile.description ?? "") : ""
  );
  const [sector, setSector] = useState(
    type === "startup" ? profile.sector.join(", ") : ""
  );
  const [stage, setStage] = useState(
    type === "startup" ? profile.stage : ""
  );
  const [fundingAmount, setFundingAmount] = useState(
    type === "startup" && profile.fundingAmount != null
      ? String(profile.fundingAmount)
      : ""
  );
  const [website, setWebsite] = useState(
    (type === "startup" ? profile.website : profile.website) ?? ""
  );
  const [pitchDeckUrl, setPitchDeckUrl] = useState(
    type === "startup" ? (profile.pitchDeckUrl ?? "") : ""
  );
  const [location, setLocation] = useState(
    profile.location ?? ""
  );
  const [latitude, setLatitude] = useState<number | null>(
    (profile as { latitude?: number | null }).latitude ?? null
  );
  const [longitude, setLongitude] = useState<number | null>(
    (profile as { longitude?: number | null }).longitude ?? null
  );
  const [firmName, setFirmName] = useState(
    type === "investor" ? (profile.firmName ?? "") : ""
  );
  const [bio, setBio] = useState(
    type === "investor" ? (profile.bio ?? "") : ""
  );
  const [sectors, setSectors] = useState(
    type === "investor" ? profile.sectors.join(", ") : ""
  );
  const [stages, setStages] = useState(
    type === "investor" ? profile.stages.join(", ") : ""
  );
  const [minCheck, setMinCheck] = useState(
    type === "investor" && profile.minCheck != null
      ? String(profile.minCheck)
      : ""
  );
  const [maxCheck, setMaxCheck] = useState(
    type === "investor" && profile.maxCheck != null
      ? String(profile.maxCheck)
      : ""
  );
  const [lookingFor, setLookingFor] = useState(
    (type === "startup" ? (profile as { lookingFor?: string[] }).lookingFor : (profile as { lookingFor?: string[] }).lookingFor)?.join(", ") ?? ""
  );
  const [isPublic, setIsPublic] = useState(
    (profile as { isPublic?: boolean }).isPublic !== false
  );
  const [calendarUrl, setCalendarUrl] = useState(
    (profile as { calendarUrl?: string | null }).calendarUrl ?? ""
  );
  const [accreditedInvestor, setAccreditedInvestor] = useState(
    type === "investor" && (profile as { accreditedInvestor?: boolean }).accreditedInvestor === true
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        location,
        website,
        lookingFor: lookingFor ? lookingFor.split(",").map((s) => s.trim()).filter(Boolean) : [],
        isPublic,
        calendarUrl: calendarUrl.trim() || null,
        imageUrl: imageUrl.trim() || null,
      };
      if (latitude != null && longitude != null) {
        body.latitude = latitude;
        body.longitude = longitude;
      }
      if (type === "startup") {
        body.companyName = companyName;
        body.oneLiner = oneLiner || null;
        body.description = description || null;
        body.sector = sector ? sector.split(",").map((s) => s.trim()).filter(Boolean) : [];
        body.stage = stage;
        body.fundingAmount = fundingAmount ? Number(fundingAmount) : null;
        body.pitchDeckUrl = pitchDeckUrl || null;
      } else {
        body.firmName = firmName || null;
        body.bio = bio || null;
        body.sectors = sectors ? sectors.split(",").map((s) => s.trim()).filter(Boolean) : [];
        body.stages = stages ? stages.split(",").map((s) => s.trim()).filter(Boolean) : [];
        body.minCheck = minCheck ? Number(minCheck) : null;
        body.maxCheck = maxCheck ? Number(maxCheck) : null;
        body.accreditedInvestor = accreditedInvestor;
      }
      const res = await fetch("/api/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to update.");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {type === "startup" && (
        <>
          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-medium">
              Profile picture URL
            </label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="companyName" className="text-sm font-medium">
              Company name
            </label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="oneLiner" className="text-sm font-medium">
              One-liner
            </label>
            <Input
              id="oneLiner"
              value={oneLiner}
              onChange={(e) => setOneLiner(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="sector" className="text-sm font-medium">
              Sectors (comma-separated)
            </label>
            <Input
              id="sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              placeholder="Fintech, Health, SaaS"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="stage" className="text-sm font-medium">
              Stage
            </label>
            <Input
              id="stage"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              placeholder="idea, pre_seed, seed, series_a"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="fundingAmount" className="text-sm font-medium">
              Funding amount (e.g. thousands)
            </label>
            <Input
              id="fundingAmount"
              type="number"
              min={0}
              value={fundingAmount}
              onChange={(e) => setFundingAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="pitchDeckUrl" className="text-sm font-medium">
              Pitch deck URL
            </label>
            <Input
              id="pitchDeckUrl"
              type="url"
              value={pitchDeckUrl}
              onChange={(e) => setPitchDeckUrl(e.target.value)}
            />
          </div>
        </>
      )}
      {type === "investor" && (
        <>
          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-medium">
              Profile picture URL
            </label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="firmName" className="text-sm font-medium">
              Firm name
            </label>
            <Input
              id="firmName"
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <textarea
              id="bio"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="sectors" className="text-sm font-medium">
              Sectors (comma-separated)
            </label>
            <Input
              id="sectors"
              value={sectors}
              onChange={(e) => setSectors(e.target.value)}
              placeholder="Fintech, Health, SaaS"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="stages" className="text-sm font-medium">
              Stages (comma-separated)
            </label>
            <Input
              id="stages"
              value={stages}
              onChange={(e) => setStages(e.target.value)}
              placeholder="seed, series_a, series_b"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="minCheck" className="text-sm font-medium">
                Min check (K)
              </label>
              <Input
                id="minCheck"
                type="number"
                min={0}
                value={minCheck}
                onChange={(e) => setMinCheck(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="maxCheck" className="text-sm font-medium">
                Max check (K)
              </label>
              <Input
                id="maxCheck"
                type="number"
                min={0}
                value={maxCheck}
                onChange={(e) => setMaxCheck(e.target.value)}
              />
            </div>
          </div>
        </>
      )}
      <div className="space-y-2">
        <label htmlFor="location" className="text-sm font-medium">
          Location
        </label>
        <AddressAutocomplete
          id="location"
          value={location}
          onChange={(v) => {
            setLocation(v);
            setLatitude(null);
            setLongitude(null);
          }}
          onSelect={(address, coords) => {
            setLocation(address);
            setLatitude(coords.lat);
            setLongitude(coords.lng);
          }}
          placeholder="Search for a city or address..."
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="website" className="text-sm font-medium">
          Website
        </label>
        <Input
          id="website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="lookingFor" className="text-sm font-medium">
          Looking for (tags, comma-separated)
        </label>
        <Input
          id="lookingFor"
          value={lookingFor}
          onChange={(e) => setLookingFor(e.target.value)}
          placeholder="B2B, first cheque, follow-on"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="calendarUrl" className="text-sm font-medium">
          Calendar link (e.g. Calendly)
        </label>
        <Input
          id="calendarUrl"
          type="url"
          value={calendarUrl}
          onChange={(e) => setCalendarUrl(e.target.value)}
          placeholder="https://calendly.com/..."
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        <label htmlFor="isPublic" className="text-sm font-medium">
          Profile visible in discovery
        </label>
      </div>
      {type === "investor" && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="accreditedInvestor"
            checked={accreditedInvestor}
            onChange={(e) => setAccreditedInvestor(e.target.checked)}
          />
          <label htmlFor="accreditedInvestor" className="text-sm font-medium">
            I am an accredited investor
          </label>
        </div>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
