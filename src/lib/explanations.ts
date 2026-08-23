import type { Explanation, Inequality } from "./types";

const INEQUALITY_LATEX: Record<Inequality, string> = {
  eq: "=",
  lt: "<",
  le: "\\le",
  gt: ">",
  ge: "\\ge",
  between: "\\in",
};

/**
 * Guards against a missing branch. Without this, an unhandled inequality
 * returns three empty strings and the panel renders blank with no error —
 * the silent failure that hid the missing `lt` / `gt` discrete branches.
 */
function ensureComplete(
  explanation: Explanation,
  inequality: Inequality,
  x: number,
): Explanation {
  if (explanation.formula) return explanation;

  console.warn(`No explanation branch for inequality "${inequality}".`);
  return {
    formula: `P(X ${INEQUALITY_LATEX[inequality] ?? "?"} ${x})`,
    interpretation: "An explanation is not yet available for this case.",
    shadedArea: "The shaded region corresponds to the selected inequality.",
  };
}

export function normalExplanation(
  mean: number,
  sd: number,
  x: number,
  upper: number,
  inequality: Inequality,
  type: "population" | "sampling",
  n: number,
): Explanation {
  const sdUsed = type === "sampling" ? sd / Math.sqrt(n) : sd;
  const z = (x - mean) / sdUsed;
  const zUpper = upper ? (upper - mean) / sdUsed : null;

  let formula = "";
  let interpretation = "";
  let shadedArea = "";

  if (inequality === "lt" || inequality === "le") {
    formula = `P(X \\le ${x}) = \\Phi(${z.toFixed(4)})`;
    interpretation = `This represents the probability that a randomly selected value from the normal distribution is less than or equal to ${x}. The value ${z.toFixed(4)} is the standardized z-score.`;
    shadedArea = `The shaded area under the curve represents all values from $-\\infty$ to ${x}, which corresponds to the cumulative probability.`;
  } else if (inequality === "gt" || inequality === "ge") {
    formula = `P(X \\ge ${x}) = 1 - \\Phi(${z.toFixed(4)})`;
    interpretation = `This represents the probability that a randomly selected value from the normal distribution is greater than or equal to ${x}. We use the complement rule: $1$ minus the probability of being less than ${x}.`;
    shadedArea = `The shaded area under the curve represents all values from ${x} to $+\\infty$, which corresponds to the right tail probability.`;
  } else if (inequality === "between") {
    formula = `P(${x} \\le X \\le ${upper}) = \\Phi(${zUpper?.toFixed(4)}) - \\Phi(${z.toFixed(4)})`;
    interpretation = `This represents the probability that a randomly selected value falls between ${x} and ${upper}. We subtract the cumulative probability at the lower bound from the upper bound.`;
    shadedArea = `The shaded area under the curve represents all values between ${x} and ${upper}, showing the probability mass in this interval.`;
  }

  // Guard before the sampling suffix, so an unhandled inequality cannot be
  // masked by the appended text.
  const base = ensureComplete({ formula, interpretation, shadedArea }, inequality, x);

  if (type === "sampling") {
    return {
      formula: `${base.formula} \\text{ (using } \\sigma/\\sqrt{n} = ${sdUsed.toFixed(4)} )`,
      interpretation: `${base.interpretation} This uses the sampling distribution of the mean, with standard error ${sdUsed.toFixed(4)}.`,
      shadedArea: base.shadedArea,
    };
  }

  return base;
}

export function tExplanation(
  df: number,
  x: number,
  upper: number,
  inequality: Inequality,
): Explanation {
  let formula = "";
  let interpretation = "";
  let shadedArea = "";

  if (inequality === "lt" || inequality === "le") {
    formula = `P(T \\le ${x}) = F(${x}; ${df})`;
    interpretation = `This represents the probability that a t-statistic with ${df} degrees of freedom is less than or equal to ${x}. The t-distribution is used for small sample sizes and when the population standard deviation is unknown.`;
    shadedArea = `The shaded area under the t-distribution curve represents all values from $-\\infty$ to ${x}, showing the cumulative probability.`;
  } else if (inequality === "gt" || inequality === "ge") {
    formula = `P(T \\ge ${x}) = 1 - F(${x}; ${df})`;
    interpretation = `This represents the probability that a t-statistic with ${df} degrees of freedom is greater than or equal to ${x}. We use the complement rule since the t-distribution is symmetric.`;
    shadedArea = `The shaded area under the t-distribution curve represents all values from ${x} to $+\\infty$, showing the right tail probability.`;
  } else if (inequality === "between") {
    formula = `P(${x} \\le T \\le ${upper}) = F(${upper}; ${df}) - F(${x}; ${df})`;
    interpretation = `This represents the probability that a t-statistic with ${df} degrees of freedom falls between ${x} and ${upper}. The t-distribution becomes more normal-like as degrees of freedom increase.`;
    shadedArea = `The shaded area under the t-distribution curve represents all values between ${x} and ${upper}, showing the probability mass in this interval.`;
  }

  return ensureComplete({ formula, interpretation, shadedArea }, inequality, x);
}

