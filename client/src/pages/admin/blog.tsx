import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { BlogPost } from "@shared/schema";

async function fetchPosts(): Promise<BlogPost[]> {
  const res = await fetch("/api/admin/blog-posts", { credentials: "include" });
  if (!res.ok) {
    throw new Error("Failed to fetch blog posts");
  }
  return res.json();
}

export default function BlogAdmin() {
  const { data, isLoading, isError } = useQuery<BlogPost[]>({
    queryKey: ["admin-blog-posts"],
    queryFn: fetchPosts,
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>

      <Card>
        <CardHeader>
          <CardTitle>Posts Table</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground">Loading posts...</p>}
          {isError && (
            <p className="text-destructive">
              Could not load posts. Ensure the server and database are configured.
            </p>
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
