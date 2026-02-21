import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DiscoverStartupsClient } from "./discover-startups-client";

export default async function DiscoverStartupsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "INVESTOR") redirect("/dashboard");

  const startups = await prisma.startupProfile.findMany({
    where: { isPublic: true, user: { isDeactivated: false } },
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" asChild className="text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900">
          <Link href="/dashboard">← Dashboard</Link>
        </Button>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-emerald-900">Discover startups</h1>
      <p className="mb-6 text-muted-foreground">
          Browse startups, shortlist, and export deal flow.
        </p>
        <DiscoverStartupsClient initialStartups={startups} />
    </div>
  );
}
