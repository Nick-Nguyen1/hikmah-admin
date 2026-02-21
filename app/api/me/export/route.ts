import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "INVESTOR") {
    return NextResponse.json({ error: "Only investors can export deal flow." }, { status: 403 });
  }
  try {
    const startups = await prisma.startupProfile.findMany({
      where: { isPublic: true },
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    const headers = [
      "Company",
      "One-liner",
      "Stage",
      "Sector",
      "Funding (K)",
      "Location",
      "Website",
      "Contact name",
      "Contact email",
    ];
    const rows = startups.map((s) => [
      s.companyName,
      s.oneLiner ?? "",
      s.stage,
      s.sector.join("; "),
      s.fundingAmount ?? "",
      s.location ?? "",
      s.website ?? "",
      s.user.name ?? "",
      s.user.email ?? "",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=deal-flow.csv",
      },
    });
  } catch (e) {
    console.error("Export error:", e);
    return NextResponse.json({ error: "Export failed." }, { status: 500 });
  }
}
