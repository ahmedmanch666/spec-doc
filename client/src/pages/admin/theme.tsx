import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTheme, updateTheme, type ThemeConfig } from "@/lib/api";
import { applyThemeToDocument, hexToHslTuple } from "@/lib/theme";

export default function ThemePanel() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<ThemeConfig>({
    queryKey: ["theme"],
    queryFn: getTheme,
  });

  const [primary, setPrimary] = useState("#e10600");
  const [hover, setHover] = useState("#b20500");

  useEffect(() => {
    if (data) {
      setPrimary(data.primary);
      setHover(data.hover);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (theme: ThemeConfig) => updateTheme(theme),
    onSuccess: (theme) => {
      applyThemeToDocument(theme);
      queryClient.setQueryData(["theme"], theme);
    },
  });

  function handleApply() {
    const theme: ThemeConfig = { primary, hover };
    mutation.mutate(theme);
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
                {isLoading ? "Loading theme..." : "Preview buttons with current values"}
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
              <Button 
                className="bg-primary text-white font-bold" 
                onClick={handleApply}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save & Apply"}
              </Button>
              <Button 
                variant="outline"
                type="button"
                onClick={() => applyThemeToDocument({ primary, hover })}
              >
                Preview on site
              </Button>
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
