import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const status =
      body.status === "ACCEPTED" || body.status === "DECLINED"
        ? body.status
        : undefined;
    const investorStatus =
      body.investorStatus === "NONE" ||
      body.investorStatus === "REVIEWED" ||
      body.investorStatus === "PASSED" ||
      body.investorStatus === "MEETING_SCHEDULED"
        ? body.investorStatus
        : undefined;
    const investorNotes =
      typeof body.investorNotes === "string" ? body.investorNotes.trim() || null : undefined;

    if (!status && investorStatus === undefined && investorNotes === undefined) {
      return NextResponse.json(
        { error: "Provide status, investorStatus, or investorNotes." },
        { status: 400 }
      );
    }

    const match = await prisma.matchRequest.findFirst({
      where: { id },
      select: { receiverId: true },
    });

    if (!match || match.receiverId !== session.user.id) {
      return NextResponse.json(
        { error: "Match request not found or you cannot update it." },
        { status: 404 }
      );
    }

    const data: { status?: "ACCEPTED" | "DECLINED"; investorStatus?: "NONE" | "REVIEWED" | "PASSED" | "MEETING_SCHEDULED"; investorNotes?: string | null } = {};
    if (status) data.status = status;
    if (investorStatus !== undefined) data.investorStatus = investorStatus;
    if (investorNotes !== undefined) data.investorNotes = investorNotes;

    const updated = await prisma.matchRequest.update({
      where: { id },
      data,
      include: {
        startup: { include: { user: { select: { name: true, email: true } } } },
        investor: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
    });

    if (status === "ACCEPTED") {
      const sender = await prisma.user.findUnique({
        where: { id: updated.senderId },
        select: { email: true, notifyOnMatchAccepted: true },
      });
      if (sender?.email && sender.notifyOnMatchAccepted) {
        const invName = updated.investor.firmName ?? updated.investor.user?.name ?? "Investor";
        sendEmail({
          to: sender.email,
          subject: `Match accepted: ${invName}`,
          html: `<p>Your match request has been accepted by ${invName}.</p><p><a href="${process.env.NEXTAUTH_URL ?? ""}/matches">View in dashboard</a></p>`,
        }).catch((e) => console.error("Match accepted email failed:", e));
      }
    }

    return NextResponse.json(updated);
  } catch (e) {
    console.error("Match update error:", e);
    return NextResponse.json(
      { error: "Failed to update match request." },
      { status: 500 }
    );
  }
}
