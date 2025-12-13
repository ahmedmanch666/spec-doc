import React, { useMemo, useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Page } from "@shared/schema";
import { fetchJson, HttpError } from "@/lib/http";

async function fetchPages(): Promise<Page[]> {
  return fetchJson<Page[]>("/api/admin/pages", { credentials: "include" });
}

async function patchPage(id: string, data: Partial<Page>): Promise<Page> {
  return fetchJson<Page>(`/api/admin/pages/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
}

export default function PagesEdit() {
  const [, params] = useRoute("/admin/pages/:id");
  const queryClient = useQueryClient();
  const { data: pages = [], isLoading, isError, error } = useQuery({
    queryKey: ["admin-pages"],
    queryFn: fetchPages,
  });

  const isDbMissing = error instanceof HttpError && error.status === 503;

  const current = useMemo(() => pages.find((p) => p.id === params?.id), [pages, params]);
  const [form, setForm] = useState<Partial<Page> | null>(null);

  React.useEffect(() => {
    if (current) {
      setForm({
        title: current.title,
        slug: current.slug,
        status: current.status,
        content: current.content,
      });
    }
  }, [current]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<Page>) => patchPage(current!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pages"] });
      alert("Saved");
    },
  });

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (isError && isDbMissing) {
    return (
      <div className="rounded-lg border bg-muted/20 p-4">
        <p className="font-medium">Database not connected</p>
        <p className="text-sm text-muted-foreground mt-1">
          Connect a Postgres database and set <code>DATABASE_URL</code> in Vercel.
        </p>
      </div>
    );
  }
  if (isError) return <p className="text-destructive">Failed to load</p>;
  if (!current || !form) return <p className="text-muted-foreground">Page not found</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Edit Page</h1>

      <Card>
        <CardHeader>
          <CardTitle>Layout & Meta</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={form.title as string}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>
            <Input
              value={form.slug as string}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Input
              value={form.status as string}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium">Content (JSON)</label>
            <Textarea
              value={JSON.stringify(form.content ?? {}, null, 2)}
              onChange={(e) => {
                try {
                  const json = JSON.parse(e.target.value);
                  setForm({ ...form, content: json });
                } catch {
                  // ignore parse errors in live typing
                }
              }}
              className="min-h-[240px] font-mono text-xs"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          className="bg-primary text-white"
          onClick={() => mutation.mutate(form!)}
          disabled={mutation.isPending}
        >
          Save
        </Button>
        <Button variant="outline" onClick={() => setForm(null)}>
          Reset
        </Button>
      </div>
    </div>
  );
}
