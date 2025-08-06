// Tab switching
function openTab(evt, tabId) {
    document.querySelectorAll(".tab-content").forEach(content => content.style.display = "none");
    document.querySelectorAll(".tab-button").forEach(tab => tab.classList.remove("active"));
    document.getElementById(tabId).style.display = "block";
    evt.currentTarget.classList.add("active");
}

// ===== Normal Distribution =====
function calculateNormal() {
    const type = document.getElementById("normal-type").value;
    const mean = parseFloat(document.getElementById("mean").value);
    const sd = parseFloat(document.getElementById("sd").value);
    const nSize = parseFloat(document.getElementById("n-size").value) || null;
    const inequality = document.getElementById("inequality").value;
    const xValue = parseFloat(document.getElementById("x-value").value);
    const upperBound = parseFloat(document.getElementById("upper-bound").value);

    if (isNaN(mean) || isNaN(sd) || isNaN(xValue) || (inequality === "between" && isNaN(upperBound))) {
        alert("Please fill in all required fields.");
        return;
    }

    let sigma = sd;
    if (type === "sampling" && nSize) {
        sigma = sd / Math.sqrt(nSize);
    }

    let probability = 0;
    if (["lt","le"].includes(inequality)) {
        probability = jStat.normal.cdf(xValue, mean, sigma);
    } else if (["gt","ge"].includes(inequality)) {
        probability = 1 - jStat.normal.cdf(xValue, mean, sigma);
    } else if (inequality === "between") {
        probability = jStat.normal.cdf(upperBound, mean, sigma) - jStat.normal.cdf(xValue, mean, sigma);
    }

    probability = probability.toFixed(4);
    document.getElementById("result").innerHTML = `P = ${probability} (Mean: ${mean}, SD: ${sigma})`;

    plotNormal(mean, sigma, inequality, xValue, upperBound);
}

function plotNormal(mean, sigma, inequality, xValue, upperBound) {
    const x = [], y = [], hx = [], hy = [];
    for (let i = mean - 4*sigma; i <= mean + 4*sigma; i += 0.1) {
        x.push(i);
        y.push(jStat.normal.pdf(i, mean, sigma));
        let inRegion = false;
        if (["lt","le"].includes(inequality)) inRegion = i <= xValue;
        if (["gt","ge"].includes(inequality)) inRegion = i >= xValue;
        if (inequality === "between") inRegion = i >= xValue && i <= upperBound;
        if (inRegion) { hx.push(i); hy.push(jStat.normal.pdf(i, mean, sigma)); }
    }
    Plotly.newPlot('plot', [
        { x, y, type: 'scatter', mode: 'lines', name: 'Normal PDF' },
        { x: hx, y: hy, type: 'scatter', mode: 'lines', name: 'Highlighted', fill: 'tozeroy' }
    ], { title: 'Normal Distribution' });
}

document.getElementById("normal-type").addEventListener("change", function() {
    document.getElementById("n-container").style.display = this.value === "sampling" ? "block" : "none";
});
document.getElementById("inequality").addEventListener("change", function() {
    document.getElementById("upper-bound-container").style.display = this.value === "between" ? "block" : "none";
});

// ===== t-Distribution =====
function calculateT() {
    const df = parseFloat(document.getElementById("t-df").value);
    const inequality = document.getElementById("t-inequality").value;
    const xValue = parseFloat(document.getElementById("t-x-value").value);
    const upperBound = parseFloat(document.getElementById("t-upper-bound").value);

    if (isNaN(df) || isNaN(xValue) || (inequality === "between" && isNaN(upperBound))) {
        alert("Please fill in all required fields.");
        return;
    }

    let probability = 0;
    if (["lt","le"].includes(inequality)) {
        probability = jStat.studentt.cdf(xValue, df);
    } else if (["gt","ge"].includes(inequality)) {
        probability = 1 - jStat.studentt.cdf(xValue, df);
    } else if (inequality === "between") {
        probability = jStat.studentt.cdf(upperBound, df) - jStat.studentt.cdf(xValue, df);
    }

    probability = probability.toFixed(4);
    document.getElementById("t-result").innerHTML = `P = ${probability} (df: ${df})`;

    plotT(df, inequality, xValue, upperBound);
}

function plotT(df, inequality, xValue, upperBound) {
    const x = [], y = [], hx = [], hy = [];
    for (let i = -5; i <= 5; i += 0.1) {
        x.push(i);
        y.push(jStat.studentt.pdf(i, df));
        let inRegion = false;
        if (["lt","le"].includes(inequality)) inRegion = i <= xValue;
        if (["gt","ge"].includes(inequality)) inRegion = i >= xValue;
        if (inequality === "between") inRegion = i >= xValue && i <= upperBound;
        if (inRegion) { hx.push(i); hy.push(jStat.studentt.pdf(i, df)); }
    }
    Plotly.newPlot('t-plot', [
        { x, y, type: 'scatter', mode: 'lines', name: 't PDF' },
        { x: hx, y: hy, type: 'scatter', mode: 'lines', name: 'Highlighted', fill: 'tozeroy' }
    ], { title: 't-Distribution' });
}

document.getElementById("t-inequality").addEventListener("change", function() {
    document.getElementById("t-upper-bound-container").style.display = this.value === "between" ? "block" : "none";
});