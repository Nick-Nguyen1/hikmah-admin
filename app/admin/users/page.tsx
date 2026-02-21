import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { DeactivateButton } from "../deactivate-button";
import { ProfileAvatar } from "@/components/profile-avatar";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user?.id || !session.user.isAdmin) redirect("/dashboard");

  const users = await prisma.user.findMany({
    where: { isDeactivated: false },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      startupProfile: { select: { companyName: true, oneLiner: true, imageUrl: true } },
      investorProfile: { select: { firmName: true, bio: true, imageUrl: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" asChild className="text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900">
          <Link href="/admin">← Admin</Link>
        </Button>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-emerald-900">All users</h1>
      <p className="mb-6 text-muted-foreground">
        Users (deactivated excluded). Click to see details.
      </p>
      <div className="space-y-4">
        {users.map((u) => (
          <Card key={u.id} className="border-emerald-100 shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
              <div className="flex items-start gap-3">
                <ProfileAvatar
                  imageUrl={u.startupProfile?.imageUrl ?? u.investorProfile?.imageUrl}
                  name={u.startupProfile?.companyName ?? u.investorProfile?.firmName ?? u.name ?? u.email}
                  size="md"
                />
                <div>
                  <CardTitle className="text-base">
                    {u.name ?? "—"} · {u.email}
                  </CardTitle>
                <CardDescription>
                  Role: {u.role} · Joined {new Date(u.createdAt).toLocaleDateString()}
                </CardDescription>
                </div>
              </div>
              <DeactivateButton userId={u.id} />
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {u.startupProfile && (
                <div>
                  <span className="font-medium text-emerald-900">Startup:</span>{" "}
                  {u.startupProfile.companyName}
                  {u.startupProfile.oneLiner && (
                    <span className="text-muted-foreground"> — {u.startupProfile.oneLiner}</span>
                  )}
                </div>
              )}
              {u.investorProfile && (
                <div>
                  <span className="font-medium text-emerald-900">Investor:</span>{" "}
                  {u.investorProfile.firmName ?? "—"}
                  {u.investorProfile.bio && (
                    <p className="mt-1 text-muted-foreground">{u.investorProfile.bio}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
