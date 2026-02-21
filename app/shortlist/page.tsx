import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestMatchButton } from "@/app/discover/investors/request-match-button";
import { ShortlistButton } from "@/app/discover/investors/shortlist-button";
import { ProfileAvatar } from "@/components/profile-avatar";

export default async function ShortlistPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "STARTUP") redirect("/dashboard");

  const [shortlist, myStartup] = await Promise.all([
    prisma.investorShortlist.findMany({
      where: { userId: session.user.id },
      include: {
        investor: {
          include: { user: { select: { name: true, email: true } } },
        },
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
          <Link href="/discover/investors">← Discover investors</Link>
        </Button>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-emerald-900">My shortlist</h1>
        <p className="mb-6 text-muted-foreground">
          Investors you saved. Send a match request when ready.
        </p>
        {shortlist.length === 0 ? (
          <p className="text-muted-foreground">No investors in your shortlist yet.</p>
        ) : (
          <div className="space-y-4">
            {shortlist.map((s) => (
              <Card key={s.id} className="border-emerald-100 shadow-sm">
                <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                  <div className="flex items-start gap-3">
                    <ProfileAvatar
                      imageUrl={s.investor.imageUrl}
                      name={s.investor.firmName ?? s.investor.user.name ?? "Investor"}
                      size="md"
                    />
                    <div>
                      <CardTitle className="text-lg">
                        {s.investor.firmName ?? s.investor.user.name ?? "Investor"}
                      </CardTitle>
                      <CardDescription>{s.investor.bio ?? "—"}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {myStartup && (
                      <RequestMatchButton
                        startupId={myStartup.id}
                        investorId={s.investor.id}
                      />
                    )}
                    <ShortlistButton investorId={s.investor.id} />
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  {s.investor.sectors?.length > 0 && (
                    <p>
                      <span className="font-medium">Sectors:</span>{" "}
                      {s.investor.sectors.join(", ")}
                    </p>
                  )}
                  {s.investor.location && (
                    <p>
                      <span className="font-medium">Location:</span> {s.investor.location}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}
