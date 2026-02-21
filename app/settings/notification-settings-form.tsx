"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Digest = "NONE" | "DAILY" | "WEEKLY";

export function NotificationSettingsForm({
  notifyOnMatchRequest,
  notifyOnMatchAccepted,
  digestFrequency,
}: {
  notifyOnMatchRequest: boolean;
  notifyOnMatchAccepted: boolean;
  digestFrequency: string;
}) {
  const router = useRouter();
  const [notifyRequest, setNotifyRequest] = useState(notifyOnMatchRequest);
  const [notifyAccepted, setNotifyAccepted] = useState(notifyOnMatchAccepted);
  const [digest, setDigest] = useState<Digest>(
    digestFrequency === "DAILY" || digestFrequency === "WEEKLY" ? digestFrequency : "NONE"
  );
  const [loading, setLoading] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/me/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notifyOnMatchRequest: notifyRequest,
        notifyOnMatchAccepted: notifyAccepted,
        digestFrequency: digest,
      }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={notifyRequest}
          onChange={(e) => setNotifyRequest(e.target.checked)}
        />
        <span className="text-sm">Email when I receive a new match request</span>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={notifyAccepted}
          onChange={(e) => setNotifyAccepted(e.target.checked)}
        />
        <span className="text-sm">Email when my match request is accepted</span>
      </label>
      <div>
        <label className="text-sm font-medium">Digest (new startups/investors)</label>
        <select
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={digest}
          onChange={(e) => setDigest(e.target.value as Digest)}
        >
          <option value="NONE">None</option>
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
        </select>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
