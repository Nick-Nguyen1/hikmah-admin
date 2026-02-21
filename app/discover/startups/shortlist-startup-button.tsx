"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export function ShortlistStartupButton({ startupId }: { startupId: string }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/shortlist/startups")
      .then((r) => r.json())
      .then((list: { startupId?: string }[]) => {
        setSaved(Array.isArray(list) && list.some((s) => s.startupId === startupId));
      })
      .catch(() => {});
  }, [startupId]);

  async function toggle() {
    setLoading(true);
    if (saved) {
      await fetch(`/api/shortlist/startups?startupId=${encodeURIComponent(startupId)}`, {
        method: "DELETE",
      });
      setSaved(false);
    } else {
      await fetch("/api/shortlist/startups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId }),
      });
      setSaved(true);
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <Button
      size="sm"
      variant={saved ? "default" : "outline"}
      onClick={toggle}
      disabled={loading}
      title={saved ? "Remove from shortlist" : "Add to shortlist"}
    >
      <Star className={`size-4 ${saved ? "fill-current" : ""}`} />
    </Button>
  );
}
