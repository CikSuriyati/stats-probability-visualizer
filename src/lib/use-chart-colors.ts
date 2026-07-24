import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";

export interface ChartColors {
  pdf: string; // base curve / bars
  area: string; // highlighted probability region
  reference: string; // reference lines
  grid: string;
  axis: string;
  muted: string;
}

function readVar(name: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return raw ? `hsl(${raw})` : "";
}

/**
 * Resolves the theme CSS variables to concrete `hsl(...)` strings that Recharts
 * can consume as SVG fills/strokes. Recomputes whenever the theme flips so the
 * chart re-themes in dark mode.
 */
export function useChartColors(): ChartColors {
  const { theme } = useTheme();
  const [colors, setColors] = useState<ChartColors>(() => resolve());

  useEffect(() => {
    // Read after the theme class is applied to <html>.
    setColors(resolve());
  }, [theme]);

  return colors;
}

function resolve(): ChartColors {
  return {
    pdf: readVar("--chart-2"),
    area: readVar("--chart-1"),
    reference: readVar("--muted-foreground"),
    grid: readVar("--border"),
    axis: readVar("--muted-foreground"),
    muted: readVar("--muted"),
  };
}
