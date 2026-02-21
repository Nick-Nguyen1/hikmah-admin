"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Item = { id: string; companyName: string; url: string | null; description: string | null };

export function PortfolioSection() {
  const router = useRouter();
  const [list, setList] = useState<Item[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/me/portfolio")
      .then((r) => r.json())
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!companyName.trim() || loading) return;
    setLoading(true);
    const res = await fetch("/api/me/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: companyName.trim(),
        url: url.trim() || null,
        description: description.trim() || null,
      }),
    });
    setLoading(false);
    if (res.ok) {
      const item = await res.json();
      setList((prev) => [...prev, item]);
      setCompanyName("");
      setUrl("");
      setDescription("");
      router.refresh();
    }
  }

  async function remove(id: string) {
    await fetch(`/api/me/portfolio?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setList((prev) => prev.filter((i) => i.id !== id));
    router.refresh();
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
        <CardDescription>Past or current investments.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {list.map((i) => (
            <li key={i.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
              <span>
                <strong>{i.companyName}</strong>
                {i.url && (
                  <a href={i.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary">
                    Link
                  </a>
                )}
                {i.description && <span className="ml-2 text-muted-foreground">— {i.description}</span>}
              </span>
              <Button type="button" variant="ghost" size="sm" onClick={() => remove(i.id)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
        <form onSubmit={add} className="flex flex-wrap gap-2">
          <Input
            placeholder="Company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="max-w-[180px]"
          />
          <Input
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="max-w-[200px]"
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="max-w-[200px]"
          />
          <Button type="submit" size="sm" disabled={loading || !companyName.trim()}>
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
