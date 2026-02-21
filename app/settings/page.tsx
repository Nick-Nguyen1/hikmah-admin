import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationSettingsForm } from "./notification-settings-form";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      notifyOnMatchRequest: true,
      notifyOnMatchAccepted: true,
      digestFrequency: true,
    },
  });

  if (!user) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <div className="mb-8">
        <Button variant="ghost" asChild className="text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900">
          <Link href="/profile">← Profile</Link>
        </Button>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-emerald-900">Settings</h1>
      <p className="mb-6 text-muted-foreground">
        Notification and email preferences.
      </p>
      <Card className="border-emerald-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-emerald-900">Notifications</CardTitle>
            <CardDescription>
              Choose when to receive emails.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationSettingsForm
              notifyOnMatchRequest={user.notifyOnMatchRequest}
              notifyOnMatchAccepted={user.notifyOnMatchAccepted}
              digestFrequency={user.digestFrequency}
            />
          </CardContent>
      </Card>
    </div>
  );
}
