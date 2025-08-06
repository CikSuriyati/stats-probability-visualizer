function getFormHTML(type) {
    switch(type) {
        case "normal":
            return `
                <label>Type:</label>
                <select id="normal-type">
                    <option value="population">Population</option>
                    <option value="sampling">Sampling Distribution</option>
                </select>
                <div id="n-container" style="display:none;">
                    <label>Sample Size (n):</label>
                    <input type="number" id="n-size">
                </div>
                <label>Mean (μ):</label>
                <input type="number" id="mean">
                <label>Standard Deviation (σ):</label>
                <input type="number" id="sd">
                <label>Inequality:</label>
                <select id="inequality">
                    <option value="lt"><</option>
                    <option value="le">≤</option>
                    <option value="gt">></option>
                    <option value="ge">≥</option>
                    <option value="between">Between</option>
                </select>
                <label>X value:</label>
                <input type="number" id="x-value">
                <div id="upper-bound-container" style="display:none;">
                    <label>Upper Bound:</label>
                    <input type="number" id="upper-bound">
                </div>
                <button onclick="calculateNormal()">Calculate Probability</button>
                <div id="result" class="result"></div>
            `;
        case "t":
            return `
                <label>Degrees of Freedom (df):</label>
                <input type="number" id="t-df">
                <label>Inequality:</label>
                <select id="t-inequality">
                    <option value="lt"><</option>
                    <option value="le">≤</option>
                    <option value="gt">></option>
                    <option value="ge">≥</option>
                    <option value="between">Between</option>
                </select>
                <label>X value:</label>
                <input type="number" id="t-x-value">
                <div id="t-upper-bound-container" style="display:none;">
                    <label>Upper Bound:</label>
                    <input type="number" id="t-upper-bound">
                </div>
                <button onclick="calculateT()">Calculate Probability</button>
                <div id="t-result" class="result"></div>
            `;
        case "binomial":
            return `
                <label>Number of Trials (n):</label>
                <input type="number" id="binom-n">
                <label>Probability of Success (p):</label>
                <input type="number" step="0.01" id="binom-p">
                <label>Inequality:</label>
                <select id="binom-inequality">
                    <option value="eq">=</option>
                    <option value="lt"><</option>
                    <option value="le">≤</option>
                    <option value="gt">></option>
                    <option value="ge">≥</option>
                    <option value="between">Between</option>
                </select>
                <label>X value:</label>
                <input type="number" id="binom-x">
                <div id="binom-upper-container" style="display:none;">
                    <label>Upper Bound:</label>
                    <input type="number" id="binom-upper">
                </div>
                <button onclick="calculateBinomial()">Calculate Probability</button>
                <div id="binom-result" class="result"></div>
            `;
        case "poisson":
            return `
                <label>Lambda (λ):</label>
                <input type="number" step="0.01" id="pois-lambda">
                <label>Inequality:</label>
                <select id="pois-inequality">
                    <option value="eq">=</option>
                    <option value="lt"><</option>
                    <option value="le">≤</option>
                    <option value="gt">></option>
                    <option value="ge">≥</option>
                    <option value="between">Between</option>
                </select>
                <label>X value:</label>
                <input type="number" id="pois-x">
                <div id="pois-upper-container" style="display:none;">
                    <label>Upper Bound:</label>
                    <input type="number" id="pois-upper">
                </div>
                <button onclick="calculatePoisson()">Calculate Probability</button>
                <div id="pois-result" class="result"></div>
            `;
        default:
            return "";
    }
}