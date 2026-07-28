import { jStat } from "jstat";
import type { Inequality } from "./types";

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
  else if (inequality === "between") {
    if (Number.isNaN(upper)) throw new ValidationError("Please enter the upper bound value.");
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
  else if (inequality === "between") {
    if (Number.isNaN(upper)) throw new ValidationError("Please enter the upper bound value.");
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
    if (inequality === "eq") {
      probability =
        jStat.normal.cdf((x + 0.5 - mean) / std, 0, 1) -
        jStat.normal.cdf((x - 0.5 - mean) / std, 0, 1);
    } else if (inequality === "lt") {
      probability = jStat.normal.cdf((x - 0.5 - mean) / std, 0, 1);
    } else if (inequality === "le") {
      probability = jStat.normal.cdf((x + 0.5 - mean) / std, 0, 1);
    } else if (inequality === "gt") {
      probability = 1 - jStat.normal.cdf((x + 0.5 - mean) / std, 0, 1);
    } else if (inequality === "ge") {
      probability = 1 - jStat.normal.cdf((x - 0.5 - mean) / std, 0, 1);
    } else if (inequality === "between") {
      if (Number.isNaN(upper)) throw new ValidationError("Please enter the upper bound value.");
      probability =
        jStat.normal.cdf((upper + 0.5 - mean) / std, 0, 1) -
        jStat.normal.cdf((x - 0.5 - mean) / std, 0, 1);
    }
    method = "Normal Approximation (with continuity correction)";
  } else {
    if (inequality === "eq") probability = jStat.binomial.pdf(x, n, p);
    else if (inequality === "lt") probability = jStat.binomial.cdf(x - 1, n, p);
    else if (inequality === "le") probability = jStat.binomial.cdf(x, n, p);
    else if (inequality === "gt") probability = 1 - jStat.binomial.cdf(x, n, p);
    else if (inequality === "ge") probability = 1 - jStat.binomial.cdf(x - 1, n, p);
    else if (inequality === "between") {
      if (Number.isNaN(upper)) throw new ValidationError("Please enter the upper bound value.");
      probability = jStat.binomial.cdf(upper, n, p) - jStat.binomial.cdf(x - 1, n, p);
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
  } else if (inequality === "between") {
    if (Number.isNaN(upper)) throw new ValidationError("Please enter the upper bound value.");
    probability = jStat.poisson.cdf(upper, lambda) - jStat.poisson.cdf(x - 1, lambda);
    description = `P(${x} ≤ X ≤ ${upper})`;
  }

  return { probability, description };
}
