// distributions.js

// ===== NORMAL DISTRIBUTION =====
function calculateNormal() {
    const type = document.getElementById("normal-type").value;
    const mean = parseFloat(document.getElementById("mean").value);
    const sd = parseFloat(document.getElementById("sd").value);
    const inequality = document.getElementById("normal-inequality").value;
    const x = parseFloat(document.getElementById("x-value").value);
    const upper = parseFloat(document.getElementById("upper-bound")?.value || "");
    let n = 1;

    if (type === "sampling") {
        n = parseFloat(document.getElementById("n-size").value);
        if (isNaN(n) || n <= 0) {
            alert("Please enter a valid sample size (n)");
            return;
        }
    }

    // Standard deviation adjustment for sampling
    const sdUsed = type === "sampling" ? sd / Math.sqrt(n) : sd;

    // Probability calculation
    let prob = 0;
    if (inequality === "lt") prob = jStat.normal.cdf(x, mean, sdUsed);
    if (inequality === "le") prob = jStat.normal.cdf(x, mean, sdUsed);
    if (inequality === "gt") prob = 1 - jStat.normal.cdf(x, mean, sdUsed);
    if (inequality === "ge") prob = 1 - jStat.normal.cdf(x, mean, sdUsed);
    if (inequality === "between") {
        if (isNaN(upper)) {
            alert("Please enter the upper bound value");
            return;
        }
        prob = jStat.normal.cdf(upper, mean, sdUsed) - jStat.normal.cdf(x, mean, sdUsed);
    }

    document.getElementById("result").innerHTML = `Probability: ${prob.toFixed(4)}`;
    plotNormal(mean, sdUsed, x, upper, inequality);
}

function plotNormal(mean, sd, x, upper, inequality) {
    let xValues = [];
    for (let i = mean - 4 * sd; i <= mean + 4 * sd; i += 0.1) {
        xValues.push(i);
    }
    let yValues = xValues.map(val => jStat.normal.pdf(val, mean, sd));

    let highlightX = [], highlightY = [];
    xValues.forEach(val => {
        let include = false;
        if (inequality === "lt" || inequality === "le") include = val <= x;
        if (inequality === "gt" || inequality === "ge") include = val >= x;
        if (inequality === "between") include = val >= x && val <= upper;
        if (include) {
            highlightX.push(val);
            highlightY.push(jStat.normal.pdf(val, mean, sd));
        }
    });

    let trace1 = { x: xValues, y: yValues, type: 'scatter', mode: 'lines', name: 'PDF' };
    let trace2 = { x: highlightX, y: highlightY, type: 'scatter', mode: 'lines', fill: 'tozeroy', name: 'Probability Area' };

    Plotly.newPlot('continuous-plot', [trace1, trace2], { title: 'Normal Distribution', margin: { t: 30 } });
}

// ===== T-DISTRIBUTION =====
function calculateT() {
    const df = parseFloat(document.getElementById("t-df").value);
    const inequality = document.getElementById("t-inequality").value;
    const x = parseFloat(document.getElementById("t-x-value").value);
    const upper = parseFloat(document.getElementById("t-upper-bound")?.value || "");

    let prob = 0;
    if (inequality === "lt" || inequality === "le") prob = jStat.studentt.cdf(x, df);
    if (inequality === "gt" || inequality === "ge") prob = 1 - jStat.studentt.cdf(x, df);
    if (inequality === "between") {
        if (isNaN(upper)) {
            alert("Please enter the upper bound value");
            return;
        }
        prob = jStat.studentt.cdf(upper, df) - jStat.studentt.cdf(x, df);
    }

    document.getElementById("t-result").innerHTML = `Probability: ${prob.toFixed(4)}`;
    plotT(df, x, upper, inequality);
}

function plotT(df, x, upper, inequality) {
    let xValues = [];
    for (let i = -5; i <= 5; i += 0.1) {
        xValues.push(i);
    }
    let yValues = xValues.map(val => jStat.studentt.pdf(val, df));

    let highlightX = [], highlightY = [];
    xValues.forEach(val => {
        let include = false;
        if (inequality === "lt" || inequality === "le") include = val <= x;
        if (inequality === "gt" || inequality === "ge") include = val >= x;
        if (inequality === "between") include = val >= x && val <= upper;
        if (include) {
            highlightX.push(val);
            highlightY.push(jStat.studentt.pdf(val, df));
        }
    });

    let trace1 = { x: xValues, y: yValues, type: 'scatter', mode: 'lines', name: 'PDF' };
    let trace2 = { x: highlightX, y: highlightY, type: 'scatter', mode: 'lines', fill: 'tozeroy', name: 'Probability Area' };

    Plotly.newPlot('continuous-plot', [trace1, trace2], { title: 't-Distribution', margin: { t: 30 } });
}

