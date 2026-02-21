import type { StartupProfile, InvestorProfile } from "@prisma/client";

export function startupCompleteness(p: StartupProfile | null): number {
  if (!p) return 0;
  let filled = 0;
  const total = 8;
  if (p.companyName?.trim()) filled++;
  if (p.oneLiner?.trim()) filled++;
  if (p.description?.trim()) filled++;
  if (p.sector?.length) filled++;
  if (p.stage?.trim()) filled++;
  if (p.website?.trim()) filled++;
  if (p.location?.trim()) filled++;
  if (p.pitchDeckUrl?.trim()) filled++;
  return Math.round((filled / total) * 100);
}

export function investorCompleteness(p: InvestorProfile | null): number {
  if (!p) return 0;
  let filled = 0;
  const total = 7;
  if (p.firmName?.trim()) filled++;
  if (p.bio?.trim()) filled++;
  if (p.sectors?.length) filled++;
  if (p.stages?.length) filled++;
  if (p.location?.trim()) filled++;
  if (p.website?.trim()) filled++;
  if (p.minCheck != null || p.maxCheck != null) filled++;
  return Math.round((filled / total) * 100);
}
