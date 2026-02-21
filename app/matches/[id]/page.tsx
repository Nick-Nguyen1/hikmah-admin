import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchStatusBadge } from "@/app/matches/match-status-badge";
import { RespondToMatch } from "@/app/matches/respond-to-match";
import { MatchMessages } from "./match-messages";
import { InvestorStatusForm } from "./investor-status-form";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { id } = await params;

  const match = await prisma.matchRequest.findUnique({
    where: { id },
    include: {
      startup: { include: { user: { select: { name: true, email: true } } } },
      investor: {
        include: { user: { select: { name: true, email: true } } },
      },
    },
  });

  if (!match) notFound();
  const isParticipant =
    match.senderId === session.user.id || match.receiverId === session.user.id;
  if (!isParticipant) redirect("/matches");

  const isReceiver = match.receiverId === session.user.id;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" asChild className="text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900">
          <Link href="/matches">← Matches</Link>
        </Button>
      </div>
      <Card className="border-emerald-100 shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-emerald-900">
                {match.startup.companyName} ↔{" "}
                {match.investor.firmName ?? match.investor.user.name ?? "Investor"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                <MatchStatusBadge status={match.status} />
                {match.investorStatus !== "NONE" && (
                  <span className="ml-2">Pipeline: {match.investorStatus}</span>
                )}
              </p>
            </div>
            {isReceiver && match.status === "PENDING" && (
              <RespondToMatch matchId={match.id} />
            )}
          </CardHeader>
          {match.message && (
            <CardContent>
              <p className="text-sm text-muted-foreground">&ldquo;{match.message}&rdquo;</p>
            </CardContent>
          )}
        </Card>

        {isReceiver && session.user.role === "INVESTOR" && match.status === "ACCEPTED" && (
          <InvestorStatusForm
            matchId={match.id}
            currentStatus={match.investorStatus}
            currentNotes={match.investorNotes}
          />
        )}

        {match.status === "ACCEPTED" && (
          <div className="mt-6">
            <MatchMessages matchId={match.id} />
          </div>
        )}

        {(match.startup.calendarUrl || match.investor.calendarUrl) && match.status === "ACCEPTED" && (
        <Card className="mt-6 border-emerald-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-emerald-900">Book a call</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              {match.startup.calendarUrl && (
                <Button asChild size="sm" className="bg-emerald-700 hover:bg-emerald-800">
                  <a href={match.startup.calendarUrl} target="_blank" rel="noopener noreferrer">
                    Startup&apos;s calendar
                  </a>
                </Button>
              )}
              {match.investor.calendarUrl && (
                <Button asChild size="sm" variant="outline" className="border-emerald-700 text-emerald-800 hover:bg-emerald-50">
                  <a href={match.investor.calendarUrl} target="_blank" rel="noopener noreferrer">
                    Investor&apos;s calendar
                  </a>
                </Button>
              )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
