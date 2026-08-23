import { jStat } from "jstat";
import { discreteBetweenBounds, isBetween, type Inequality, type PlotPoint } from "./types";

/** Whether a continuous x is inside the highlighted probability region. */
function inContinuousRegion(
  val: number,
  inequality: Inequality,
  x: number,
  upper: number,
): boolean {
  if (inequality === "lt" || inequality === "le") return val <= x;
  if (inequality === "gt" || inequality === "ge") return val >= x;
  // Continuous: the endpoints carry no probability mass, so every two-bound
  // form shades the same region.
  if (isBetween(inequality)) return val >= x && val <= upper;
  return false;
}

/** Whether a discrete k is inside the highlighted probability region. */
function inDiscreteRegion(k: number, inequality: Inequality, x: number, upper: number): boolean {
  if (inequality === "eq") return k === x;
  if (inequality === "lt") return k < x;
  if (inequality === "le") return k <= x;
  if (inequality === "gt") return k > x;
  if (inequality === "ge") return k >= x;
  if (isBetween(inequality)) {
    const { cdfLower, cdfUpper } = discreteBetweenBounds(inequality, x, upper);
    return k > cdfLower && k <= cdfUpper;
  }
  return false;
}

/** Normal PDF sampled across ±4σ (sd here is already the standard error when sampling). */
export function normalCurve(
  mean: number,
  sd: number,
  x: number,
  upper: number,
  inequality: Inequality,
): PlotPoint[] {
  const points: PlotPoint[] = [];
  const step = (8 * sd) / 200;
  for (let v = mean - 4 * sd; v <= mean + 4 * sd; v += step) {
    const y = jStat.normal.pdf(v, mean, sd);
    const inRegion = inContinuousRegion(v, inequality, x, upper);
    points.push({ x: v, y, highlight: inRegion ? y : null });
  }
  return points;
}

/** Student-t PDF sampled across [-5, 5]. */
export function tCurve(
  df: number,
  x: number,
  upper: number,
  inequality: Inequality,
): PlotPoint[] {
  const points: PlotPoint[] = [];
  for (let v = -5; v <= 5.0001; v += 0.05) {
    const y = jStat.studentt.pdf(v, df);
    const inRegion = inContinuousRegion(v, inequality, x, upper);
    points.push({ x: v, y, highlight: inRegion ? y : null });
  }
  return points;
}

/** Binomial PMF for k = 0..n. */
export function binomialPmf(
  n: number,
  p: number,
  x: number,
  upper: number,
  inequality: Inequality,
): PlotPoint[] {
  const points: PlotPoint[] = [];
  for (let k = 0; k <= n; k++) {
    const y = jStat.binomial.pdf(k, n, p);
    const inRegion = inDiscreteRegion(k, inequality, x, upper);
    points.push({ x: k, y, highlight: inRegion ? y : null });
  }
  return points;
}

/** Poisson PMF for k = 0..ceil(λ + 4√λ). */
export function poissonPmf(
  lambda: number,
  x: number,
  upper: number,
  inequality: Inequality,
): PlotPoint[] {
  const maxK = Math.ceil(lambda + 4 * Math.sqrt(lambda));
  const points: PlotPoint[] = [];
  for (let k = 0; k <= maxK; k++) {
    const y = jStat.poisson.pdf(k, lambda);
    const inRegion = inDiscreteRegion(k, inequality, x, upper);
    points.push({ x: k, y, highlight: inRegion ? y : null });
  }
  return points;
}
