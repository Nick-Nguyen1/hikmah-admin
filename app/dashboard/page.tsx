import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const cardClass = "border-emerald-100 bg-white shadow-sm";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const isStartup = session.user.role === "STARTUP";
  const isInvestor = session.user.role === "INVESTOR";

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-emerald-900">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name || session.user.email}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {isStartup && (
          <Card className={cardClass}>
            <CardHeader>
              <CardTitle className="text-emerald-900">Find investors</CardTitle>
              <CardDescription>
                Browse Muslim investors and send match requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
                <Link href="/discover/investors">Discover investors</Link>
              </Button>
            </CardContent>
          </Card>
        )}
        {isInvestor && (
          <Card className={cardClass}>
            <CardHeader>
              <CardTitle className="text-emerald-900">Deal flow</CardTitle>
              <CardDescription>
                Browse Shariah-compliant startups that match your criteria.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
                <Link href="/discover/startups">Discover startups</Link>
              </Button>
            </CardContent>
          </Card>
        )}
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle className="text-emerald-900">Match requests</CardTitle>
            <CardDescription>
              View and manage your sent or received match requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="border-emerald-700 text-emerald-800 hover:bg-emerald-50">
              <Link href="/matches">View matches</Link>
            </Button>
            {isInvestor && (
              <Button asChild variant="outline" size="sm" className="border-emerald-700 text-emerald-800 hover:bg-emerald-50">
                <a href="/api/me/export" download="deal-flow.csv">Export deal flow (CSV)</a>
              </Button>
            )}
          </CardContent>
        </Card>
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle className="text-emerald-900">Profile</CardTitle>
            <CardDescription>
              Edit your startup or investor profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="border-emerald-700 text-emerald-800 hover:bg-emerald-50">
              <Link href="/profile">Edit profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
