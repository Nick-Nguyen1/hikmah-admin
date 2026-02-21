import { NextResponse } from "next/server";
import { geocodeAddress } from "@/lib/geocode";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address")?.trim();
  if (!address) {
    return NextResponse.json(
      { error: "Missing address parameter." },
      { status: 400 }
    );
  }
  const coords = await geocodeAddress(address).catch(() => null);
  if (!coords) {
    return NextResponse.json(
      { error: "Could not find location for that address." },
      { status: 404 }
    );
  }
  return NextResponse.json(coords);
}
