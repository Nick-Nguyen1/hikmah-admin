import Link from "next/link";
import { HikmahLogo } from "@/components/landing/hikmah-logo";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/sign-out-button";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/50 to-background">
      <header className="border-b border-emerald-900/10 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 rounded">
            <HikmahLogo />
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" asChild className="text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild className="bg-emerald-700 text-white hover:bg-emerald-800">
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-muted/30 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <Link href="/"><HikmahLogo /></Link>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground hover:underline">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground hover:underline">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

type AppShellProps = {
  children: React.ReactNode;
  user: { name: string | null; email: string; isAdmin?: boolean } | null;
};

export function AppShell({ children, user }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 to-background">
      <header className="border-b border-emerald-900/10 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 rounded">
            <HikmahLogo />
          </Link>
          <nav className="flex items-center gap-3">
            {user && (
              <>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  {user.name || user.email}
                </span>
                {user.isAdmin && (
                  <Button variant="outline" size="sm" asChild className="border-emerald-700 text-emerald-800 hover:bg-emerald-50">
                    <Link href="/admin">Admin</Link>
                  </Button>
                )}
                <SignOutButton className="border-emerald-700 text-emerald-800 hover:bg-emerald-50" />
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-muted/30 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <Link href="/dashboard"><HikmahLogo /></Link>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground hover:underline">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground hover:underline">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
