import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchStatusBadge } from "./match-status-badge";
import { RespondToMatch } from "./respond-to-match";

export default async function MatchesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const requests = await prisma.matchRequest.findMany({
    where: {
      OR: [
        { senderId: session.user.id },
        { receiverId: session.user.id },
      ],
    },
    include: {
      startup: {
        include: { user: { select: { name: true, email: true } } },
      },
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
          <Link href="/dashboard">← Dashboard</Link>
        </Button>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-emerald-900">Match requests</h1>
        <p className="mb-6 text-muted-foreground">
          Requests you sent or received.
        </p>
        <div className="space-y-4">
          {requests.length === 0 ? (
            <p className="text-muted-foreground">No match requests yet.</p>
          ) : (
            requests.map((r) => {
              const isReceiver = r.receiverId === session.user!.id;
              return (
                <Card key={r.id} className="border-emerald-100 shadow-sm">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                    <div>
                      <CardTitle className="text-lg">
                        <Link href={`/matches/${r.id}`} className="text-emerald-900 hover:underline hover:text-emerald-700">
                          {r.startup.companyName} ↔ {r.investor.firmName ?? r.investor.user.name ?? "Investor"}
                        </Link>
                      </CardTitle>
                      <CardDescription>
                        {isReceiver ? "You received" : "You sent"} this request
                        {" · "}
                        <MatchStatusBadge status={r.status} />
                      </CardDescription>
                    </div>
                    {isReceiver && r.status === "PENDING" && (
                      <RespondToMatch matchId={r.id} />
                    )}
                  </CardHeader>
                  {r.message && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        &ldquo;{r.message}&rdquo;
                      </p>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>
    </div>
  );
}
