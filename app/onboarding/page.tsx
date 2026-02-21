import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompleteOnboardingButton } from "./complete-onboarding-button";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const steps = [
    { title: "Complete your profile", href: "/profile", description: "Add company or firm details, sectors, and stage." },
    { title: "Set your preferences", href: "/settings", description: "Choose notification and visibility settings." },
    { title: "Discover matches", href: session.user.role === "STARTUP" ? "/discover/investors" : "/discover/startups", description: "Browse and shortlist or send match requests." },
  ];

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-2 text-2xl font-bold text-emerald-900">Welcome! Get started in 3 steps</h1>
      <p className="mb-6 text-muted-foreground">
        Complete these to get the most out of the platform.
      </p>
      <div className="space-y-4">
        {steps.map((step, i) => (
          <Card key={step.href} className="border-emerald-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-emerald-900">
                {i + 1}. {step.title}
              </CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="sm" className="bg-emerald-700 hover:bg-emerald-800">
                <Link href={step.href}>{step.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <CompleteOnboardingButton />
      </div>
    </div>
  );
}
