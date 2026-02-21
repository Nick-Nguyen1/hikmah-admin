import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const name = typeof body.name === "string" ? body.name.trim() : null;
    const role = body.role === "INVESTOR" ? "INVESTOR" : "STARTUP";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 10);

    const companyName =
      typeof body.companyName === "string" ? body.companyName.trim() : "My Startup";
    const oneLiner =
      typeof body.oneLiner === "string" ? body.oneLiner.trim() || null : null;
    const sector = Array.isArray(body.sector)
      ? body.sector.filter((s: unknown) => typeof s === "string")
      : [];
    const stage =
      typeof body.stage === "string" ? body.stage : "idea";
    const fundingAmount =
      typeof body.fundingAmount === "number" && body.fundingAmount > 0
        ? body.fundingAmount
        : null;
    const website =
      typeof body.website === "string" && body.website
        ? body.website.trim()
        : null;
    const location =
      typeof body.location === "string" ? body.location.trim() || null : null;

    const firmName =
      typeof body.firmName === "string" ? body.firmName.trim() || null : null;
    const sectors = Array.isArray(body.sectors)
      ? body.sectors.filter((s: unknown) => typeof s === "string")
      : [];
    const stages = Array.isArray(body.stages)
      ? body.stages.filter((s: unknown) => typeof s === "string")
      : [];
    const minCheck =
      typeof body.minCheck === "number" && body.minCheck >= 0
        ? body.minCheck
        : null;
    const maxCheck =
      typeof body.maxCheck === "number" && body.maxCheck >= 0
        ? body.maxCheck
        : null;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role,
        startupProfile:
          role === "STARTUP"
            ? {
                create: {
                  companyName,
                  oneLiner,
                  sector,
                  stage,
                  fundingAmount,
                  website,
                  location,
                },
              }
            : undefined,
        investorProfile:
          role === "INVESTOR"
            ? {
                create: {
                  firmName,
                  sectors,
                  stages,
                  minCheck,
                  maxCheck,
                  location,
                },
              }
            : undefined,
      },
      include: {
        startupProfile: true,
        investorProfile: true,
      },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (e) {
    console.error("Register error:", e);
    return NextResponse.json(
      { error: "Registration failed." },
      { status: 500 }
    );
  }
}
