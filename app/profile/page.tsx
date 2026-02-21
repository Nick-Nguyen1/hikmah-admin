import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileEditForm } from "./profile-edit-form";
import { startupCompleteness, investorCompleteness } from "@/lib/profile-completeness";
import { TeamSection } from "./team-section";
import { PortfolioSection } from "./portfolio-section";
import { ProfileAvatar } from "@/components/profile-avatar";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      startupProfile: { include: { teamMembers: true } },
      investorProfile: { include: { portfolio: true } },
    },
  });

  if (!user) redirect("/dashboard");

  const profile = user.startupProfile ?? user.investorProfile;
  if (!profile) redirect("/dashboard");

  const completeness =
    user.startupProfile != null
      ? startupCompleteness(user.startupProfile)
      : user.investorProfile != null
        ? investorCompleteness(user.investorProfile)
        : 0;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Button variant="ghost" asChild className="text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900">
          <Link href="/dashboard">← Dashboard</Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="border-emerald-700 text-emerald-800 hover:bg-emerald-50">
          <Link href="/settings">Settings</Link>
        </Button>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-emerald-900">Profile</h1>
        <p className="mb-2 text-muted-foreground">
          Update your profile so others can find you.
        </p>
        <div className="mb-6">
          <div className="flex justify-between text-sm">
            <span>Profile completeness</span>
            <span>{completeness}%</span>
          </div>
          <div className="mt-1 h-2 w-full rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all"
            style={{ width: `${completeness}%` }}
          />
          </div>
        </div>

        {user.startupProfile ? (
          <Card className="border-emerald-100 shadow-sm">
            <CardHeader className="flex flex-row items-start gap-4">
              <ProfileAvatar
                imageUrl={user.startupProfile.imageUrl}
                name={user.startupProfile.companyName}
                size="lg"
              />
              <div>
                <CardTitle className="text-emerald-900">Startup profile</CardTitle>
                <CardDescription>Company details</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ProfileEditForm
                type="startup"
                profile={user.startupProfile}
                userId={user.id}
              />
            </CardContent>
          </Card>
        ) : user.investorProfile ? (
          <Card className="border-emerald-100 shadow-sm">
            <CardHeader className="flex flex-row items-start gap-4">
              <ProfileAvatar
                imageUrl={user.investorProfile.imageUrl}
                name={user.investorProfile.firmName ?? user.name ?? "Investor"}
                size="lg"
              />
              <div>
                <CardTitle className="text-emerald-900">Investor profile</CardTitle>
                <CardDescription>Focus and criteria</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ProfileEditForm
                type="investor"
                profile={user.investorProfile}
                userId={user.id}
              />
            </CardContent>
          </Card>
        ) : null}

        {user.startupProfile && <TeamSection />}
      {user.investorProfile && <PortfolioSection />}
    </div>
  );
}
