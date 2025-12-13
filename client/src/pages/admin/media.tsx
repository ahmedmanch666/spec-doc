import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MediaAdmin() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Media</h1>
      <Card>
        <CardHeader>
          <CardTitle>Library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline">Images</Button>
            <Button variant="outline">Videos</Button>
            <Button variant="outline">Docs</Button>
            <Button variant="outline">3D Models</Button>
          </div>
          <p className="text-muted-foreground text-sm">
            Grid and info panel to be implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
