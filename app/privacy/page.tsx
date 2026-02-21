import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Button variant="ghost" asChild className="text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900">
        <Link href="/">← Back</Link>
      </Button>
      <h1 className="mt-6 text-2xl font-bold text-emerald-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="prose prose-sm mt-6 prose-headings:text-emerald-900 dark:prose-invert">
          <p>
            We collect the information you provide when registering and in your profile (e.g. name,
            email, company details, sectors, stages). We use it to operate the matching platform and
            to send you notifications you have opted into.
          </p>
          <p>
            Profile information may be visible to other users according to your visibility settings.
            We do not sell your data to third parties.
          </p>
          <p>
            We may retain your data for as long as your account is active and for a reasonable
            period thereafter for legal and operational purposes.
          </p>
      </div>
    </div>
  );
}
