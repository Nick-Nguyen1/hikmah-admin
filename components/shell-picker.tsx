"use client";

import { usePathname } from "next/navigation";
import { AuthShell, AppShell } from "@/components/app-shell";

type SessionUser = { name: string | null; email: string; isAdmin?: boolean } | null;

export function ShellPicker({
  children,
  user,
}: {
  children: React.ReactNode;
  user: SessionUser;
}) {
  const pathname = usePathname();
  if (pathname === "/") return <>{children}</>;
  const authPaths = ["/login", "/register", "/terms", "/privacy"];
  if (authPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return <AuthShell>{children}</AuthShell>;
  }
  return <AppShell user={user}>{children}</AppShell>;
}
