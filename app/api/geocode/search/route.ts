import { NextResponse } from "next/server";
import { searchAddresses } from "@/lib/geocode";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }
  const results = await searchAddresses(q).catch(() => []);
  return NextResponse.json(results);
}
