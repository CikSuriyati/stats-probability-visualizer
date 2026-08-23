import { jStat } from "jstat";
import { discreteBetweenBounds, isBetween, type Inequality } from "./types";

/** Thrown when form input fails validation. Message is user-facing. */
export class ValidationError extends Error {}

// ===== NORMAL =====
export interface NormalParams {
  type: "population" | "sampling";
  mean: number;
  sd: number;
  inequality: Inequality;
  x: number;
  upper: number;
  n: number;
}

export interface NormalOutcome {
  probability: number;
  sdUsed: number;
  zScore: number;
}

export function normalProbability(p: NormalParams): NormalOutcome {
  const { type, mean, sd, inequality, x, upper } = p;

  if (Number.isNaN(mean)) throw new ValidationError("Please enter a valid mean (μ).");
  if (Number.isNaN(sd) || sd <= 0)
    throw new ValidationError("Please enter a valid standard deviation (σ) > 0.");
  if (Number.isNaN(x)) throw new ValidationError("Please enter a valid X value.");

  let n = 1;
  if (type === "sampling") {
    n = p.n;
    if (Number.isNaN(n) || n <= 0)
      throw new ValidationError("Please enter a valid sample size (n).");
  }

  const sdUsed = type === "sampling" ? sd / Math.sqrt(n) : sd;

  let probability = 0;
  if (inequality === "lt" || inequality === "le")
    probability = jStat.normal.cdf(x, mean, sdUsed);
  else if (inequality === "gt" || inequality === "ge")
    probability = 1 - jStat.normal.cdf(x, mean, sdUsed);
  else if (isBetween(inequality)) {
    if (Number.isNaN(upper)) throw new ValidationError("Please enter the upper bound value.");
    if (upper < x)
      throw new ValidationError("The upper bound must be greater than the lower bound.");
    // For a continuous distribution a single point has zero probability, so
    // all four two-bound forms give the same value.
    probability = jStat.normal.cdf(upper, mean, sdUsed) - jStat.normal.cdf(x, mean, sdUsed);
  }

  return { probability, sdUsed, zScore: (x - mean) / sdUsed };
}

// ===== T =====
export interface TParams {
  df: number;
  inequality: Inequality;
  x: number;
  upper: number;
}

export function tProbability(p: TParams): { probability: number } {
  const { df, inequality, x, upper } = p;

  if (Number.isNaN(df) || df <= 0)
    throw new ValidationError("Please enter a valid degrees of freedom (df) > 0.");
  if (Number.isNaN(x)) throw new ValidationError("Please enter a valid X value.");

  let probability = 0;
  if (inequality === "lt" || inequality === "le") probability = jStat.studentt.cdf(x, df);
  else if (inequality === "gt" || inequality === "ge") probability = 1 - jStat.studentt.cdf(x, df);
  else if (isBetween(inequality)) {
    if (Number.isNaN(upper)) throw new ValidationError("Please enter the upper bound value.");
    if (upper < x)
      throw new ValidationError("The upper bound must be greater than the lower bound.");
    // Continuous: strict and non-strict bounds give the same probability.
    probability = jStat.studentt.cdf(upper, df) - jStat.studentt.cdf(x, df);
  }

  return { probability };
}

// ===== BINOMIAL =====
export interface BinomialParams {
  n: number;
  p: number;
  inequality: Inequality;
  x: number;
  upper: number;
  continuityCorrection: boolean;
}

export interface BinomialOutcome {
  probability: number;
  method: string;
  /** Warning shown when normal approximation was requested but np < 5. */
  warning?: string;
}

