function renderInputs() {
  const type = document.getElementById("distType").value;
  const container = document.getElementById("distInputs");

  if (type === "normal") {
    container.innerHTML = `
      <label>Mean (μ):</label>
      <input type="number" id="mean" value="50" step="0.1">
      <label>Std Dev (σ):</label>
      <input type="number" id="stddev" value="10" step="0.1">
    `;
  }
  // later we add inputs for t, binomial, poisson
}

function toggleBetweenInputs() {
  const type = document.getElementById("calcType").value;
  document.getElementById("singleValueInputs").style.display = (type === "between") ? "none" : "block";
  document.getElementById("betweenInputs").style.display = (type === "between") ? "block" : "none";
}

function calculate() {
  const dist = document.getElementById("distType").value;
  const type = document.getElementById("calcType").value;

  let result;
  if (dist === "normal") {
    result = calculateNormal({
      mean: parseFloat(document.getElementById("mean").value),
      stddev: parseFloat(document.getElementById("stddev").value),
      type,
      x: parseFloat(document.getElementById("x")?.value),
      x1: parseFloat(document.getElementById("x1")?.value),
      x2: parseFloat(document.getElementById("x2")?.value)
    });
  }

  if (!result) return;

  let extraText = "";
  if (result.extra.z !== null) {
    extraText = `<br>Z-score: <strong>${result.extra.z.toFixed(2)}</strong>`;
  }

  document.getElementById("output").innerHTML = `
    Probability: <strong>${result.probability.toFixed(4)}</strong>
    ${extraText}
  `;

  const trace1 = { x: result.curve.xs, y: result.curve.ys, type: 'scatter', line: {color: '#0056b3'}, name: 'Curve' };
  const trace2 = { x: result.highlight.xs, y: result.highlight.ys, type: 'scatter', fill: 'tozeroy', fillcolor: 'rgba(255,77,77,0.5)', line: {color: '#ff4d4d'}, name: 'Probability Area' };

  Plotly.newPlot('graph', [trace1, trace2], {
    margin: { t: 20 },
    xaxis: { title: 'X' },
    yaxis: { title: 'Probability Density' }
  });
}

renderInputs();