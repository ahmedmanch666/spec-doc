import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJson, HttpError } from "@/lib/http";

export default function FormsAdmin() {
  const queryClient = useQueryClient();
  const { data: submissions = [], isLoading, isError, error } = useQuery({
    queryKey: ["admin-contact-submissions"],
    queryFn: async () => {
      return fetchJson<any[]>("/api/admin/contact-submissions", { credentials: "include" });
    },
  });

  const isDbMissing = error instanceof HttpError && error.status === 503;

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await fetchJson<void>(`/api/admin/contact-submissions/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-contact-submissions"] }),
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
      <Card>
        <CardHeader>
          <CardTitle>Contact Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground">Loading submissions...</p>}
          {isError && isDbMissing && (
            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="font-medium">Database not connected</p>
              <p className="text-sm text-muted-foreground mt-1">
                Connect a Postgres database and set <code>DATABASE_URL</code> in Vercel.
              </p>
            </div>
          )}
          {isError && !isDbMissing && <p className="text-destructive">Failed to load submissions.</p>}
          {!!submissions && submissions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((s: any) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.status}</TableCell>
                    <TableCell>{new Date(s.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => mutation.mutate({ id: s.id, status: "read" })}>
                        Mark Read
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => mutation.mutate({ id: s.id, status: "replied" })}>
                        Mark Replied
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No submissions yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
