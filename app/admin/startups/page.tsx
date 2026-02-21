import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/profile-avatar";
import { prisma } from "@/lib/db";

export default async function AdminStartupsPage() {
  const session = await auth();
  if (!session?.user?.id || !session.user.isAdmin) redirect("/dashboard");

  const startups = await prisma.startupProfile.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
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
      <h1 className="mb-2 text-2xl font-bold text-emerald-900">All startups</h1>
      <p className="mb-6 text-muted-foreground">
        Shariah-compliant businesses on the platform.
      </p>
      <div className="space-y-4">
        {startups.map((s) => (
          <Card key={s.id} className="border-emerald-100 shadow-sm">
            <CardHeader className="flex flex-row items-start gap-3 pb-2">
              <ProfileAvatar imageUrl={s.imageUrl} name={s.companyName} size="md" />
              <div>
                <CardTitle className="text-base text-emerald-900">{s.companyName}</CardTitle>
                <CardDescription>
                  {s.user.name ?? s.user.email} · Stage: {s.stage}
                  {s.location && ` · ${s.location}`}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {s.oneLiner && (
                <p><span className="font-medium">One-liner:</span> {s.oneLiner}</p>
              )}
              {s.description && (
                <p className="text-muted-foreground">{s.description}</p>
              )}
              {s.sector.length > 0 && (
                <p><span className="font-medium">Sector:</span> {s.sector.join(", ")}</p>
              )}
              {s.fundingAmount != null && (
                <p><span className="font-medium">Funding sought:</span> {s.fundingAmount}K</p>
              )}
              {s.website && (
                <p>
                  <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">
                    {s.website}
                  </a>
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
