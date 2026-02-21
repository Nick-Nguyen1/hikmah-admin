import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/profile-avatar";
import { prisma } from "@/lib/db";

export default async function AdminMatchesPage() {
  const session = await auth();
  if (!session?.user?.id || !session.user.isAdmin) redirect("/dashboard");

  const matches = await prisma.matchRequest.findMany({
    include: {
      startup: { include: { user: { select: { name: true, email: true } } } },
      investor: {
        include: { user: { select: { name: true, email: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" asChild className="text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900">
          <Link href="/admin">← Admin</Link>
        </Button>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-emerald-900">All match requests</h1>
      <p className="mb-6 text-muted-foreground">
        Match requests between startups and investors.
      </p>
      <div className="space-y-4">
        {matches.map((m) => (
          <Card key={m.id} className="border-emerald-100 shadow-sm">
            <CardHeader className="flex flex-row items-start gap-3 pb-2">
              <div className="flex -space-x-1">
                <ProfileAvatar imageUrl={m.startup.imageUrl} name={m.startup.companyName} size="sm" className="ring-2 ring-background" />
                <ProfileAvatar imageUrl={m.investor.imageUrl} name={m.investor.firmName ?? m.investor.user.name ?? "Investor"} size="sm" className="ring-2 ring-background" />
              </div>
              <div>
              <CardTitle className="text-base text-emerald-900">
                {m.startup.companyName} ↔ {m.investor.firmName ?? m.investor.user.name ?? "Investor"}
              </CardTitle>
              <CardDescription>
                Status: {m.status}
                {m.investorStatus !== "NONE" && ` · Pipeline: ${m.investorStatus}`}
                {" · "}
                {new Date(m.createdAt).toLocaleDateString()}
              </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Startup:</span> {m.startup.user.name ?? m.startup.user.email}
              </p>
              <p>
                <span className="font-medium">Investor:</span> {m.investor.user.name ?? m.investor.user.email}
              </p>
              {m.message && (
                <p className="text-muted-foreground">&ldquo;{m.message}&rdquo;</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
