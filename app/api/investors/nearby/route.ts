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

    const all = await prisma.investorProfile.findMany({
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
      .filter((inv) => inv.latitude != null && inv.longitude != null)
      .map((inv) => ({
        ...inv,
        distanceKm: haversineKm(
          lat,
          lng,
          inv.latitude as number,
          inv.longitude as number
        ),
      }))
      .filter((inv) => inv.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return NextResponse.json(withDistance);
  } catch (e) {
    console.error("Investors nearby error:", e);
    return NextResponse.json(
      { error: "Failed to fetch nearby investors." },
      { status: 500 }
    );
  }
}
