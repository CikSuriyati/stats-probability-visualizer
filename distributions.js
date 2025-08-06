function calculateNormal(params) {
  const { mean, stddev, type, x, x1, x2 } = params;
  let probability = 0;
  let zscore = null;

  if (type === "less") {
    probability = jStat.normal.cdf(x, mean, stddev);
    zscore = (x - mean) / stddev;
  } else if (type === "greater") {
    probability = 1 - jStat.normal.cdf(x, mean, stddev);
    zscore = (x - mean) / stddev;
  } else if (type === "between") {
    probability = jStat.normal.cdf(x2, mean, stddev) - jStat.normal.cdf(x1, mean, stddev);
  }

  // Create curve
  const xs = [], ys = [];
  for (let i = mean - 4 * stddev; i <= mean + 4 * stddev; i += 0.1) {
    xs.push(i);
    ys.push(jStat.normal.pdf(i, mean, stddev));
  }

  // Highlight
  const hx = [], hy = [];
  for (let i = mean - 4 * stddev; i <= mean + 4 * stddev; i += 0.1) {
    if ((type === "less" && i <= x) ||
        (type === "greater" && i >= x) ||
        (type === "between" && i >= x1 && i <= x2)) {
      hx.push(i);
      hy.push(jStat.normal.pdf(i, mean, stddev));
    } else {
      hx.push(i);
      hy.push(0);
    }
  }

  return {
    probability,
    extra: { z: zscore },
    curve: { xs, ys },
    highlight: { xs: hx, ys: hy }
  };
}