import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Page } from "@shared/schema";
import { fetchJson, HttpError } from "@/lib/http";

async function fetchPages(): Promise<Page[]> {
  return fetchJson<Page[]>("/api/admin/pages", { credentials: "include" });
}

export default function PagesAdmin() {
  const { data, isLoading, isError, error } = useQuery<Page[]>({
    queryKey: ["admin-pages"],
    queryFn: fetchPages,
  });

  const isDbMissing = error instanceof HttpError && error.status === 503;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Pages</h1>

      <Card>
        <CardHeader>
          <CardTitle>Pages Table</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground">Loading pages...</p>}
          {isError && isDbMissing && (
            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="font-medium">Database not connected</p>
              <p className="text-sm text-muted-foreground mt-1">
                Connect a Postgres database and set <code>DATABASE_URL</code> in Vercel.
              </p>
            </div>
          )}
          {isError && !isDbMissing && (
            <p className="text-destructive">Failed to load pages.</p>
          )}
          {!!data && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Lang</TableHead>
                  <TableHead>Updated</TableHead>
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
                    <TableCell>{new Date(p.updatedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Link href={`/admin/pages/${p.id}`}>
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
