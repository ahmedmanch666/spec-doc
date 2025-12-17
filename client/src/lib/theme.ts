import { ThemeConfig } from "./api";

export function hexToHslTuple(hex: string): string {
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

export function applyThemeToDocument(theme: ThemeConfig) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const primaryHsl = hexToHslTuple(theme.primary);
  const hoverHsl = hexToHslTuple(theme.hover);

  root.style.setProperty("--brand-red", primaryHsl);
  root.style.setProperty("--brand-red-hover", hoverHsl);
  root.style.setProperty("--ring", primaryHsl);
}


