import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { haversineKm } from "@/lib/geocode";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    const radiusKmParam = searchParams.get("radiusKm") ?? "50";

    const lat = latParam != null ? parseFloat(latParam) : NaN;
    const lng = lngParam != null ? parseFloat(lngParam) : NaN;
    const radiusKm = parseFloat(radiusKmParam) || 50;

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return NextResponse.json(
        { error: "Missing or invalid lat, lng parameters." },
        { status: 400 }
      );
    }

    const all = await prisma.startupProfile.findMany({
      where: {
        isPublic: true,
        user: { isDeactivated: false },
        latitude: { not: null },
        longitude: { not: null },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    const withDistance = all
      .filter((s) => s.latitude != null && s.longitude != null)
      .map((s) => ({
        ...s,
        distanceKm: haversineKm(
          lat,
          lng,
          s.latitude as number,
          s.longitude as number
        ),
      }))
      .filter((s) => s.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return NextResponse.json(withDistance);
  } catch (e) {
    console.error("Startups nearby error:", e);
    return NextResponse.json(
      { error: "Failed to fetch nearby startups." },
      { status: 500 }
    );
  }
}
