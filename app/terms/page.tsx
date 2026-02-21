import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Button variant="ghost" asChild className="text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900">
        <Link href="/">← Back</Link>
      </Button>
      <h1 className="mt-6 text-2xl font-bold text-emerald-900">Terms of Use</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="prose prose-sm mt-6 prose-headings:text-emerald-900 dark:prose-invert">
          <p>
            By using this platform you agree to use it in good faith to connect startups and investors.
            We do not provide investment advice. Matching or introductions do not guarantee funding.
          </p>
          <p>
            You are responsible for your own due diligence. We are not liable for any decisions made
            based on profiles or communications on this platform.
          </p>
          <p>
            We may update these terms from time to time. Continued use after changes constitutes
            acceptance.
          </p>
      </div>
    </div>
  );
}
