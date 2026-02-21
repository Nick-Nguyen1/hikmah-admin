import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DiscoverInvestorsClient } from "./discover-investors-client";

export default async function DiscoverInvestorsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "STARTUP") redirect("/dashboard");

  const [investors, myStartup] = await Promise.all([
    prisma.investorProfile.findMany({
      where: { isPublic: true, user: { isDeactivated: false } },
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.startupProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" asChild className="text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900">
          <Link href="/dashboard">← Dashboard</Link>
        </Button>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-emerald-900">Discover investors</h1>
      <p className="mb-6 text-muted-foreground">
          Browse investors, shortlist, and send match requests.
        </p>
        <DiscoverInvestorsClient
          initialInvestors={investors}
          myStartupId={myStartup?.id ?? null}
        />
    </div>
  );
}
