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

    // Adjust standard deviation for sampling distribution
    let sigma = sd;
    if (type === "sampling" && nSize) {
        sigma = sd / Math.sqrt(nSize);
    }

    let probability = 0;
    if (inequality === "lt" || inequality === "le") {
        probability = jStat.normal.cdf(xValue, mean, sigma);
    } else if (inequality === "gt" || inequality === "ge") {
        probability = 1 - jStat.normal.cdf(xValue, mean, sigma);
    } else if (inequality === "between") {
        probability = jStat.normal.cdf(upperBound, mean, sigma) -
                      jStat.normal.cdf(xValue, mean, sigma);
    }

    probability = probability.toFixed(4);

    // Show results
    document.getElementById("result").innerHTML =
      `P = ${probability} (Mean: ${mean}, SD: ${sigma})`;

    // Plot
    plotNormal(mean, sigma, inequality, xValue, upperBound);
}

// Plot function
function plotNormal(mean, sigma, inequality, xValue, upperBound) {
    const x = [];
    const y = [];
    const highlightX = [];
    const highlightY = [];

    for (let i = mean - 4 * sigma; i <= mean + 4 * sigma; i += 0.1) {
        x.push(i);
        y.push(jStat.normal.pdf(i, mean, sigma));

        let inRegion = false;
        if (inequality === "lt" || inequality === "le") {
            inRegion = i <= xValue;
        } else if (inequality === "gt" || inequality === "ge") {
            inRegion = i >= xValue;
        } else if (inequality === "between") {
            inRegion = i >= xValue && i <= upperBound;
        }
        if (inRegion) {
            highlightX.push(i);
            highlightY.push(jStat.normal.pdf(i, mean, sigma));
        }
    }

    const trace1 = { x: x, y: y, type: 'scatter', mode: 'lines', name: 'Normal PDF' };
    const trace2 = { x: highlightX, y: highlightY, type: 'scatter', mode: 'lines', name: 'Highlighted Area', fill: 'tozeroy' };

    const layout = { title: 'Normal Distribution', showlegend: true };
    Plotly.newPlot('plot', [trace1, trace2], layout);
}

// Show/hide fields dynamically
document.getElementById("normal-type").addEventListener("change", function() {
    if (this.value === "sampling") {
        document.getElementById("n-container").style.display = "block";
    } else {
        document.getElementById("n-container").style.display = "none";
    }
});

document.getElementById("inequality").addEventListener("change", function() {
    if (this.value === "between") {
        document.getElementById("upper-bound-container").style.display = "block";
    } else {
        document.getElementById("upper-bound-container").style.display = "none";
    }
});