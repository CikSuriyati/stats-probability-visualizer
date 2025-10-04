function getFormHTML(dist, type) {
    switch(dist) {
        case "normal":
            return `
                <div class="form-section">
                    <label>Type:</label>
                    <select id="normal-type" onchange="toggleNSample()">
                        <option value="population">Population</option>
                        <option value="sampling">Sampling Distribution</option>
                    </select>
                    <div id="n-size-container" style="display:none;">
                        <label>Sample Size (n):</label>
                        <input type="number" id="n-size" step="any">
                    </div>
                    <label>Mean (μ):</label>
                    <input type="number" id="mean" step="any">
                    <label>Standard Deviation (σ):</label>
                    <input type="number" id="sd" step="any">
                    <label>Inequality:</label>
                    <select id="normal-inequality" onchange="toggleUpperBound('normal')">
                        <option value="lt">&lt;</option>
                        <option value="le">&le;</option>
                        <option value="gt">&gt;</option>
                        <option value="ge">&ge;</option>
                        <option value="between">Between</option>
                    </select>
                    <label id="normal-x-label">X Value:</label>
                    <input type="number" id="x-value" step="any">
                    <div id="upper-bound-container-normal" style="display:none;">
                        <label id="normal-upper-label">Upper Bound:</label>
                        <input type="number" id="upper-bound" step="any">
                    </div>
                    <div class="precision-control">
                        <label>
                            <input type="radio" name="precision" value="4" checked>
                            <strong>📊 Statistical Table Format (4 decimals)</strong>
                        </label>
                        <div class="precision-options">
                            <div class="precision-option">
                                <input type="radio" name="precision" value="6" id="normal-precision-6">
                                <label for="normal-precision-6">High precision (6 decimals)</label>
                            </div>
                        </div>
                    </div>
                    <button onclick="calculateNormal()">Calculate Probability</button>
                    <div id="result"></div>
                </div>
            `;
            break;
        case "t":
            return `
                <div class="form-section">
                    <label>Degrees of Freedom (df):</label>
                    <input type="number" id="t-df" step="any">
                    <label>Inequality:</label>
                    <select id="t-inequality" onchange="toggleUpperBound('t')">
                        <option value="lt">&lt;</option>
                        <option value="le">&le;</option>
                        <option value="gt">&gt;</option>
                        <option value="ge">&ge;</option>
                        <option value="between">Between</option>
                    </select>
                    <label id="t-x-label">X Value:</label>
                    <input type="number" id="t-x-value" step="any">
                    <div id="upper-bound-container-t" style="display:none;">
                        <label id="t-upper-label">Upper Bound:</label>
                        <input type="number" id="t-upper-bound" step="any">
                    </div>
                    <div class="precision-control">
                        <label>
                            <input type="radio" name="t-precision" value="4" checked>
                            <strong>📊 Statistical Table Format (4 decimals)</strong>
                        </label>
                        <div class="precision-options">
                            <div class="precision-option">
                                <input type="radio" name="t-precision" value="6" id="t-precision-6">
                                <label for="t-precision-6">High precision (6 decimals)</label>
                            </div>
                        </div>
                    </div>
                    <button onclick="calculateT()">Calculate Probability</button>
                    <div id="t-result"></div>
                </div>
            `;
            break;
        case "binomial":
            return `
                <div class="form-section">
                    <label>Number of Trials (n):</label>
                    <input type="number" id="binom-n" placeholder="e.g., 20">
                    <label>Probability of Success (p):</label>
                    <input type="number" id="binom-p" step="any" placeholder="e.g., 0.3">
                    <label>Inequality:</label>
                    <select id="binom-inequality" onchange="toggleUpperBound('binom')">
                        <option value="eq">P(X = k)</option>
                        <option value="lt">P(X < k)</option>
                        <option value="le">P(X ≤ k)</option>
                        <option value="gt">P(X > k)</option>
                        <option value="ge">P(X ≥ k)</option>
                        <option value="between">P(a ≤ X ≤ b)</option>
                    </select>
                    <label id="binom-x-label">X Value (k):</label>
                    <input type="number" id="binom-x" placeholder="e.g., 5">
                    <div id="upper-bound-container-binom" style="display:none;">
                        <label id="binom-upper-label">Upper Bound (b):</label>
                        <input type="number" id="binom-upper" placeholder="e.g., 10">
                    </div>
                    <div style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border-radius: 8px; border-left: 4px solid #f39c12; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <label style="display: flex; align-items: center; margin: 0; cursor: pointer;">
                            <input type="checkbox" id="continuity-correction" style="margin-right: 12px; width: 18px; height: 18px; accent-color: #f39c12;">
                            <span style="font-size: 14px; color: #2c3e50; font-weight: 500;">Apply continuity correction for normal approximation</span>
                        </label>
                        <div style="font-size: 12px; color: #7f8c8d; margin-top: 8px; margin-left: 30px;">
                            ✓ Recommended when np ≥ 5 and n(1-p) ≥ 5
                        </div>
                    </div>
                    <div class="precision-control">
                        <label>
                            <input type="radio" name="binom-precision" value="4" checked>
                            <strong>📊 Statistical Table Format (4 decimals)</strong>
                        </label>
                        <div class="precision-options">
                            <div class="precision-option">
                                <input type="radio" name="binom-precision" value="6" id="binom-precision-6">
                                <label for="binom-precision-6">High precision (6 decimals)</label>
                            </div>
                        </div>
                    </div>
                    <button onclick="calculateBinomial()">Calculate Probability</button>
                    <div id="binom-result"></div>
                </div>
            `;
            break;
        case "poisson":
            return `
                <div class="form-section">
                    <label>Rate Parameter (λ):</label>
                    <input type="number" id="pois-lambda" step="any" placeholder="e.g., 3.5">
                    <div style="margin: 15px 0; padding: 12px; background: linear-gradient(135deg, #e8f4fd 0%, #f0f8ff 100%); border-radius: 8px; border-left: 4px solid #3498db; box-shadow: 0 2px 8px rgba(52, 152, 219, 0.1);">
                        <div style="color: #2c3e50; font-size: 13px; font-weight: 500; margin-bottom: 4px;">
                            <strong>📊 Distribution Parameter:</strong>
                        </div>
                        <div style="color: #34495e; font-size: 12px; line-height: 1.4;">
                            λ (lambda) is both the rate and mean of the Poisson distribution.<br>
                            It represents the average number of events per unit time/space.
                        </div>
                    </div>
                    <label>Inequality:</label>
                    <select id="pois-inequality" onchange="toggleUpperBound('pois')">
                        <option value="eq">P(X = k)</option>
                        <option value="lt">P(X < k)</option>
                        <option value="le">P(X ≤ k)</option>
                        <option value="gt">P(X > k)</option>
                        <option value="ge">P(X ≥ k)</option>
                        <option value="between">P(a ≤ X ≤ b)</option>
                    </select>
                    <label id="pois-x-label">X Value (k):</label>
                    <input type="number" id="pois-x" placeholder="e.g., 2">
                    <div id="upper-bound-container-pois" style="display:none;">
                        <label id="pois-upper-label">Upper Bound (b):</label>
                        <input type="number" id="pois-upper" placeholder="e.g., 5">
                    </div>
                    <div style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border-radius: 8px; border-left: 4px solid #f39c12; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <div style="font-size: 14px; color: #2c3e50; margin-bottom: 10px; font-weight: 600;">
                            <strong>📈 Probability Types:</strong>
                        </div>
                        <div style="font-size: 13px; color: #34495e; line-height: 1.6;">
                            <div style="margin-bottom: 4px;">• <strong>P(X ≤ k)</strong> = Left tail probability (cumulative)</div>
                            <div style="margin-bottom: 4px;">• <strong>P(X ≥ k)</strong> = Right tail probability (survival)</div>
                            <div>• <strong>P(X = k)</strong> = Exact probability (point mass)</div>
                        </div>
                    </div>
                    <div class="precision-control">
                        <label>
                            <input type="radio" name="pois-precision" value="4" checked>
                            <strong>📊 Statistical Table Format (4 decimals)</strong>
                        </label>
                        <div class="precision-options">
                            <div class="precision-option">
                                <input type="radio" name="pois-precision" value="6" id="pois-precision-6">
                                <label for="pois-precision-6">High precision (6 decimals)</label>
                            </div>
                        </div>
                    </div>
                    <button onclick="calculatePoisson()">Calculate Probability</button>
                    <div id="pois-result"></div>
                </div>
            `;
            break;
        default:
            return "";
    }
}