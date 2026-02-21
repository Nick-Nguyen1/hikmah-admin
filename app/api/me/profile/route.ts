import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { geocodeAddress } from "@/lib/geocode";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        startupProfile: { include: { teamMembers: true } },
        investorProfile: { include: { portfolio: true } },
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    const { passwordHash: _, ...rest } = user;
    return NextResponse.json(rest);
  } catch (e) {
    console.error("Profile fetch error:", e);
    return NextResponse.json(
      { error: "Failed to fetch profile." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { startupProfile: true, investorProfile: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.startupProfile) {
      const companyName =
        typeof body.companyName === "string" ? body.companyName.trim() : user.startupProfile.companyName;
      const oneLiner =
        typeof body.oneLiner === "string" ? body.oneLiner.trim() || null : user.startupProfile.oneLiner;
      const description =
        typeof body.description === "string" ? body.description.trim() || null : user.startupProfile.description;
      const sector = Array.isArray(body.sector)
        ? body.sector.filter((s: unknown) => typeof s === "string")
        : user.startupProfile.sector;
      const stage = typeof body.stage === "string" ? body.stage : user.startupProfile.stage;
      const fundingAmount =
        typeof body.fundingAmount === "number" && body.fundingAmount >= 0
          ? body.fundingAmount
          : body.fundingAmount === null || body.fundingAmount === ""
            ? null
            : user.startupProfile.fundingAmount;
      const website =
        typeof body.website === "string" ? body.website.trim() || null : user.startupProfile.website;
      const pitchDeckUrl =
        typeof body.pitchDeckUrl === "string" ? body.pitchDeckUrl.trim() || null : user.startupProfile.pitchDeckUrl;
      const imageUrl =
        typeof body.imageUrl === "string" ? body.imageUrl.trim() || null : user.startupProfile.imageUrl ?? undefined;
      const location =
        typeof body.location === "string" ? body.location.trim() || null : user.startupProfile.location;
      const lookingFor = Array.isArray(body.lookingFor)
        ? body.lookingFor.filter((s: unknown) => typeof s === "string")
        : undefined;
      const isPublic = typeof body.isPublic === "boolean" ? body.isPublic : undefined;
      const calendarUrl = typeof body.calendarUrl === "string" ? body.calendarUrl.trim() || null : undefined;

      let latitude: number | null | undefined = undefined;
      let longitude: number | null | undefined = undefined;
      const bodyLat = typeof body.latitude === "number" ? body.latitude : undefined;
      const bodyLng = typeof body.longitude === "number" ? body.longitude : undefined;
      if (bodyLat != null && bodyLng != null && !Number.isNaN(bodyLat) && !Number.isNaN(bodyLng)) {
        latitude = bodyLat;
        longitude = bodyLng;
      } else if (location) {
        const coords = await geocodeAddress(location).catch(() => null);
        if (coords) {
          latitude = coords.lat;
          longitude = coords.lng;
        } else {
          latitude = null;
          longitude = null;
        }
      }

      await prisma.startupProfile.update({
        where: { id: user.startupProfile.id },
        data: {
          companyName: companyName ?? undefined,
          oneLiner,
          description,
          sector,
          stage,
          fundingAmount,
          website,
          pitchDeckUrl,
          imageUrl: imageUrl ?? undefined,
          location,
          ...(latitude !== undefined && { latitude }),
          ...(longitude !== undefined && { longitude }),
          ...(lookingFor !== undefined && { lookingFor }),
          ...(isPublic !== undefined && { isPublic }),
          ...(calendarUrl !== undefined && { calendarUrl }),
        },
      });
    }

    if (user.investorProfile) {
      const firmName =
        typeof body.firmName === "string" ? body.firmName.trim() || null : user.investorProfile.firmName;
      const bio =
        typeof body.bio === "string" ? body.bio.trim() || null : user.investorProfile.bio;
      const imageUrl =
        typeof body.imageUrl === "string" ? body.imageUrl.trim() || null : user.investorProfile.imageUrl ?? undefined;
      const sectors = Array.isArray(body.sectors)
        ? body.sectors.filter((s: unknown) => typeof s === "string")
        : user.investorProfile.sectors;
      const stages = Array.isArray(body.stages)
        ? body.stages.filter((s: unknown) => typeof s === "string")
        : user.investorProfile.stages;
      const minCheck =
        typeof body.minCheck === "number" && body.minCheck >= 0
          ? body.minCheck
          : body.minCheck === null || body.minCheck === ""
            ? null
            : user.investorProfile.minCheck;
      const maxCheck =
        typeof body.maxCheck === "number" && body.maxCheck >= 0
          ? body.maxCheck
          : body.maxCheck === null || body.maxCheck === ""
            ? null
            : user.investorProfile.maxCheck;
      const location =
        typeof body.location === "string" ? body.location.trim() || null : user.investorProfile.location;
      const website =
        typeof body.website === "string" ? body.website.trim() || null : user.investorProfile.website;
      const lookingFor = Array.isArray(body.lookingFor)
        ? body.lookingFor.filter((s: unknown) => typeof s === "string")
        : undefined;
      const isPublic = typeof body.isPublic === "boolean" ? body.isPublic : undefined;
      const accreditedInvestor = typeof body.accreditedInvestor === "boolean" ? body.accreditedInvestor : undefined;
      const calendarUrl = typeof body.calendarUrl === "string" ? body.calendarUrl.trim() || null : undefined;

      let latitude: number | null | undefined = undefined;
      let longitude: number | null | undefined = undefined;
      const bodyLat = typeof body.latitude === "number" ? body.latitude : undefined;
      const bodyLng = typeof body.longitude === "number" ? body.longitude : undefined;
      if (bodyLat != null && bodyLng != null && !Number.isNaN(bodyLat) && !Number.isNaN(bodyLng)) {
        latitude = bodyLat;
        longitude = bodyLng;
      } else if (location) {
        const coords = await geocodeAddress(location).catch(() => null);
        if (coords) {
          latitude = coords.lat;
          longitude = coords.lng;
        } else {
          latitude = null;
          longitude = null;
        }
      }

      await prisma.investorProfile.update({
        where: { id: user.investorProfile.id },
        data: {
          firmName,
          bio,
          imageUrl: imageUrl ?? undefined,
          sectors,
          stages,
          minCheck,
          maxCheck,
          location,
          ...(latitude !== undefined && { latitude }),
          ...(longitude !== undefined && { longitude }),
          website,
          ...(lookingFor !== undefined && { lookingFor }),
          ...(isPublic !== undefined && { isPublic }),
          ...(accreditedInvestor !== undefined && { accreditedInvestor }),
          ...(calendarUrl !== undefined && { calendarUrl }),
        },
      });
    }

    if (body.calendarUrl !== undefined && typeof body.calendarUrl === "string") {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { calendarUrl: body.calendarUrl.trim() || null },
      });
    }
    if (body.notifyOnMatchRequest !== undefined || body.notifyOnMatchAccepted !== undefined || body.digestFrequency !== undefined) {
      const notif: { notifyOnMatchRequest?: boolean; notifyOnMatchAccepted?: boolean; digestFrequency?: "NONE" | "DAILY" | "WEEKLY" } = {};
      if (typeof body.notifyOnMatchRequest === "boolean") notif.notifyOnMatchRequest = body.notifyOnMatchRequest;
      if (typeof body.notifyOnMatchAccepted === "boolean") notif.notifyOnMatchAccepted = body.notifyOnMatchAccepted;
      if (body.digestFrequency === "NONE" || body.digestFrequency === "DAILY" || body.digestFrequency === "WEEKLY") notif.digestFrequency = body.digestFrequency;
      if (Object.keys(notif).length) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: notif,
        });
      }
    }

    const updated = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { startupProfile: { include: { teamMembers: true } }, investorProfile: { include: { portfolio: true } } },
    });
    if (!updated) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    const { passwordHash: _, ...rest } = updated;
    return NextResponse.json(rest);
  } catch (e) {
    console.error("Profile update error:", e);
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}