// ===== BINOMIAL DISTRIBUTION =====
function calculateBinomial() {
    const n = parseInt(document.getElementById("binom-n").value);
    const p = parseFloat(document.getElementById("binom-p").value);
    const inequality = document.getElementById("binom-inequality").value;
    const x = parseInt(document.getElementById("binom-x").value);
    const upper = parseInt(document.getElementById("binom-upper")?.value || "");

    let prob = 0;
    if (inequality === "eq") prob = jStat.binomial.pdf(x, n, p);
    if (inequality === "lt") prob = jStat.binomial.cdf(x - 1, n, p);
    if (inequality === "le") prob = jStat.binomial.cdf(x, n, p);
    if (inequality === "gt") prob = 1 - jStat.binomial.cdf(x, n, p);
    if (inequality === "ge") prob = 1 - jStat.binomial.cdf(x - 1, n, p);
    if (inequality === "between") {
        if (isNaN(upper)) {
            alert("Please enter the upper bound value");
            return;
        }
        prob = jStat.binomial.cdf(upper, n, p) - jStat.binomial.cdf(x - 1, n, p);
    }

    document.getElementById("binom-result").innerHTML = `Probability: ${prob.toFixed(4)}`;
    plotBinomial(n, p, x, upper, inequality);
}

function plotBinomial(n, p, x, upper, inequality) {
    let xValues = [], yValues = [], highlightX = [], highlightY = [];
    for (let k = 0; k <= n; k++) {
        let pdfVal = jStat.binomial.pdf(k, n, p);
        xValues.push(k);
        yValues.push(pdfVal);
        let include = false;
        if (inequality === "eq") include = k === x;
        if (inequality === "lt") include = k < x;
        if (inequality === "le") include = k <= x;
        if (inequality === "gt") include = k > x;
        if (inequality === "ge") include = k >= x;
        if (inequality === "between") include = k >= x && k <= upper;
        if (include) {
            highlightX.push(k);
            highlightY.push(pdfVal);
        }
    }

    let trace1 = { x: xValues, y: yValues, type: 'bar', name: 'PMF' };
    let trace2 = { x: highlightX, y: highlightY, type: 'bar', name: 'Probability Area', marker: { color: 'orange' } };

    Plotly.newPlot('discrete-plot', [trace1, trace2], { title: 'Binomial Distribution', margin: { t: 30 } });
}

// ===== POISSON DISTRIBUTION =====
function calculatePoisson() {
    const lambda = parseFloat(document.getElementById("pois-lambda").value);
    const inequality = document.getElementById("pois-inequality").value;
    const x = parseInt(document.getElementById("pois-x").value);
    const upper = parseInt(document.getElementById("pois-upper")?.value || "");

    let prob = 0;
    if (inequality === "eq") prob = jStat.poisson.pdf(x, lambda);
    if (inequality === "lt") prob = jStat.poisson.cdf(x - 1, lambda);
    if (inequality === "le") prob = jStat.poisson.cdf(x, lambda);
    if (inequality === "gt") prob = 1 - jStat.poisson.cdf(x, lambda);
    if (inequality === "ge") prob = 1 - jStat.poisson.cdf(x - 1, lambda);
    if (inequality === "between") {
        if (isNaN(upper)) {
            alert("Please enter the upper bound value");
            return;
        }
        prob = jStat.poisson.cdf(upper, lambda) - jStat.poisson.cdf(x - 1, lambda);
    }

    document.getElementById("pois-result").innerHTML = `Probability: ${prob.toFixed(4)}`;
    plotPoisson(lambda, x, upper, inequality);
}

function plotPoisson(lambda, x, upper, inequality) {
    let maxX = Math.ceil(lambda + 4 * Math.sqrt(lambda));
    let xValues = [], yValues = [], highlightX = [], highlightY = [];
    for (let k = 0; k <= maxX; k++) {
        let pdfVal = jStat.poisson.pdf(k, lambda);
        xValues.push(k);
        yValues.push(pdfVal);
        let include = false;
        if (inequality === "eq") include = k === x;
        if (inequality === "lt") include = k < x;
        if (inequality === "le") include = k <= x;
        if (inequality === "gt") include = k > x;
        if (inequality === "ge") include = k >= x;
        if (inequality === "between") include = k >= x && k <= upper;
        if (include) {
            highlightX.push(k);
            highlightY.push(pdfVal);
        }
    }

    let trace1 = { x: xValues, y: yValues, type: 'bar', name: 'PMF' };
    let trace2 = { x: highlightX, y: highlightY, type: 'bar', name: 'Probability Area', marker: { color: 'orange' } };

    Plotly.newPlot('discrete-plot', [trace1, trace2], { title: 'Poisson Distribution', margin: { t: 30 } });
}