export type ContinuousDistribution = "normal" | "t";
export type DiscreteDistribution = "binomial" | "poisson";
export type Distribution = ContinuousDistribution | DiscreteDistribution;

export type TabKind = "continuous" | "discrete";

/** Inequality operators. `eq` is only used by discrete distributions. */
export type Inequality =
  | "lt"
  | "le"
  | "gt"
  | "ge"
  | "eq"
  /** a ≤ X ≤ b */
  | "between"
  /** a < X < b */
  | "betweenStrict"
  /** a ≤ X < b */
  | "betweenLeftIn"
  /** a < X ≤ b */
  | "betweenRightIn";

export const BETWEEN_FORMS = [
  "between",
  "betweenStrict",
  "betweenLeftIn",
  "betweenRightIn",
] as const satisfies readonly Inequality[];

/** True for any two-bound form, all of which need an upper-bound input. */
export function isBetween(inequality: Inequality): boolean {
  return (BETWEEN_FORMS as readonly Inequality[]).includes(inequality);
}

/**
 * Cumulative indices for a discrete two-bound form: the probability is
 * F(cdfUpper) − F(cdfLower), and the included outcomes are
 * cdfLower+1 … cdfUpper. Continuity-corrected bounds are these plus 0.5.
 */
export function discreteBetweenBounds(
  inequality: Inequality,
  a: number,
  b: number,
): { cdfLower: number; cdfUpper: number } {
  switch (inequality) {
    case "betweenStrict": // a < X < b  ->  a+1 … b-1
      return { cdfLower: a, cdfUpper: b - 1 };
    case "betweenLeftIn": // a ≤ X < b  ->  a … b-1
      return { cdfLower: a - 1, cdfUpper: b - 1 };
    case "betweenRightIn": // a < X ≤ b  ->  a+1 … b
      return { cdfLower: a, cdfUpper: b };
    default: // between: a ≤ X ≤ b  ->  a … b
      return { cdfLower: a - 1, cdfUpper: b };
  }
}

/** Human-readable label, e.g. "P(a < X ≤ b)". */
export const INEQUALITY_LABELS: Record<Inequality, string> = {
  eq: "P(X = k)",
  lt: "P(X < x)",
  le: "P(X ≤ x)",
  gt: "P(X > x)",
  ge: "P(X ≥ x)",
  between: "P(a ≤ X ≤ b)",
  betweenStrict: "P(a < X < b)",
  betweenLeftIn: "P(a ≤ X < b)",
  betweenRightIn: "P(a < X ≤ b)",
};

export type Precision = 4 | 6;

/** A single point of a plotted distribution. */
export interface PlotPoint {
  /** x position (continuous value, or integer k for discrete). */
  x: number;
  /** Full density / mass at x. */
  y: number;
  /** Density / mass at x when x is inside the probability region, else null. */
  highlight: number | null;
}

export interface ContinuousPlotSpec {
  kind: "continuous";
  data: PlotPoint[];
  /** Lower/critical x value, drawn as a reference line. */
  refX: number;
  /** Upper bound for "between", drawn as a second reference line. */
  refUpper: number | null;
  /** Label shown at the reference line (e.g. "Z = 1.96"). */
  refLabel: string;
  xLabel: string;
}

export interface DiscretePlotSpec {
  kind: "discrete";
  data: PlotPoint[];
  xLabel: string;
}

export type PlotSpec = ContinuousPlotSpec | DiscretePlotSpec;

export interface Explanation {
  formula: string;
  interpretation: string;
  shadedArea: string;
}

export interface CalcResult {
  distribution: Distribution;
  probability: number;
  precision: Precision;
  /** True for the prefilled landing example; cleared once the user calculates. */
  isExample?: boolean;
  /** Formatted probability string, honouring precision + any prefix. */
  display: string;
  /** Optional extra lines (method used, distribution info, warnings). */
  meta: string[];
  plot: PlotSpec;
  explanation: Explanation;
}
