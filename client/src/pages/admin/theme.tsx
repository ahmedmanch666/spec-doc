import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ThemePanel() {
  const [primary, setPrimary] = useState("#e10600");
  const [hover, setHover] = useState("#b20500");

  function hexToHslTuple(hex: string): string {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    const d = max - min;
    if (d !== 0) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  }

  function applyTheme() {
    const root = document.documentElement;
    root.style.setProperty("--brand-red", hexToHslTuple(primary));
    root.style.setProperty("--brand-red-hover", hexToHslTuple(hover));
    root.style.setProperty("--ring", hexToHslTuple(primary));
    alert("Applied to preview");
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Theme</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Primary Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Red</label>
                <Input
                  type="color"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                  className="h-10 p-1"
                  data-testid="input-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hover Red</label>
                <Input
                  type="color"
                  value={hover}
                  onChange={(e) => setHover(e.target.value)}
                  className="h-10 p-1"
                  data-testid="input-hover"
                />
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Preview buttons with current values
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  className="font-bold"
                  style={{ backgroundColor: primary, color: "#fff" }}
                >
                  Primary Filled
                </Button>
                <Button
                  variant="outline"
                  className="font-bold"
                  style={{ borderColor: primary, color: primary }}
                >
                  Primary Outline
                </Button>
                <Button
                  className="font-bold"
                  style={{ backgroundColor: hover, color: "#fff" }}
                >
                  Hover State
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="bg-primary text-white font-bold" onClick={applyTheme}>Apply</Button>
              <Button variant="outline">Preview on site</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tokens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>--color-primary</span>
              <code>{primary}</code>
            </div>
            <div className="flex items-center justify-between">
              <span>--color-primary-hover</span>
              <code>{hover}</code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
