import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HikmahLogo } from "@/components/landing/hikmah-logo";
import { GeometricPattern } from "@/components/landing/geometric-pattern";
import { HeroIllustration } from "@/components/landing/hero-illustration";
import { Scale, Handshake, Leaf } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <header className="relative border-b border-emerald-900/10 bg-gradient-to-b from-emerald-50 to-white">
        <GeometricPattern className="text-emerald-900" />
        <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <HikmahLogo />
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild className="bg-emerald-700 text-white hover:bg-emerald-800">
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </nav>
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-emerald-700">
              The platform for ethical growth
            </p>
              <h1 className="text-4xl font-bold tracking-tight text-emerald-900 sm:text-5xl md:text-6xl">
                Muslim investors.
                <br />
                <span className="text-emerald-700">Shariah-compliant</span> businesses.
              </h1>
              <p className="mt-6 text-lg text-emerald-800/90 sm:text-xl">
                Hikmah Investors connects investors who seek halal returns with
                businesses built on Islamic principles. No interest. No ambiguity.
                Just aligned values and real growth.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4 lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-700 px-8 text-base text-white hover:bg-emerald-800"
                >
                  <Link href="/register">Join as investor</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-emerald-700 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900"
                >
                  <Link href="/register">Register your business</Link>
                </Button>
              </div>
            </div>
            <div className="hidden shrink-0 lg:block">
              <HeroIllustration className="h-64 w-80 text-emerald-700" />
            </div>
          </div>
        </section>
      </header>

      {/* Value props */}
      <section className="border-b border-border bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-sm font-medium uppercase tracking-widest text-emerald-700">
            Why Hikmah?
          </p>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-emerald-900 sm:text-4xl">
            Built for this niche
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Unlike generic crowdfunding, we focus only on Muslim investors and
            Shariah-compliant ventures—so matches are values-aligned from day one.
          </p>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Scale className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-semibold text-emerald-900">Shariah-first</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Businesses and deals screened for compliance. Investors can deploy
                capital with confidence.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Handshake className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-semibold text-emerald-900">Direct matching</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No middlemen. Create a profile, discover startups or investors, and
                request introductions that fit your criteria.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Leaf className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-semibold text-emerald-900">Ethical growth</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Align profit with principle. Support ventures that avoid interest and
                harmful industries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-b from-emerald-800 to-emerald-900 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to invest or raise—the halal way?
          </h2>
          <p className="mt-4 text-lg text-emerald-100">
            Create a free profile. Connect with investors or businesses that share
            your values.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-emerald-900 hover:bg-emerald-50"
            >
              <Link href="/register">Get started</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <HikmahLogo />
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
