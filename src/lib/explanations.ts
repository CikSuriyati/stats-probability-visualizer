import type { Explanation, Inequality } from "./types";

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

  if (type === "sampling") {
    formula += ` \\text{ (using } \\sigma/\\sqrt{n} = ${sdUsed.toFixed(4)} )`;
    interpretation += ` Note: This uses the sampling distribution of the mean with standard error $\\sigma/\\sqrt{n} = ${sdUsed.toFixed(4)}$.`;
  }

  return { formula, interpretation, shadedArea };
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

  return { formula, interpretation, shadedArea };
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

    if (inequality === "eq") {
      formula = `P(X = ${x}) \\approx P(${x - 0.5} \\le Y \\le ${x + 0.5}) \\text{ where } Y \\sim N(${mean}, ${std.toFixed(4)}^2)`;
      interpretation = `Using normal approximation with continuity correction. We approximate the discrete binomial with a continuous normal distribution, adjusting the bounds by $\\pm 0.5$.`;
      shadedArea = `The shaded area represents the probability mass at exactly ${x} successes, approximated by the area under the normal curve between ${x - 0.5} and ${x + 0.5}.`;
    } else if (inequality === "le") {
      formula = `P(X \\le ${x}) \\approx P(Y \\le ${x + 0.5}) \\text{ where } Y \\sim N(${mean}, ${std.toFixed(4)}^2)`;
      interpretation = `Using normal approximation with continuity correction. We add $0.5$ to the upper bound to account for the discrete nature of the binomial distribution.`;
      shadedArea = `The shaded area represents the probability of ${x} or fewer successes, approximated by the area under the normal curve up to ${x + 0.5}.`;
    } else if (inequality === "ge") {
      formula = `P(X \\ge ${x}) \\approx P(Y \\ge ${x - 0.5}) \\text{ where } Y \\sim N(${mean}, ${std.toFixed(4)}^2)`;
      interpretation = `Using normal approximation with continuity correction. We subtract $0.5$ from the lower bound to account for the discrete nature of the binomial distribution.`;
      shadedArea = `The shaded area represents the probability of ${x} or more successes, approximated by the area under the normal curve from ${x - 0.5} onwards.`;
    } else if (inequality === "between") {
      formula = `P(${x} \\le X \\le ${upper}) \\approx P(${x - 0.5} \\le Y \\le ${upper + 0.5}) \\text{ where } Y \\sim N(${mean}, ${std.toFixed(4)}^2)`;
      interpretation = `Using normal approximation with continuity correction. We adjust both bounds by $\\pm 0.5$ to better approximate the discrete binomial probabilities.`;
      shadedArea = `The shaded area represents the probability of between ${x} and ${upper} successes, approximated by the area under the normal curve between ${x - 0.5} and ${upper + 0.5}.`;
    }
  } else {
    if (inequality === "eq") {
      formula = `P(X = ${x}) = \\binom{n}{x} \\times p^{x} \\times (1-p)^{n-x}`;
      interpretation = `This is the exact binomial probability of getting exactly ${x} successes in ${n} trials. The formula uses the binomial coefficient $\\binom{${n}}{${x}}$ and the probability of success $p = ${p}$.`;
      shadedArea = `The shaded bar represents the probability mass at exactly ${x} successes, showing the discrete probability for this specific outcome.`;
    } else if (inequality === "le") {
      formula = `P(X \\le ${x}) = \\sum_{k=0}^{${x}} \\binom{n}{k} \\times p^k \\times (1-p)^{n-k}`;
      interpretation = `This is the cumulative probability of getting ${x} or fewer successes in ${n} trials. We sum the probabilities of all outcomes from $0$ to ${x}$ successes.`;
      shadedArea = `The shaded bars represent the probability mass for $0, 1, 2, \\dots, ${x}$ successes, showing the cumulative probability.`;
    } else if (inequality === "ge") {
      formula = `P(X \\ge ${x}) = 1 - P(X \\le ${x - 1}) = 1 - \\sum_{k=0}^{${x - 1}} \\binom{n}{k} \\times p^k \\times (1-p)^{n-k}`;
      interpretation = `This is the probability of getting ${x} or more successes in ${n} trials. We use the complement rule: $1$ minus the probability of getting fewer than ${x}$ successes.`;
      shadedArea = `The shaded bars represent the probability mass for ${x}, ${x + 1}, \\dots, ${n}$ successes, showing the right tail probability.`;
    } else if (inequality === "between") {
      formula = `P(${x} \\le X \\le ${upper}) = \\sum_{k=${x}}^{${upper}} \\binom{n}{k} \\times p^k \\times (1-p)^{n-k}`;
      interpretation = `This is the probability of getting between ${x} and ${upper} successes in ${n} trials. We sum the probabilities of all outcomes from ${x} to ${upper} successes.`;
      shadedArea = `The shaded bars represent the probability mass for ${x}, ${x + 1}, \\dots, ${upper}$ successes, showing the probability in this range.`;
    }
  }

  return { formula, interpretation, shadedArea };
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

  if (inequality === "eq") {
    formula = `P(X = ${x}) = \\frac{e^{-\\lambda} \\lambda^{x}}{x!}`;
    interpretation = `This is the exact Poisson probability of getting exactly ${x} events. The Poisson distribution models rare events occurring at a constant rate $\\lambda = ${lambda}$.`;
    shadedArea = `The shaded bar represents the probability mass at exactly ${x} events, showing the discrete probability for this specific outcome.`;
  } else if (inequality === "le") {
    formula = `P(X \\le ${x}) = \\sum_{k=0}^{${x}} \\frac{e^{-\\lambda} \\lambda^k}{k!}`;
    interpretation = `This is the cumulative probability of getting ${x} or fewer events. We sum the probabilities of all outcomes from $0$ to ${x}$ events using the Poisson formula.`;
    shadedArea = `The shaded bars represent the probability mass for $0, 1, 2, \\dots, ${x}$ events, showing the cumulative probability.`;
  } else if (inequality === "ge") {
    formula = `P(X \\ge ${x}) = 1 - P(X \\le ${x - 1}) = 1 - \\sum_{k=0}^{${x - 1}} \\frac{e^{-\\lambda} \\lambda^k}{k!}`;
    interpretation = `This is the probability of getting ${x} or more events. We use the complement rule: $1$ minus the probability of getting fewer than ${x} events.`;
    shadedArea = `The shaded bars represent the probability mass for ${x}, ${x + 1}, ${x + 2}, \\dots$ events, showing the right tail probability.`;
  } else if (inequality === "between") {
    formula = `P(${x} \\le X \\le ${upper}) = \\sum_{k=${x}}^{${upper}} \\frac{e^{-\\lambda} \\lambda^k}{k!}`;
    interpretation = `This is the probability of getting between ${x} and ${upper} events. We sum the probabilities of all outcomes from ${x} to ${upper} events.`;
    shadedArea = `The shaded bars represent the probability mass for ${x}, ${x + 1}, \\dots, ${upper}$ events, showing the probability in this range.`;
  }

  return { formula, interpretation, shadedArea };
}
