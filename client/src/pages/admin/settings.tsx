import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsAdmin() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Site Meta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="EIBS — Branding Agency" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input placeholder="Strategic branding and design." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">OG Image</label>
              <Input placeholder="https://..." />
            </div>
            <Button className="bg-primary text-white">Save</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Auth & Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Time (minutes)</label>
              <Input type="number" placeholder="30" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Analytics ID</label>
              <Input placeholder="G-XXXXXXX" />
            </div>
            <Button variant="outline">Update</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
