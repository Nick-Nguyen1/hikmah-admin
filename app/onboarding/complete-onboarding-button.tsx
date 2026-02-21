"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CompleteOnboardingButton() {
  const router = useRouter();

  async function complete() {
    await fetch("/api/me/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Button onClick={complete} className="bg-emerald-700 hover:bg-emerald-800">
      I&apos;m done — go to dashboard
    </Button>
  );
}
