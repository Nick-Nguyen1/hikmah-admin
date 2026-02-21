import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShortlistStartupButton } from "@/app/discover/startups/shortlist-startup-button";
import { ProfileAvatar } from "@/components/profile-avatar";

export default async function ShortlistStartupsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "INVESTOR") redirect("/dashboard");

  const shortlist = await prisma.startupShortlist.findMany({
    where: { userId: session.user.id },
    include: {
      startup: {
        include: { user: { select: { name: true, email: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" asChild className="text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900">
          <Link href="/discover/startups">← Discover startups</Link>
        </Button>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-emerald-900">My shortlist</h1>
        <p className="mb-6 text-muted-foreground">
          Startups you saved for your deal flow.
        </p>
        {shortlist.length === 0 ? (
          <p className="text-muted-foreground">No startups in your shortlist yet.</p>
        ) : (
          <div className="space-y-4">
            {shortlist.map((s) => (
              <Card key={s.id} className="border-emerald-100 shadow-sm">
                <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                  <div className="flex items-start gap-3">
                    <ProfileAvatar
                      imageUrl={s.startup.imageUrl}
                      name={s.startup.companyName}
                      size="md"
                    />
                    <div>
                      <CardTitle className="text-lg">{s.startup.companyName}</CardTitle>
                      <CardDescription>{s.startup.oneLiner ?? "—"}</CardDescription>
                    </div>
                  </div>
                  <ShortlistStartupButton startupId={s.startup.id} />
                </CardHeader>
                <CardContent className="text-sm">
                  <p>
                    <span className="font-medium">Stage:</span> {s.startup.stage}
                  </p>
                  {s.startup.sector?.length > 0 && (
                    <p>
                      <span className="font-medium">Sector:</span>{" "}
                      {s.startup.sector.join(", ")}
                    </p>
                  )}
                  <p className="text-muted-foreground">
                    Contact: {s.startup.user.name ?? s.startup.user.email}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}
