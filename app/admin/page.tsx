import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeactivateButton } from "./deactivate-button";
async function getStats(cookie: string) {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/admin/stats`, {
    cache: "no-store",
    headers: { cookie },
  });
  if (!res.ok) return null;
  return res.json();
}

async function getUsers(cookie: string) {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/admin/users`, {
    cache: "no-store",
    headers: { cookie },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id || !session.user.isAdmin) {
    redirect("/dashboard");
  }
  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  const [stats, users] = await Promise.all([getStats(cookie), getUsers(cookie)]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" asChild className="text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900">
          <Link href="/dashboard">← Dashboard</Link>
        </Button>
      </div>
      <h1 className="mb-6 text-2xl font-bold text-emerald-900">Admin</h1>

      {stats && (
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/users" className="block focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 rounded-xl">
            <Card className="border-emerald-100 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-emerald-900">{stats.totalUsers}</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/startups" className="block focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 rounded-xl">
            <Card className="border-emerald-100 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Startups</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-emerald-900">{stats.totalStartups}</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/investors" className="block focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 rounded-xl">
            <Card className="border-emerald-100 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Investors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-emerald-900">{stats.totalInvestors}</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/matches" className="block focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 rounded-xl">
            <Card className="border-emerald-100 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-emerald-900">{stats.totalMatches}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingMatches} pending · {stats.acceptedMatches} accepted
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      <Card className="border-emerald-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-emerald-900">Users</CardTitle>
            <CardDescription>Recent users (deactivated excluded)</CardDescription>
          </CardHeader>
          <CardContent>
            {Array.isArray(users) && users.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {users.slice(0, 50).map((u: { id: string; email: string; name: string | null; role: string }) => (
                  <li key={u.id} className="flex justify-between">
                    <span>
                      {u.email} · {u.name ?? "—"} · {u.role}
                    </span>
                    <DeactivateButton userId={u.id} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No users or unable to load.</p>
            )}
          </CardContent>
      </Card>
    </div>
  );
}

