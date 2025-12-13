import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { CaseStudy } from "@shared/schema";

async function fetchCases(): Promise<CaseStudy[]> {
  const res = await fetch("/api/case-studies", { credentials: "include" });
  if (!res.ok) {
    throw new Error("Failed to fetch case studies");
  }
  return res.json();
}

export default function PortfolioAdmin() {
  const { data, isLoading, isError } = useQuery<CaseStudy[]>({
    queryKey: ["admin-portfolio"],
    queryFn: fetchCases,
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>

      <Card>
        <CardHeader>
          <CardTitle>Cases Table</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground">Loading cases...</p>}
          {isError && (
            <p className="text-destructive">
              Could not load cases. Ensure the server and database are configured.
            </p>
          )}
          {!!data && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.title}</TableCell>
                    <TableCell>{c.client}</TableCell>
                    <TableCell>{c.year}</TableCell>
                    <TableCell>{c.region}</TableCell>
                    <TableCell>{c.services.join(", ")}</TableCell>
                    <TableCell>{c.featured ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <Link href={`/admin/portfolio/${c.id}`}>
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
