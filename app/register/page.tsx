"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Role = "STARTUP" | "INVESTOR";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("STARTUP");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [firmName, setFirmName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: name || undefined,
          role,
          companyName: role === "STARTUP" ? companyName || "My Startup" : undefined,
          oneLiner: role === "STARTUP" ? oneLiner || undefined : undefined,
          firmName: role === "INVESTOR" ? firmName || undefined : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }
      router.push("/login?registered=1");
      router.refresh();
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md border-emerald-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-emerald-900">Create an account</CardTitle>
          <CardDescription>
            Choose whether you&apos;re a Shariah-compliant business or an investor, then fill in your details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <div className="flex gap-4 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-emerald-900">
                <input
                  type="radio"
                  name="role"
                  checked={role === "STARTUP"}
                  onChange={() => setRole("STARTUP")}
                  className="h-4 w-4 accent-emerald-700"
                />
                Business
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-emerald-900">
                <input
                  type="radio"
                  name="role"
                  checked={role === "INVESTOR"}
                  onChange={() => setRole("INVESTOR")}
                  className="h-4 w-4 accent-emerald-700"
                />
                Investor
              </label>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password (min 8 characters)
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Your name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            {role === "STARTUP" && (
              <>
                <div className="space-y-2">
                  <label htmlFor="companyName" className="text-sm font-medium">
                    Company name
                  </label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Acme Inc"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="oneLiner" className="text-sm font-medium">
                    One-liner
                  </label>
                  <Input
                    id="oneLiner"
                    type="text"
                    placeholder="We help teams ship faster"
                    value={oneLiner}
                    onChange={(e) => setOneLiner(e.target.value)}
                  />
                </div>
              </>
            )}
            {role === "INVESTOR" && (
              <div className="space-y-2">
                <label htmlFor="firmName" className="text-sm font-medium">
                  Firm name (optional)
                </label>
                <Input
                  id="firmName"
                  type="text"
                  placeholder="Venture Partners"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                />
              </div>
            )}
            <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-emerald-700 underline hover:text-emerald-800">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
