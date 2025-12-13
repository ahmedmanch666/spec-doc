import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const enFonts = ["Inter", "Work Sans", "System UI"];
const arFonts = ["Tajawal", "Cairo", "Noto Kufi Arabic"];

export default function TypographyPanel() {
  const [enFont, setEnFont] = useState(enFonts[0]);
  const [arFont, setArFont] = useState(arFonts[0]);
  const [sizes, setSizes] = useState({
    h1: 36,
    h2: 28,
    h3: 22,
    body: 16,
    small: 13,
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Typography</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fonts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">English Font</label>
              <Select onValueChange={setEnFont} defaultValue={enFont}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose EN font" />
                </SelectTrigger>
                <SelectContent>
                  {enFonts.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Arabic Font</label>
              <Select onValueChange={setArFont} defaultValue={arFont}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose AR font" />
                </SelectTrigger>
                <SelectContent>
                  {arFonts.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sizes</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(sizes).map(([key, val]) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium uppercase">{key}</label>
                <Input
                  type="range"
                  min={12}
                  max={48}
                  value={val}
                  onChange={(e) => setSizes((s) => ({ ...s, [key]: Number(e.target.value) }))}
                />
                <div className="text-xs text-muted-foreground">{val}px</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Preview (EN/AR)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h1 style={{ fontFamily: enFont, fontSize: sizes.h1 }}>Headline H1 — English</h1>
            <h2 style={{ fontFamily: enFont, fontSize: sizes.h2 }}>Headline H2</h2>
            <h3 style={{ fontFamily: enFont, fontSize: sizes.h3 }}>Headline H3</h3>
            <p style={{ fontFamily: enFont, fontSize: sizes.body }}>
              Body text example showcasing the selected English font and size.
            </p>
            <small style={{ fontFamily: enFont, fontSize: sizes.small }}>
              Small caption with helper text.
            </small>
          </div>

          <div className="space-y-3" dir="rtl">
            <h1 style={{ fontFamily: arFont, fontSize: sizes.h1 }}>عنوان رئيسي H1 — العربية</h1>
            <h2 style={{ fontFamily: arFont, fontSize: sizes.h2 }}>عنوان H2</h2>
            <h3 style={{ fontFamily: arFont, fontSize: sizes.h3 }}>عنوان H3</h3>
            <p style={{ fontFamily: arFont, fontSize: sizes.body }}>
              نص الفقرة يوضّح اختيار الخط العربي والحجم.
            </p>
            <small style={{ fontFamily: arFont, fontSize: sizes.small }}>
              تعليق صغير مع نص مساعد.
            </small>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