export function binomialProbability(params: BinomialParams): BinomialOutcome {
  const { n, p, inequality, x, upper, continuityCorrection } = params;

  if (Number.isNaN(n) || n <= 0 || !Number.isInteger(n))
    throw new ValidationError("Please enter a valid number of trials (n) > 0.");
  if (Number.isNaN(p) || p < 0 || p > 1)
    throw new ValidationError("Please enter a valid probability (p) between 0 and 1.");
  if (Number.isNaN(x) || x < 0 || x > n || !Number.isInteger(x))
    throw new ValidationError("Please enter a valid X value between 0 and n.");

  let probability = 0;
  let method = "Exact Binomial";
  let warning: string | undefined;

  const canApprox = continuityCorrection && n * p >= 5 && n * (1 - p) >= 5;

  if (canApprox) {
    const mean = n * p;
    const std = Math.sqrt(n * p * (1 - p));

    const F = (v: number) => jStat.normal.cdf((v - mean) / std, 0, 1);

    // The one-sided forms keep the textbook expressions — Φ((k ± 0.5 − μ)/σ) —
    // so the tool agrees with what a student works out by hand. The guards only
    // catch inequalities that no outcome can satisfy (or that every outcome
    // does), where the normal curve would otherwise put mass on impossible
    // counts: P(X < 0) used to return 0.000758 instead of 0.
    if (inequality === "eq") {
      probability = x < 0 || x > n ? 0 : F(x + 0.5) - F(x - 0.5);
    } else if (inequality === "lt") {
      probability = x <= 0 ? 0 : F(x - 0.5);
    } else if (inequality === "le") {
      probability = x >= n ? 1 : F(x + 0.5);
    } else if (inequality === "gt") {
      probability = x >= n ? 0 : 1 - F(x + 0.5);
    } else if (inequality === "ge") {
      probability = x <= 0 ? 1 : 1 - F(x - 0.5);
    } else if (isBetween(inequality)) {
      if (Number.isNaN(upper)) throw new ValidationError("Please enter the upper bound value.");
      if (upper < x)
        throw new ValidationError("The upper bound must be greater than the lower bound.");
      // Included outcomes are cdfLower+1 … cdfUpper, clamped to the support.
      const { cdfLower, cdfUpper } = discreteBetweenBounds(inequality, x, upper);
      const lo = Math.max(cdfLower + 1, 0);
      const hi = Math.min(cdfUpper, n);
      if (lo > hi) probability = 0;
      else if (lo === 0 && hi === n) probability = 1;
      else probability = F(hi + 0.5) - F(lo - 0.5);
    }
    probability = Math.min(1, Math.max(0, probability));
    method = "Normal Approximation (with continuity correction)";
  } else {
    if (inequality === "eq") probability = jStat.binomial.pdf(x, n, p);
    else if (inequality === "lt") probability = jStat.binomial.cdf(x - 1, n, p);
    else if (inequality === "le") probability = jStat.binomial.cdf(x, n, p);
    else if (inequality === "gt") probability = 1 - jStat.binomial.cdf(x, n, p);
    else if (inequality === "ge") probability = 1 - jStat.binomial.cdf(x - 1, n, p);
    else if (isBetween(inequality)) {
      if (Number.isNaN(upper)) throw new ValidationError("Please enter the upper bound value.");
      if (upper < x)
        throw new ValidationError("The upper bound must be greater than the lower bound.");
      const { cdfLower, cdfUpper } = discreteBetweenBounds(inequality, x, upper);
      probability = jStat.binomial.cdf(cdfUpper, n, p) - jStat.binomial.cdf(cdfLower, n, p);
    }
  }

  if (continuityCorrection && n * p < 5) {
    warning = "⚠️ Normal approximation not recommended (np < 5).";
  }

  return { probability, method, warning };
}

// ===== POISSON =====
export interface PoissonParams {
  lambda: number;
  inequality: Inequality;
  x: number;
  upper: number;
}

export interface PoissonOutcome {
  probability: number;
  description: string;
}

export function poissonProbability(params: PoissonParams): PoissonOutcome {
  const { lambda, inequality, x, upper } = params;

  if (Number.isNaN(lambda) || lambda <= 0)
    throw new ValidationError("Please enter a valid lambda (λ) > 0.");
  if (Number.isNaN(x) || x < 0 || !Number.isInteger(x))
    throw new ValidationError("Please enter a valid X value ≥ 0.");

  let probability = 0;
  let description = "";

  if (inequality === "eq") {
    probability = jStat.poisson.pdf(x, lambda);
    description = `P(X = ${x})`;
  } else if (inequality === "lt") {
    probability = jStat.poisson.cdf(x - 1, lambda);
    description = `P(X < ${x})`;
  } else if (inequality === "le") {
    probability = jStat.poisson.cdf(x, lambda);
    description = `P(X ≤ ${x})`;
  } else if (inequality === "gt") {
    probability = 1 - jStat.poisson.cdf(x, lambda);
    description = `P(X > ${x})`;
  } else if (inequality === "ge") {
    probability = 1 - jStat.poisson.cdf(x - 1, lambda);
    description = `P(X ≥ ${x})`;
  } else if (isBetween(inequality)) {
    if (Number.isNaN(upper)) throw new ValidationError("Please enter the upper bound value.");
    if (upper < x)
      throw new ValidationError("The upper bound must be greater than the lower bound.");
    const { cdfLower, cdfUpper } = discreteBetweenBounds(inequality, x, upper);
    probability = jStat.poisson.cdf(cdfUpper, lambda) - jStat.poisson.cdf(cdfLower, lambda);
    const lo = inequality === "between" || inequality === "betweenLeftIn" ? "≤" : "<";
    const hi = inequality === "between" || inequality === "betweenRightIn" ? "≤" : "<";
    description = `P(${x} ${lo} X ${hi} ${upper})`;
  }

  return { probability, description };
}
