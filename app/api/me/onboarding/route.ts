import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const completed = body.completed === true;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { onboardingCompletedAt: completed ? new Date() : null },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Onboarding update error:", e);
    return NextResponse.json({ error: "Failed to update." }, { status: 500 });
  }
}
