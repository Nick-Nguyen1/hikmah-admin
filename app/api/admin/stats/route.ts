import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || !session.user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const [
      totalUsers,
      totalStartups,
      totalInvestors,
      totalMatches,
      acceptedMatches,
      pendingMatches,
    ] = await Promise.all([
      prisma.user.count({ where: { isDeactivated: false } }),
      prisma.startupProfile.count(),
      prisma.investorProfile.count(),
      prisma.matchRequest.count(),
      prisma.matchRequest.count({ where: { status: "ACCEPTED" } }),
      prisma.matchRequest.count({ where: { status: "PENDING" } }),
    ]);
    const sectors = await prisma.startupProfile.findMany({
      select: { sector: true },
    });
    const sectorCounts: Record<string, number> = {};
    for (const s of sectors) {
      for (const sec of s.sector) {
        sectorCounts[sec] = (sectorCounts[sec] ?? 0) + 1;
      }
    }
    const stageCounts = await prisma.startupProfile.groupBy({
      by: ["stage"],
      _count: true,
    });
    return NextResponse.json({
      totalUsers,
      totalStartups,
      totalInvestors,
      totalMatches,
      acceptedMatches,
      declinedMatches: totalMatches - acceptedMatches - pendingMatches,
      pendingMatches,
      sectorCounts,
      stageCounts: stageCounts.map((s) => ({ stage: s.stage, count: s._count })),
    });
  } catch (e) {
    console.error("Admin stats error:", e);
    return NextResponse.json({ error: "Failed to fetch stats." }, { status: 500 });
  }
}
