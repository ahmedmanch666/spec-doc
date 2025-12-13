import React, { useMemo, useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { CaseStudy } from "@shared/schema";
import { fetchJson, HttpError } from "@/lib/http";

async function fetchCases(): Promise<CaseStudy[]> {
  return fetchJson<CaseStudy[]>("/api/admin/case-studies", { credentials: "include" });
}

async function patchCase(id: string, data: Partial<CaseStudy>): Promise<CaseStudy> {
  return fetchJson<CaseStudy>(`/api/admin/case-studies/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
}

export default function PortfolioEdit() {
  const [, params] = useRoute("/admin/portfolio/:id");
  const queryClient = useQueryClient();
  const { data: cases = [], isLoading, isError, error } = useQuery({
    queryKey: ["admin-portfolio"],
    queryFn: fetchCases,
  });

  const isDbMissing = error instanceof HttpError && error.status === 503;

  const current = useMemo(() => cases.find((c) => c.id === params?.id), [cases, params]);
  const [form, setForm] = useState<Partial<CaseStudy> | null>(null);

  React.useEffect(() => {
    if (current) {
      setForm({
        title: current.title,
        summary: current.summary,
        client: current.client,
        year: current.year,
        region: current.region,
        services: current.services,
        coverImage: current.coverImage,
        featured: current.featured,
      });
    }
  }, [current]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<CaseStudy>) => patchCase(current!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-portfolio"] });
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
  if (!current || !form) return <p className="text-muted-foreground">Case not found</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Edit Case</h1>

      <Card>
        <CardHeader>
          <CardTitle>Meta</CardTitle>
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
            <label className="text-sm font-medium">Client</label>
            <Input
              value={form.client as string}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Year</label>
            <Input
              type="number"
              value={String(form.year ?? "")}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Region</label>
            <Input
              value={form.region as string}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium">Summary</label>
            <Textarea
              value={form.summary as string}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium">Services (comma separated)</label>
            <Input
              value={(form.services as string[])?.join(", ") || ""}
              onChange={(e) =>
                setForm({ ...form, services: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
              }
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium">Cover Image URL</label>
            <Input
              value={form.coverImage as string}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={!!form.featured}
              onCheckedChange={(v) => setForm({ ...form, featured: Boolean(v) })}
            />
            <span className="text-sm">Featured</span>
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
