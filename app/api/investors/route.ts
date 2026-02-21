import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sector = searchParams.get("sector");
    const stage = searchParams.get("stage");
    const location = searchParams.get("location");
    const minCheck = searchParams.get("minCheck");
    const maxCheck = searchParams.get("maxCheck");
    const q = searchParams.get("q")?.trim();

    const investors = await prisma.investorProfile.findMany({
      where: {
        isPublic: true,
        user: { isDeactivated: false },
        ...(sector && { sectors: { has: sector } }),
        ...(stage && { stages: { has: stage } }),
        ...(location && {
          location: { contains: location, mode: "insensitive" },
        }),
        ...(minCheck != null && minCheck !== "" && { maxCheck: { gte: Number(minCheck) } }),
        ...(maxCheck != null && maxCheck !== "" && { minCheck: { lte: Number(maxCheck) } }),
        ...(q && {
          OR: [
            { firmName: { contains: q, mode: "insensitive" } },
            { bio: { contains: q, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(investors);
  } catch (e) {
    console.error("Investors list error:", e);
    return NextResponse.json(
      { error: "Failed to fetch investors." },
      { status: 500 }
    );
  }
}
