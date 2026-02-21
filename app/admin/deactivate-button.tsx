"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeactivateButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDeactivated: true }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="text-xs text-destructive hover:underline disabled:opacity-50"
    >
      {loading ? "…" : "Deactivate"}
    </button>
  );
}
