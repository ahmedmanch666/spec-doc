import React, { useMemo, useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@shared/schema";
import { fetchJson, HttpError } from "@/lib/http";

async function fetchPosts(): Promise<BlogPost[]> {
  return fetchJson<BlogPost[]>("/api/admin/blog-posts", { credentials: "include" });
}

async function patchPost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
  return fetchJson<BlogPost>(`/api/admin/blog-posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
}

export default function BlogEdit() {
  const [, params] = useRoute("/admin/blog/:id");
  const queryClient = useQueryClient();
  const { data: posts = [], isLoading, isError, error } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: fetchPosts,
  });

  const isDbMissing = error instanceof HttpError && error.status === 503;

  const current = useMemo(() => posts.find((p) => p.id === params?.id), [posts, params]);
  const [form, setForm] = useState<Partial<BlogPost> | null>(null);

  React.useEffect(() => {
    if (current) {
      setForm({
        title: current.title,
        slug: current.slug,
        status: current.status,
        tags: current.tags,
        coverImage: current.coverImage,
        body: current.body,
        lang: current.lang,
      });
    }
  }, [current]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<BlogPost>) => patchPost(current!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
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
  if (!current || !form) return <p className="text-muted-foreground">Post not found</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
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
            <label className="text-sm font-medium">Lang</label>
            <Input
              value={form.lang as string}
              onChange={(e) => setForm({ ...form, lang: e.target.value })}
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
            <label className="text-sm font-medium">Tags (comma separated)</label>
            <Input
              value={(form.tags as string[])?.join(", ") || ""}
              onChange={(e) =>
                setForm({ ...form, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
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
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium">Body (HTML)</label>
            <Textarea
              value={form.body as string}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="min-h-[200px]"
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
