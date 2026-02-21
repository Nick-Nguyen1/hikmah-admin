import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const startupId =
      typeof body.startupId === "string" ? body.startupId.trim() : "";
    const investorId =
      typeof body.investorId === "string" ? body.investorId.trim() : "";
    const message =
      typeof body.message === "string" ? body.message.trim() || null : null;
    const applicationAnswers =
      body.applicationAnswers && typeof body.applicationAnswers === "object"
        ? body.applicationAnswers
        : null;

    if (!startupId || !investorId) {
      return NextResponse.json(
        { error: "startupId and investorId are required." },
        { status: 400 }
      );
    }

    const startup = await prisma.startupProfile.findUnique({
      where: { id: startupId },
      include: { user: { select: { name: true, email: true } } },
    });
    const investor = await prisma.investorProfile.findUnique({
      where: { id: investorId },
      include: { user: { select: { name: true, email: true, notifyOnMatchRequest: true } } },
    });

    if (!startup || !investor) {
      return NextResponse.json(
        { error: "Startup or investor not found." },
        { status: 404 }
      );
    }

    if (startup.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only send match requests for your own startup." },
        { status: 403 }
      );
    }

    const existing = await prisma.matchRequest.findUnique({
      where: {
        startupId_investorId: { startupId, investorId },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A match request already exists." },
        { status: 409 }
      );
    }

    const match = await prisma.matchRequest.create({
      data: {
        startupId,
        investorId,
        senderId: session.user.id,
        receiverId: investor.userId,
        message,
        applicationAnswers,
      },
      include: {
        startup: { include: { user: { select: { name: true, email: true } } } },
        investor: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
    });

    if (investor.user.notifyOnMatchRequest && investor.user.email) {
      sendEmail({
        to: investor.user.email,
        subject: `New match request: ${startup.companyName}`,
        html: `<p>You have a new match request from <strong>${startup.companyName}</strong>.</p><p>${startup.oneLiner ?? ""}</p><p><a href="${process.env.NEXTAUTH_URL ?? ""}/matches">View in dashboard</a></p>`,
      }).catch((e) => console.error("Match notification email failed:", e));
    }

    return NextResponse.json(match);
  } catch (e) {
    console.error("Match request error:", e);
    return NextResponse.json(
      { error: "Failed to create match request." },
      { status: 500 }
    );
  }
}
