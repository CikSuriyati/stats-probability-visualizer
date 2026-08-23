import { binomialExplanation, normalExplanation, poissonExplanation, tExplanation } from "./explanations";
import { binomialPmf, normalCurve, poissonPmf, tCurve } from "./plot-data";
import { binomialProbability, normalProbability, poissonProbability, tProbability } from "./stats";
import type { CalcResult, Distribution, Inequality } from "./types";

/**
 * Prefilled field values for a distribution's worked example. These populate
 * the form so the panel and the inputs always agree, and so the student can
 * edit real numbers rather than starting from an empty box.
 */
export interface ExampleFields {
  [field: string]: string;
}

export interface WorkedExample {
  distribution: Distribution;
  /** Values to prefill the form with. */
  fields: ExampleFields;
  /** The finished result to display on landing. */
  result: CalcResult;
}

function normalExample(): WorkedExample {
  const mean = 1000;
  const sd = 200;
  const x = 1100;
  const inequality: Inequality = "lt";
  const { probability, sdUsed, zScore } = normalProbability({
    type: "population",
    mean,
    sd,
    inequality,
    x,
    upper: NaN,
    n: 1,
  });
  return {
    distribution: "normal",
    fields: { type: "population", mean: "1000", sd: "200", inequality, x: "1100", upper: "" },
    result: {
      distribution: "normal",
      probability,
      precision: 4,
      display: probability.toFixed(4),
      meta: [],
      isExample: true,
      plot: {
        kind: "continuous",
        data: normalCurve(mean, sdUsed, x, NaN, inequality),
        refX: x,
        refUpper: null,
        refLabel: `Z = ${zScore.toFixed(2)}`,
        xLabel: "x",
      },
      explanation: normalExplanation(mean, sd, x, NaN, inequality, "population", 1),
    },
  };
}

function tExample(): WorkedExample {
  const df = 12;
  const x = 2.179;
  const inequality: Inequality = "lt";
  const { probability } = tProbability({ df, inequality, x, upper: NaN });
  return {
    distribution: "t",
    fields: { df: "12", inequality, x: "2.179", upper: "" },
    result: {
      distribution: "t",
      probability,
      precision: 4,
      display: probability.toFixed(4),
      meta: [`Degrees of freedom: ${df}`],
      isExample: true,
      plot: {
        kind: "continuous",
        data: tCurve(df, x, NaN, inequality),
        refX: x,
        refUpper: null,
        refLabel: `t = ${x}`,
        xLabel: "t",
      },
      explanation: tExplanation(df, x, NaN, inequality),
    },
  };
}

function binomialExample(): WorkedExample {
  const n = 20;
  const p = 0.3;
  const x = 5;
  const inequality: Inequality = "le";
  const { probability, method } = binomialProbability({
    n,
    p,
    inequality,
    x,
    upper: NaN,
    continuityCorrection: false,
  });
  return {
    distribution: "binomial",
    fields: { n: "20", p: "0.3", inequality, x: "5", upper: "", continuity: "false" },
    result: {
      distribution: "binomial",
      probability,
      precision: 4,
      display: probability.toFixed(4),
      meta: [`Method: ${method}`],
      isExample: true,
      plot: {
        kind: "discrete",
        data: binomialPmf(n, p, x, NaN, inequality),
        xLabel: "Number of successes (k)",
      },
      explanation: binomialExplanation(n, p, x, NaN, inequality, false),
    },
  };
}

function poissonExample(): WorkedExample {
  const lambda = 3.5;
  const x = 2;
  const inequality: Inequality = "le";
  const { probability, description } = poissonProbability({ lambda, inequality, x, upper: NaN });
  return {
    distribution: "poisson",
    fields: { lambda: "3.5", inequality, x: "2", upper: "" },
    result: {
      distribution: "poisson",
      probability,
      precision: 4,
      display: `${description} = ${probability.toFixed(4)}`,
      meta: [
        `Mean (λ) = ${lambda}   •   Variance = ${lambda}   •   SD = ${Math.sqrt(lambda).toFixed(4)}`,
      ],
      isExample: true,
      plot: {
        kind: "discrete",
        data: poissonPmf(lambda, x, NaN, inequality),
        xLabel: "Number of events (k)",
      },
      explanation: poissonExplanation(lambda, x, NaN, inequality),
    },
  };
}

/** Built lazily so a throw in one example cannot break module load. */
export function getExample(distribution: Distribution): WorkedExample {
  switch (distribution) {
    case "normal":
      return normalExample();
    case "t":
      return tExample();
    case "binomial":
      return binomialExample();
    case "poisson":
      return poissonExample();
  }
}

export const EXAMPLE_LABELS: Record<Distribution, string> = {
  normal: "Normal",
  binomial: "Binomial",
  poisson: "Poisson",
  t: "t-Distribution",
};

/** The parameters each example uses, so a chip says what it will load. */
export const EXAMPLE_PARAMS: Record<Distribution, string> = {
  normal: "μ 1000, σ 200",
  binomial: "n 20, p 0.3",
  poisson: "λ 3.5",
  t: "df 12",
};

export const CONTINUOUS_DISTRIBUTIONS: Distribution[] = ["normal", "t"];
export const DISCRETE_DISTRIBUTIONS: Distribution[] = ["binomial", "poisson"];
