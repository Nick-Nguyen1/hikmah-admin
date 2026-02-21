import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "sent" | "received" | null (all)

    const where =
      type === "sent"
        ? { senderId: session.user.id }
        : type === "received"
          ? { receiverId: session.user.id }
          : {
              OR: [
                { senderId: session.user.id },
                { receiverId: session.user.id },
              ],
            };

    const requests = await prisma.matchRequest.findMany({
      where,
      include: {
        startup: {
          include: { user: { select: { name: true, email: true } } },
        },
        investor: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (e) {
    console.error("Match requests list error:", e);
    return NextResponse.json(
      { error: "Failed to fetch match requests." },
      { status: 500 }
    );
  }
}
