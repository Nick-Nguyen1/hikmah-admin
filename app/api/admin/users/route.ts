import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const users = await prisma.user.findMany({
      where: {
        ...(role === "STARTUP" || role === "INVESTOR" ? { role } : {}),
        isDeactivated: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        startupProfile: { select: { companyName: true } },
        investorProfile: { select: { firmName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json(users);
  } catch (e) {
    console.error("Admin users error:", e);
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}