export function binomialExplanation(
  n: number,
  p: number,
  x: number,
  upper: number,
  inequality: Inequality,
  continuityCorrection: boolean,
): Explanation {
  let formula = "";
  let interpretation = "";
  let shadedArea = "";

  if (continuityCorrection && n * p >= 5 && n * (1 - p) >= 5) {
    const mean = n * p;
    const std = Math.sqrt(n * p * (1 - p));
    const normal = `Y \\sim N(${mean}, ${std.toFixed(4)}^2)`;

    if (inequality === "eq") {
      formula = `P(X = ${x}) \\approx P(${x - 0.5} \\le Y \\le ${x + 0.5}) \\text{ where } ${normal}`;
      interpretation = `Using the normal approximation with continuity correction. The discrete binomial is approximated by a continuous normal distribution, widening the single value ${x} by plus or minus 0.5.`;
      shadedArea = `The shaded area is the probability of exactly ${x} successes, approximated by the area under the normal curve between ${x - 0.5} and ${x + 0.5}.`;
    } else if (inequality === "lt") {
      formula = `P(X < ${x}) \\approx P(Y \\le ${x - 0.5}) \\text{ where } ${normal}`;
      interpretation = `Using the normal approximation with continuity correction. A strict inequality excludes ${x} itself, so the upper bound is ${x} minus 0.5.`;
      shadedArea = `The shaded area is the probability of fewer than ${x} successes, approximated by the area under the normal curve up to ${x - 0.5}.`;
    } else if (inequality === "le") {
      formula = `P(X \\le ${x}) \\approx P(Y \\le ${x + 0.5}) \\text{ where } ${normal}`;
      interpretation = `Using the normal approximation with continuity correction. Adding 0.5 to the upper bound accounts for the discrete nature of the binomial distribution.`;
      shadedArea = `The shaded area is the probability of ${x} or fewer successes, approximated by the area under the normal curve up to ${x + 0.5}.`;
    } else if (inequality === "gt") {
      formula = `P(X > ${x}) \\approx P(Y \\ge ${x + 0.5}) \\text{ where } ${normal}`;
      interpretation = `Using the normal approximation with continuity correction. A strict inequality excludes ${x} itself, so the lower bound is ${x} plus 0.5.`;
      shadedArea = `The shaded area is the probability of more than ${x} successes, approximated by the area under the normal curve from ${x + 0.5} onwards.`;
    } else if (inequality === "ge") {
      formula = `P(X \\ge ${x}) \\approx P(Y \\ge ${x - 0.5}) \\text{ where } ${normal}`;
      interpretation = `Using the normal approximation with continuity correction. Subtracting 0.5 from the lower bound accounts for the discrete nature of the binomial distribution.`;
      shadedArea = `The shaded area is the probability of ${x} or more successes, approximated by the area under the normal curve from ${x - 0.5} onwards.`;
    } else if (inequality === "between") {
      formula = `P(${x} \\le X \\le ${upper}) \\approx P(${x - 0.5} \\le Y \\le ${upper + 0.5}) \\text{ where } ${normal}`;
      interpretation = `Using the normal approximation with continuity correction. Both bounds are widened by 0.5 to better approximate the discrete binomial probabilities.`;
      shadedArea = `The shaded area is the probability of between ${x} and ${upper} successes, approximated by the area under the normal curve between ${x - 0.5} and ${upper + 0.5}.`;
    }
  } else {
    const q = (1 - p).toFixed(4);
    const term = (i: string) => `\\binom{${n}}{${i}} (${p})^{${i}} (${q})^{${n} - ${i}}`;
    const sum = (from: number, to: number) => `\\sum_{i=${from}}^{${to}} ${term("i")}`;

    if (inequality === "eq") {
      formula = `P(X = ${x}) = \\binom{${n}}{${x}} (${p})^{${x}} (${q})^{${n - x}}`;
      interpretation = `The exact binomial probability of getting exactly ${x} successes in ${n} trials, with a ${p} chance of success on each trial.`;
      shadedArea = `A single bar is shaded, at outcome ${x}.`;
    } else if (inequality === "lt") {
      if (x <= 0) {
        formula = `P(X < ${x}) = 0`;
        interpretation = `A binomial variable cannot take a value below 0, so this probability is exactly zero.`;
        shadedArea = `No bars are shaded, because no outcome satisfies X < ${x}.`;
      } else {
        formula = `P(X < ${x}) = P(X \\le ${x - 1}) = ${sum(0, x - 1)}`;
        interpretation = `A strict inequality excludes ${x} itself. For a discrete variable that means accumulating every outcome up to ${x - 1}.`;
        shadedArea = `The shaded bars are outcomes 0 through ${x - 1}, every value strictly below ${x}.`;
      }
    } else if (inequality === "le") {
      formula = `P(X \\le ${x}) = ${sum(0, x)}`;
      interpretation = `The cumulative probability of getting ${x} or fewer successes in ${n} trials, summing every outcome from 0 up to ${x}.`;
      shadedArea = `The shaded bars are outcomes 0 through ${x}.`;
    } else if (inequality === "gt") {
      if (x >= n) {
        formula = `P(X > ${x}) = 0`;
        interpretation = `A binomial variable with ${n} trials cannot exceed ${n}, so this probability is exactly zero.`;
        shadedArea = `No bars are shaded, because no outcome satisfies X > ${x}.`;
      } else {
        formula = `P(X > ${x}) = 1 - P(X \\le ${x}) = 1 - ${sum(0, x)}`;
        interpretation = `A strict inequality excludes ${x} itself. The complement rule is used: subtract the probability of ${x} or fewer from 1.`;
        shadedArea = `The shaded bars are outcomes ${x + 1} through ${n}, every value strictly above ${x}.`;
      }
    } else if (inequality === "ge") {
      if (x <= 0) {
        formula = `P(X \\ge ${x}) = 1`;
        interpretation = `Every outcome of a binomial variable is at least 0, so this probability is exactly one.`;
        shadedArea = `All bars are shaded, from 0 through ${n}.`;
      } else {
        formula = `P(X \\ge ${x}) = 1 - P(X \\le ${x - 1}) = 1 - ${sum(0, x - 1)}`;
        interpretation = `The probability of getting ${x} or more successes in ${n} trials, found with the complement rule: 1 minus the probability of getting fewer than ${x}.`;
        shadedArea = `The shaded bars are outcomes ${x} through ${n}, the right tail of the distribution.`;
      }
    } else if (inequality === "between") {
      formula = `P(${x} \\le X \\le ${upper}) = ${sum(x, upper)}`;
      interpretation = `The probability of getting between ${x} and ${upper} successes in ${n} trials, summing every outcome in that range.`;
      shadedArea = `The shaded bars are outcomes ${x} through ${upper}.`;
    }
  }

  return ensureComplete({ formula, interpretation, shadedArea }, inequality, x);
}

