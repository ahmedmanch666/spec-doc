import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTheme, type ThemeConfig } from "./api";
import { applyThemeToDocument } from "./theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data } = useQuery<ThemeConfig>({
    queryKey: ["theme"],
    queryFn: getTheme,
  });

  useEffect(() => {
    if (data) {
      applyThemeToDocument(data);
    }
  }, [data]);

  return <>{children}</>;
}


