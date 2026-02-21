import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sector = searchParams.get("sector");
    const stage = searchParams.get("stage");
    const location = searchParams.get("location");
    const q = searchParams.get("q")?.trim();

    const startups = await prisma.startupProfile.findMany({
      where: {
        isPublic: true,
        user: { isDeactivated: false },
        ...(sector && { sector: { has: sector } }),
        ...(stage && { stage }),
        ...(location && {
          location: { contains: location, mode: "insensitive" },
        }),
        ...(q && {
          OR: [
            { companyName: { contains: q, mode: "insensitive" } },
            { oneLiner: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
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

    return NextResponse.json(startups);
  } catch (e) {
    console.error("Startups list error:", e);
    return NextResponse.json(
      { error: "Failed to fetch startups." },
      { status: 500 }
    );
  }
}
