import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/profile-avatar";
import { prisma } from "@/lib/db";

export default async function AdminInvestorsPage() {
  const session = await auth();
  if (!session?.user?.id || !session.user.isAdmin) redirect("/dashboard");

  const investors = await prisma.investorProfile.findMany({
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
      <h1 className="mb-2 text-2xl font-bold text-emerald-900">All investors</h1>
      <p className="mb-6 text-muted-foreground">
        Muslim investors on the platform.
      </p>
      <div className="space-y-4">
        {investors.map((inv) => (
          <Card key={inv.id} className="border-emerald-100 shadow-sm">
            <CardHeader className="flex flex-row items-start gap-3 pb-2">
              <ProfileAvatar
                imageUrl={inv.imageUrl}
                name={inv.firmName ?? inv.user.name ?? "Investor"}
                size="md"
              />
              <div>
                <CardTitle className="text-base text-emerald-900">
                  {inv.firmName ?? inv.user.name ?? "Investor"}
                </CardTitle>
                <CardDescription>
                  {inv.user.email}
                  {inv.location && ` · ${inv.location}`}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {inv.bio && (
                <p className="text-muted-foreground">{inv.bio}</p>
              )}
              {inv.sectors.length > 0 && (
                <p><span className="font-medium">Sectors:</span> {inv.sectors.join(", ")}</p>
              )}
              {inv.stages.length > 0 && (
                <p><span className="font-medium">Stages:</span> {inv.stages.join(", ")}</p>
              )}
              {(inv.minCheck != null || inv.maxCheck != null) && (
                <p>
                  <span className="font-medium">Check size:</span>{" "}
                  {inv.minCheck != null && inv.maxCheck != null
                    ? `${inv.minCheck}K – ${inv.maxCheck}K`
                    : inv.minCheck != null
                      ? `${inv.minCheck}K+`
                      : `Up to ${inv.maxCheck}K`}
                </p>
              )}
              {inv.website && (
                <p>
                  <a href={inv.website} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">
                    {inv.website}
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
