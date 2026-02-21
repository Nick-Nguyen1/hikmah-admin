"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STATUSES = ["NONE", "REVIEWED", "PASSED", "MEETING_SCHEDULED"] as const;

export function InvestorStatusForm({
  matchId,
  currentStatus,
  currentNotes,
}: {
  matchId: string;
  currentStatus: string;
  currentNotes: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(currentNotes ?? "");
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    await fetch(`/api/match/${matchId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        investorStatus: status,
        investorNotes: notes || null,
      }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="mt-6 rounded-lg border p-4 space-y-4">
      <h3 className="font-medium">Pipeline status & notes</h3>
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={status === s ? "default" : "outline"}
            onClick={() => setStatus(s)}
          >
            {s.replace("_", " ")}
          </Button>
        ))}
      </div>
      <div>
        <label className="text-sm font-medium">Private notes</label>
        <Input
          className="mt-1"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (only visible to you)"
        />
      </div>
      <Button size="sm" onClick={save} disabled={loading}>
        {loading ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}
