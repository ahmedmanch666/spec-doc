import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { BlogPost } from "@shared/schema";
import { fetchJson, HttpError } from "@/lib/http";

async function fetchPosts(): Promise<BlogPost[]> {
  return fetchJson<BlogPost[]>("/api/admin/blog-posts", { credentials: "include" });
}

export default function BlogAdmin() {
  const { data, isLoading, isError, error } = useQuery<BlogPost[]>({
    queryKey: ["admin-blog-posts"],
    queryFn: fetchPosts,
  });

  const isDbMissing = error instanceof HttpError && error.status === 503;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>

      <Card>
        <CardHeader>
          <CardTitle>Posts Table</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground">Loading posts...</p>}
          {isError && isDbMissing && (
            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="font-medium">Database not connected</p>
              <p className="text-sm text-muted-foreground mt-1">
                Connect a Postgres database and set <code>DATABASE_URL</code> in Vercel.
              </p>
            </div>
          )}
          {isError && !isDbMissing && (
            <p className="text-destructive">Failed to load posts.</p>
          )}
          {!!data && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Lang</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.title}</TableCell>
                    <TableCell>{p.slug}</TableCell>
                    <TableCell>{p.status}</TableCell>
                    <TableCell>{p.lang}</TableCell>
                    <TableCell>{(p.tags || []).join(", ")}</TableCell>
                    <TableCell>
                      <Link href={`/admin/blog/${p.id}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
