import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || !session.user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const isDeactivated = body.isDeactivated === true;
    await prisma.user.update({
      where: { id },
      data: { isDeactivated },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Admin user update error:", e);
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}
