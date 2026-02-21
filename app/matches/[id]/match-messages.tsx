"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MatchMessages({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [messages, setMessages] = useState<{ id: string; body: string; createdAt: string; sender: { id: string; name: string | null } }[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/match/${matchId}/messages`)
      .then((r) => r.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = body.trim();
    if (!text || loading) return;
    setLoading(true);
    const res = await fetch(`/api/match/${matchId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: text }),
    });
    setLoading(false);
    setBody("");
    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Messages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {messages.map((m) => (
            <div
              key={m.id}
              className="rounded-md border bg-muted/50 px-3 py-2 text-sm"
            >
              <p className="font-medium text-muted-foreground">{m.sender.name ?? "User"}</p>
              <p>{m.body}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(m.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <Input
            placeholder="Type a message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button type="submit" disabled={loading || !body.trim()}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
