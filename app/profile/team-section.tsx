"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Member = { id: string; name: string; role: string; linkedInUrl: string | null };

export function TeamSection() {
  const router = useRouter();
  const [list, setList] = useState<Member[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/me/team")
      .then((r) => r.json())
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !role.trim() || loading) return;
    setLoading(true);
    const res = await fetch("/api/me/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), role: role.trim(), linkedInUrl: linkedInUrl.trim() || null }),
    });
    setLoading(false);
    if (res.ok) {
      const member = await res.json();
      setList((prev) => [...prev, member]);
      setName("");
      setRole("");
      setLinkedInUrl("");
      router.refresh();
    }
  }

  async function remove(id: string) {
    await fetch(`/api/me/team?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setList((prev) => prev.filter((m) => m.id !== id));
    router.refresh();
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Team / founders</CardTitle>
        <CardDescription>Add co-founders or team members.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {list.map((m) => (
            <li key={m.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
              <span>
                <strong>{m.name}</strong> — {m.role}
                {m.linkedInUrl && (
                  <a href={m.linkedInUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary">
                    LinkedIn
                  </a>
                )}
              </span>
              <Button type="button" variant="ghost" size="sm" onClick={() => remove(m.id)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
        <form onSubmit={add} className="flex flex-wrap gap-2">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-[140px]"
          />
          <Input
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="max-w-[120px]"
          />
          <Input
            placeholder="LinkedIn URL"
            value={linkedInUrl}
            onChange={(e) => setLinkedInUrl(e.target.value)}
            className="max-w-[200px]"
          />
          <Button type="submit" size="sm" disabled={loading || !name.trim() || !role.trim()}>
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
