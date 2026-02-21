import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const startup = await prisma.startupProfile.findUnique({
      where: { userId: session.user.id },
      include: { teamMembers: true },
    });
    if (!startup) {
      return NextResponse.json({ error: "No startup profile." }, { status: 404 });
    }
    return NextResponse.json(startup.teamMembers);
  } catch (e) {
    console.error("Team list error:", e);
    return NextResponse.json({ error: "Failed to fetch team." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const startup = await prisma.startupProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!startup) {
      return NextResponse.json({ error: "No startup profile." }, { status: 404 });
    }
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const role = typeof body.role === "string" ? body.role.trim() : "";
    const linkedInUrl = typeof body.linkedInUrl === "string" ? body.linkedInUrl.trim() || null : null;
    if (!name || !role) {
      return NextResponse.json({ error: "name and role required." }, { status: 400 });
    }
    const member = await prisma.startupTeamMember.create({
      data: { startupId: startup.id, name, role, linkedInUrl },
    });
    return NextResponse.json(member);
  } catch (e) {
    console.error("Team add error:", e);
    return NextResponse.json({ error: "Failed to add team member." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required." }, { status: 400 });
  }
  try {
    const member = await prisma.startupTeamMember.findFirst({
      where: { id, startup: { userId: session.user.id } },
    });
    if (!member) {
      return NextResponse.json({ error: "Team member not found." }, { status: 404 });
    }
    await prisma.startupTeamMember.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Team delete error:", e);
    return NextResponse.json({ error: "Failed to delete." }, { status: 500 });
  }
}
