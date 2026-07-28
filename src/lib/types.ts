export type ContinuousDistribution = "normal" | "t";
export type DiscreteDistribution = "binomial" | "poisson";
export type Distribution = ContinuousDistribution | DiscreteDistribution;

export type TabKind = "continuous" | "discrete";

/** Inequality operators. `eq` is only used by discrete distributions. */
export type Inequality = "lt" | "le" | "gt" | "ge" | "between" | "eq";

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
  /** Formatted probability string, honouring precision + any prefix. */
  display: string;
  /** Optional extra lines (method used, distribution info, warnings). */
  meta: string[];
  plot: PlotSpec;
  explanation: Explanation;
}
