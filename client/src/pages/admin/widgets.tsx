import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const widgets = [
  { key: "hero", title: "Hero", description: "Large headline with CTAs" },
  { key: "service-grid", title: "Service Grid", description: "Cards layout for services" },
  { key: "portfolio-strip", title: "Portfolio Strip", description: "Horizontal featured cases" },
  { key: "case-carousel", title: "Case Carousel", description: "Slider for case studies" },
  { key: "blog-list", title: "Blog List", description: "Recent posts grid" },
  { key: "contact-form", title: "Contact Form", description: "Name/Email/Message form" },
];

export default function WidgetsLibrary() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Widgets Library</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {widgets.map((w) => (
          <Card key={w.key} className="h-full">
            <CardHeader>
              <CardTitle>{w.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{w.description}</p>
              <div className="flex gap-2">
                <Button variant="outline">Settings</Button>
                <Button className="bg-primary text-white">Add to Canvas</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