export function poissonExplanation(
  lambda: number,
  x: number,
  upper: number,
  inequality: Inequality,
): Explanation {
  let formula = "";
  let interpretation = "";
  let shadedArea = "";

  const term = (i: string) => `\\frac{e^{-${lambda}}\\,(${lambda})^{${i}}}{${i}!}`;
  const sum = (from: number, to: number) => `\\sum_{i=${from}}^{${to}} ${term("i")}`;

  if (inequality === "eq") {
    formula = `P(X = ${x}) = ${term(String(x))}`;
    interpretation = `The exact Poisson probability of getting exactly ${x} events, for a process averaging ${lambda} events per interval.`;
    shadedArea = `A single bar is shaded, at outcome ${x}.`;
  } else if (inequality === "lt") {
    if (x <= 0) {
      formula = `P(X < ${x}) = 0`;
      interpretation = `A Poisson variable cannot take a value below 0, so this probability is exactly zero.`;
      shadedArea = `No bars are shaded, because no outcome satisfies X < ${x}.`;
    } else {
      formula = `P(X < ${x}) = P(X \\le ${x - 1}) = ${sum(0, x - 1)}`;
      interpretation = `A strict inequality excludes ${x} itself, so every outcome up to ${x - 1} is accumulated, at a rate of ${lambda} events per interval.`;
      shadedArea = `The shaded bars are outcomes 0 through ${x - 1}.`;
    }
  } else if (inequality === "le") {
    formula = `P(X \\le ${x}) = ${sum(0, x)}`;
    interpretation = `The cumulative probability of getting ${x} or fewer events, summing every outcome from 0 up to ${x}.`;
    shadedArea = `The shaded bars are outcomes 0 through ${x}.`;
  } else if (inequality === "gt") {
    formula = `P(X > ${x}) = 1 - P(X \\le ${x}) = 1 - ${sum(0, x)}`;
    interpretation = `A strict inequality excludes ${x} itself. The complement rule is used: subtract the probability of ${x} or fewer from 1.`;
    shadedArea = `The shaded bars are every outcome above ${x}.`;
  } else if (inequality === "ge") {
    if (x <= 0) {
      formula = `P(X \\ge ${x}) = 1`;
      interpretation = `Every outcome of a Poisson variable is at least 0, so this probability is exactly one.`;
      shadedArea = `All bars are shaded.`;
    } else {
      formula = `P(X \\ge ${x}) = 1 - P(X \\le ${x - 1}) = 1 - ${sum(0, x - 1)}`;
      interpretation = `The probability of getting ${x} or more events, found with the complement rule: 1 minus the probability of getting fewer than ${x}.`;
      shadedArea = `The shaded bars are outcome ${x} and every outcome above it.`;
    }
  } else if (inequality === "between") {
    formula = `P(${x} \\le X \\le ${upper}) = ${sum(x, upper)}`;
    interpretation = `The probability of getting between ${x} and ${upper} events, summing every outcome in that range.`;
    shadedArea = `The shaded bars are outcomes ${x} through ${upper}.`;
  }

  return ensureComplete({ formula, interpretation, shadedArea }, inequality, x);
}
