import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const investor = await prisma.investorProfile.findUnique({
      where: { userId: session.user.id },
      include: { portfolio: true },
    });
    if (!investor) {
      return NextResponse.json({ error: "No investor profile." }, { status: 404 });
    }
    return NextResponse.json(investor.portfolio);
  } catch (e) {
    console.error("Portfolio list error:", e);
    return NextResponse.json({ error: "Failed to fetch portfolio." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const investor = await prisma.investorProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!investor) {
      return NextResponse.json({ error: "No investor profile." }, { status: 404 });
    }
    const body = await req.json();
    const companyName = typeof body.companyName === "string" ? body.companyName.trim() : "";
    const url = typeof body.url === "string" ? body.url.trim() || null : null;
    const description = typeof body.description === "string" ? body.description.trim() || null : null;
    if (!companyName) {
      return NextResponse.json({ error: "companyName required." }, { status: 400 });
    }
    const item = await prisma.investorPortfolio.create({
      data: { investorId: investor.id, companyName, url, description },
    });
    return NextResponse.json(item);
  } catch (e) {
    console.error("Portfolio add error:", e);
    return NextResponse.json({ error: "Failed to add portfolio item." }, { status: 500 });
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
    const item = await prisma.investorPortfolio.findFirst({
      where: { id, investor: { userId: session.user.id } },
    });
    if (!item) {
      return NextResponse.json({ error: "Portfolio item not found." }, { status: 404 });
    }
    await prisma.investorPortfolio.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Portfolio delete error:", e);
    return NextResponse.json({ error: "Failed to delete." }, { status: 500 });
  }
}
