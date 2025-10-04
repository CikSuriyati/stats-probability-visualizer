// distributions.js

// ===== USER COUNT TRACKING =====
function updateUserCount() {
    // Get current count from localStorage or initialize to 0
    let userCount = parseInt(localStorage.getItem('probVizUserCount') || '0');
    
    // Check if this is a new session (not just a page refresh)
    const sessionKey = 'probVizSession_' + Date.now();
    const lastSession = localStorage.getItem('probVizLastSession');
    const now = Date.now();
    
    // Only increment if it's been more than 30 minutes since last visit
    // This prevents counting page refreshes as new users
    if (!lastSession || (now - parseInt(lastSession)) > 30 * 60 * 1000) {
        userCount++;
        localStorage.setItem('probVizUserCount', userCount.toString());
        localStorage.setItem('probVizLastSession', now.toString());
    }
    
    // Display the count with formatting
    const countElement = document.getElementById('user-count');
    if (countElement) {
        countElement.textContent = userCount.toLocaleString();
        
        // Add a subtle animation when count updates
        countElement.style.transition = 'all 0.3s ease';
        countElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            countElement.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Track additional metrics
    trackUsageMetrics();
    
    // Optional: Send to analytics service
    // sendUserCountToServer(userCount);
}

function trackUsageMetrics() {
    // Track total page views
    let pageViews = parseInt(localStorage.getItem('probVizPageViews') || '0');
    pageViews++;
    localStorage.setItem('probVizPageViews', pageViews.toString());
    
    // Track first visit date
    if (!localStorage.getItem('probVizFirstVisit')) {
        localStorage.setItem('probVizFirstVisit', new Date().toISOString());
    }
    
    // Track last visit
    localStorage.setItem('probVizLastVisit', new Date().toISOString());
}

function getUsageStats() {
    const userCount = parseInt(localStorage.getItem('probVizUserCount') || '0');
    const pageViews = parseInt(localStorage.getItem('probVizPageViews') || '0');
    const firstVisit = localStorage.getItem('probVizFirstVisit');
    const lastVisit = localStorage.getItem('probVizLastVisit');
    
    return {
        uniqueUsers: userCount,
        totalPageViews: pageViews,
        firstVisit: firstVisit,
        lastVisit: lastVisit
    };
}

// Optional: Function to send count to server for centralized tracking
function sendUserCountToServer(count) {
    // This would typically send to your analytics service
    // For now, we'll just use localStorage
    console.log(`User count: ${count}`);
}

// Function to restore welcome message
function restoreWelcomeMessage(type) {
    const plotId = type === 'continuous' ? 'continuous-plot' : 'discrete-plot';
    const welcomeId = type === 'continuous' ? 'welcome-message' : 'welcome-message-discrete';
    
    const plotBox = document.getElementById(plotId);
    const existingWelcome = document.getElementById(welcomeId);
    
    // Only add welcome message if it doesn't exist
    if (!existingWelcome) {
        const welcomeHTML = `
            <div id="${welcomeId}" style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center; color: #7f8c8d; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">📊</div>
                <h4 style="color: #34495e; margin-bottom: 15px; font-size: 20px;">Welcome to ProbViz!</h4>
                <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                    Select a distribution from the left panel and enter your values to see beautiful probability visualizations come to life!
                </p>
                <div class="welcome-tags" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 20px;">
                    <span style="background: #e8f5e8; color: #27ae60; padding: 8px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">📈 Normal Distribution</span>
                    <span style="background: #fff3cd; color: #f39c12; padding: 8px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">📊 Binomial Distribution</span>
                    <span style="background: #e8f4fd; color: #3498db; padding: 8px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">📉 Poisson Distribution</span>
                    <span style="background: #f0e6ff; color: #9b59b6; padding: 8px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">📋 t-Distribution</span>
                </div>
            </div>
        `;
        plotBox.innerHTML = welcomeHTML;
    }
}

// Initialize user count when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateUserCount();
    
    // Add click tracking for the user count (shows stats)
    const countElement = document.getElementById('user-count');
    if (countElement) {
        countElement.style.cursor = 'pointer';
        countElement.title = 'Click to see usage statistics';
        countElement.addEventListener('click', function() {
            const stats = getUsageStats();
            alert(`📊 ProbViz Usage Statistics:\n\n` +
                  `👥 Unique Users: ${stats.uniqueUsers.toLocaleString()}\n` +
                  `📄 Total Page Views: ${stats.totalPageViews.toLocaleString()}\n` +
                  `📅 First Visit: ${stats.firstVisit ? new Date(stats.firstVisit).toLocaleDateString() : 'Unknown'}\n` +
                  `🕒 Last Visit: ${stats.lastVisit ? new Date(stats.lastVisit).toLocaleDateString() : 'Unknown'}`);
        });
    }
});

// ===== NORMAL DISTRIBUTION =====
function calculateNormal() {
    const type = document.getElementById("normal-type").value;
    const mean = parseFloat(document.getElementById("mean").value);
    const sd = parseFloat(document.getElementById("sd").value);
    const inequality = document.getElementById("normal-inequality").value;
    const x = parseFloat(document.getElementById("x-value").value);
    const upper = parseFloat(document.getElementById("upper-bound")?.value || "");
    let n = 1;

    // Input validation
    if (isNaN(mean)) {
        alert("Please enter a valid mean (μ)");
        return;
    }
    if (isNaN(sd) || sd <= 0) {
        alert("Please enter a valid standard deviation (σ) > 0");
        return;
    }
    if (isNaN(x)) {
        alert("Please enter a valid X value");
        return;
    }

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

    // Get precision setting
    const precision = document.querySelector('input[name="precision"]:checked')?.value || "4";
    const decimalPlaces = parseInt(precision);
    
    const resultHTML = `
        <div style="margin-top: 15px; padding: 15px; background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%); border-radius: 8px; border-left: 4px solid #27ae60; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="font-weight: bold; color: #2c3e50; margin-bottom: 8px; font-size: 16px;">📊 Probability Result:</div>
            <div style="font-size: 20px; font-weight: 600; color: #27ae60;">${prob.toFixed(decimalPlaces)}</div>
        </div>
    `;
    document.getElementById("result").innerHTML = resultHTML;
    
    // Update explanation
    updateExplanation("continuous", "normal", {
        mean: mean,
        sd: sd,
        x: x,
        upper: upper,
        inequality: inequality,
        type: type,
        n: n
    });
    
    try {
        plotNormal(mean, sdUsed, x, upper, inequality);
    } catch (error) {
        console.error("Error plotting normal distribution:", error);
        alert("Error generating plot. Please check your inputs.");
    }
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

    // Remove welcome message completely and show plot
    const welcomeMsg = document.getElementById('welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    Plotly.newPlot('continuous-plot', [trace1, trace2], { title: 'Normal Distribution', margin: { t: 30 } });
}

// ===== T-DISTRIBUTION =====
function calculateT() {
    const df = parseFloat(document.getElementById("t-df").value);
    const inequality = document.getElementById("t-inequality").value;
    const x = parseFloat(document.getElementById("t-x-value").value);
    const upper = parseFloat(document.getElementById("t-upper-bound")?.value || "");

    // Input validation
    if (isNaN(df) || df <= 0) {
        alert("Please enter a valid degrees of freedom (df) > 0");
        return;
    }
    if (isNaN(x)) {
        alert("Please enter a valid X value");
        return;
    }

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

    // Get precision setting
    const precision = document.querySelector('input[name="t-precision"]:checked')?.value || "4";
    const decimalPlaces = parseInt(precision);
    
    const resultHTML = `
        <div style="margin-top: 15px; padding: 15px; background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%); border-radius: 8px; border-left: 4px solid #27ae60; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="font-weight: bold; color: #2c3e50; margin-bottom: 8px; font-size: 16px;">📊 Probability Result:</div>
            <div style="font-size: 20px; font-weight: 600; color: #27ae60;">${prob.toFixed(decimalPlaces)}</div>
        </div>
    `;
    document.getElementById("t-result").innerHTML = resultHTML;
    
    // Update explanation
    updateExplanation("continuous", "t", {
        df: df,
        x: x,
        upper: upper,
        inequality: inequality
    });
    
    try {
        plotT(df, x, upper, inequality);
    } catch (error) {
        console.error("Error plotting t-distribution:", error);
        alert("Error generating plot. Please check your inputs.");
    }
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

    // Remove welcome message completely and show plot
    const welcomeMsg = document.getElementById('welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    Plotly.newPlot('continuous-plot', [trace1, trace2], { title: 't-Distribution', margin: { t: 30 } });
}

// ===== BINOMIAL DISTRIBUTION =====
function calculateBinomial() {
    const n = parseInt(document.getElementById("binom-n").value);
    const p = parseFloat(document.getElementById("binom-p").value);
    const inequality = document.getElementById("binom-inequality").value;
    const x = parseInt(document.getElementById("binom-x").value);
    const upper = parseInt(document.getElementById("binom-upper")?.value || "");
    const continuityCorrection = document.getElementById("continuity-correction")?.checked || false;

    // Input validation
    if (isNaN(n) || n <= 0 || !Number.isInteger(n)) {
        alert("Please enter a valid number of trials (n) > 0");
        return;
    }
    if (isNaN(p) || p < 0 || p > 1) {
        alert("Please enter a valid probability (p) between 0 and 1");
        return;
    }
    if (isNaN(x) || x < 0 || x > n || !Number.isInteger(x)) {
        alert("Please enter a valid X value between 0 and n");
        return;
    }

    let prob = 0;
    let method = "Exact Binomial";
    
    if (continuityCorrection && n * p >= 5 && n * (1 - p) >= 5) {
        // Use normal approximation with continuity correction
        const mean = n * p;
        const std = Math.sqrt(n * p * (1 - p));
        let z1, z2;
        
        if (inequality === "eq") {
            z1 = (x - 0.5 - mean) / std;
            z2 = (x + 0.5 - mean) / std;
            prob = jStat.normal.cdf(z2, 0, 1) - jStat.normal.cdf(z1, 0, 1);
        } else if (inequality === "lt") {
            z1 = (x - 0.5 - mean) / std;
            prob = jStat.normal.cdf(z1, 0, 1);
        } else if (inequality === "le") {
            z1 = (x + 0.5 - mean) / std;
            prob = jStat.normal.cdf(z1, 0, 1);
        } else if (inequality === "gt") {
            z1 = (x + 0.5 - mean) / std;
            prob = 1 - jStat.normal.cdf(z1, 0, 1);
        } else if (inequality === "ge") {
            z1 = (x - 0.5 - mean) / std;
            prob = 1 - jStat.normal.cdf(z1, 0, 1);
        } else if (inequality === "between") {
            if (isNaN(upper)) {
                alert("Please enter the upper bound value");
                return;
            }
            z1 = (x - 0.5 - mean) / std;
            z2 = (upper + 0.5 - mean) / std;
            prob = jStat.normal.cdf(z2, 0, 1) - jStat.normal.cdf(z1, 0, 1);
        }
        method = "Normal Approximation (with continuity correction)";
    } else {
        // Use exact binomial calculation
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
    }

    // Get precision setting
    const precision = document.querySelector('input[name="binom-precision"]:checked')?.value || "4";
    const decimalPlaces = parseInt(precision);
    
    const resultHTML = `
        <div style="margin-top: 15px; padding: 15px; background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%); border-radius: 8px; border-left: 4px solid #27ae60; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="font-weight: bold; color: #2c3e50; margin-bottom: 8px; font-size: 16px;">📊 Probability Result:</div>
            <div style="font-size: 20px; font-weight: 600; color: #27ae60; margin-bottom: 8px;">${prob.toFixed(decimalPlaces)}</div>
            <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Method: ${method}</div>
            ${continuityCorrection && n * p < 5 ? '<div style="font-size: 12px; color: #e74c3c; margin-top: 5px;">⚠️ Normal approximation not recommended (np < 5)</div>' : ''}
        </div>
    `;
    
    document.getElementById("binom-result").innerHTML = resultHTML;
    
    // Update explanation
    updateExplanation("discrete", "binomial", {
        n: n,
        p: p,
        x: x,
        upper: upper,
        inequality: inequality,
        continuityCorrection: continuityCorrection
    });
    
    try {
        plotBinomial(n, p, x, upper, inequality);
    } catch (error) {
        console.error("Error plotting binomial distribution:", error);
        alert("Error generating plot. Please check your inputs.");
    }
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

    // Remove welcome message completely and show plot
    const welcomeMsg = document.getElementById('welcome-message-discrete');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    Plotly.newPlot('discrete-plot', [trace1, trace2], { title: 'Binomial Distribution', margin: { t: 30 } });
}

// ===== POISSON DISTRIBUTION =====
function calculatePoisson() {
    const lambda = parseFloat(document.getElementById("pois-lambda").value);
    const inequality = document.getElementById("pois-inequality").value;
    const x = parseInt(document.getElementById("pois-x").value);
    const upper = parseInt(document.getElementById("pois-upper")?.value || "");

    // Input validation
    if (isNaN(lambda) || lambda <= 0) {
        alert("Please enter a valid lambda (λ) > 0");
        return;
    }
    if (isNaN(x) || x < 0 || !Number.isInteger(x)) {
        alert("Please enter a valid X value ≥ 0");
        return;
    }

    let prob = 0;
    let description = "";
    
    if (inequality === "eq") {
        prob = jStat.poisson.pdf(x, lambda);
        description = `P(X = ${x})`;
    } else if (inequality === "lt") {
        prob = jStat.poisson.cdf(x - 1, lambda);
        description = `P(X < ${x})`;
    } else if (inequality === "le") {
        prob = jStat.poisson.cdf(x, lambda);
        description = `P(X ≤ ${x})`;
    } else if (inequality === "gt") {
        prob = 1 - jStat.poisson.cdf(x, lambda);
        description = `P(X > ${x})`;
    } else if (inequality === "ge") {
        prob = 1 - jStat.poisson.cdf(x - 1, lambda);
        description = `P(X ≥ ${x})`;
    } else if (inequality === "between") {
        if (isNaN(upper)) {
            alert("Please enter the upper bound value");
            return;
        }
        prob = jStat.poisson.cdf(upper, lambda) - jStat.poisson.cdf(x - 1, lambda);
        description = `P(${x} ≤ X ≤ ${upper})`;
    }

    // Get precision setting
    const precision = document.querySelector('input[name="pois-precision"]:checked')?.value || "4";
    const decimalPlaces = parseInt(precision);
    
    const resultHTML = `
        <div style="margin-top: 15px; padding: 15px; background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%); border-radius: 8px; border-left: 4px solid #27ae60; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="font-weight: bold; color: #2c3e50; margin-bottom: 8px; font-size: 16px;">📊 Probability Result:</div>
            <div style="font-size: 20px; font-weight: 600; color: #27ae60; margin-bottom: 8px;">${description} = ${prob.toFixed(decimalPlaces)}</div>
            <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
                <strong>Distribution Info:</strong><br>
                • Mean (λ) = ${lambda}<br>
                • Variance = ${lambda}<br>
                • Standard Deviation = ${Math.sqrt(lambda).toFixed(4)}
            </div>
            <div style="font-size: 12px; color: #888;">
                ${lambda >= 10 ? '✓ Normal approximation available (λ ≥ 10)' : '⚠️ Normal approximation not recommended (λ < 10)'}
            </div>
        </div>
    `;
    
    document.getElementById("pois-result").innerHTML = resultHTML;
    
    // Update explanation
    updateExplanation("discrete", "poisson", {
        lambda: lambda,
        x: x,
        upper: upper,
        inequality: inequality
    });
    
    try {
        plotPoisson(lambda, x, upper, inequality);
    } catch (error) {
        console.error("Error plotting Poisson distribution:", error);
        alert("Error generating plot. Please check your inputs.");
    }
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

    // Remove welcome message completely and show plot
    const welcomeMsg = document.getElementById('welcome-message-discrete');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    Plotly.newPlot('discrete-plot', [trace1, trace2], { title: 'Poisson Distribution', margin: { t: 30 } });
}

// ===== PEDAGOGICAL EXPLANATION FUNCTIONS =====

function generateNormalExplanation(mean, sd, x, upper, inequality, type, n) {
    const sdUsed = type === "sampling" ? sd / Math.sqrt(n) : sd;
    const z = (x - mean) / sdUsed;
    const zUpper = upper ? (upper - mean) / sdUsed : null;
    
    let formula = "";
    let interpretation = "";
    let shadedArea = "";
    
    if (inequality === "lt" || inequality === "le") {
        formula = `P(X ≤ ${x}) = Φ(${z.toFixed(4)})`;
        interpretation = `This represents the probability that a randomly selected value from the normal distribution is less than or equal to ${x}. The value ${z.toFixed(4)} is the standardized z-score.`;
        shadedArea = `The shaded area under the curve represents all values from -∞ to ${x}, which corresponds to the cumulative probability.`;
    } else if (inequality === "gt" || inequality === "ge") {
        formula = `P(X ≥ ${x}) = 1 - Φ(${z.toFixed(4)})`;
        interpretation = `This represents the probability that a randomly selected value from the normal distribution is greater than or equal to ${x}. We use the complement rule: 1 minus the probability of being less than ${x}.`;
        shadedArea = `The shaded area under the curve represents all values from ${x} to +∞, which corresponds to the right tail probability.`;
    } else if (inequality === "between") {
        formula = `P(${x} ≤ X ≤ ${upper}) = Φ(${zUpper.toFixed(4)}) - Φ(${z.toFixed(4)})`;
        interpretation = `This represents the probability that a randomly selected value falls between ${x} and ${upper}. We subtract the cumulative probability at the lower bound from the upper bound.`;
        shadedArea = `The shaded area under the curve represents all values between ${x} and ${upper}, showing the probability mass in this interval.`;
    }
    
    if (type === "sampling") {
        formula += ` (using σ/√n = ${sdUsed.toFixed(4)})`;
        interpretation += ` Note: This uses the sampling distribution of the mean with standard error σ/√n = ${sdUsed.toFixed(4)}.`;
    }
    
    return {
        formula: formula,
        interpretation: interpretation,
        shadedArea: shadedArea
    };
}

function generateTExplanation(df, x, upper, inequality) {
    let formula = "";
    let interpretation = "";
    let shadedArea = "";
    
    if (inequality === "lt" || inequality === "le") {
        formula = `P(T ≤ ${x}) = F(${x}; ${df})`;
        interpretation = `This represents the probability that a t-statistic with ${df} degrees of freedom is less than or equal to ${x}. The t-distribution is used for small sample sizes and when the population standard deviation is unknown.`;
        shadedArea = `The shaded area under the t-distribution curve represents all values from -∞ to ${x}, showing the cumulative probability.`;
    } else if (inequality === "gt" || inequality === "ge") {
        formula = `P(T ≥ ${x}) = 1 - F(${x}; ${df})`;
        interpretation = `This represents the probability that a t-statistic with ${df} degrees of freedom is greater than or equal to ${x}. We use the complement rule since the t-distribution is symmetric.`;
        shadedArea = `The shaded area under the t-distribution curve represents all values from ${x} to +∞, showing the right tail probability.`;
    } else if (inequality === "between") {
        formula = `P(${x} ≤ T ≤ ${upper}) = F(${upper}; ${df}) - F(${x}; ${df})`;
        interpretation = `This represents the probability that a t-statistic with ${df} degrees of freedom falls between ${x} and ${upper}. The t-distribution becomes more normal-like as degrees of freedom increase.`;
        shadedArea = `The shaded area under the t-distribution curve represents all values between ${x} and ${upper}, showing the probability mass in this interval.`;
    }
    
    return {
        formula: formula,
        interpretation: interpretation,
        shadedArea: shadedArea
    };
}

function generateBinomialExplanation(n, p, x, upper, inequality, continuityCorrection) {
    let formula = "";
    let interpretation = "";
    let shadedArea = "";
    
    if (continuityCorrection && n * p >= 5 && n * (1 - p) >= 5) {
        // Normal approximation
        const mean = n * p;
        const std = Math.sqrt(n * p * (1 - p));
        const z = (x - mean) / std;
        const zUpper = upper ? (upper - mean) / std : null;
        
        if (inequality === "eq") {
            formula = `P(X = ${x}) ≈ P(${x-0.5} ≤ Y ≤ ${x+0.5}) where Y ~ N(${mean}, ${std.toFixed(4)}²)`;
            interpretation = `Using normal approximation with continuity correction. We approximate the discrete binomial with a continuous normal distribution, adjusting the bounds by ±0.5.`;
            shadedArea = `The shaded area represents the probability mass at exactly ${x} successes, approximated by the area under the normal curve between ${x-0.5} and ${x+0.5}.`;
        } else if (inequality === "le") {
            formula = `P(X ≤ ${x}) ≈ P(Y ≤ ${x+0.5}) where Y ~ N(${mean}, ${std.toFixed(4)}²)`;
            interpretation = `Using normal approximation with continuity correction. We add 0.5 to the upper bound to account for the discrete nature of the binomial distribution.`;
            shadedArea = `The shaded area represents the probability of ${x} or fewer successes, approximated by the area under the normal curve up to ${x+0.5}.`;
        } else if (inequality === "ge") {
            formula = `P(X ≥ ${x}) ≈ P(Y ≥ ${x-0.5}) where Y ~ N(${mean}, ${std.toFixed(4)}²)`;
            interpretation = `Using normal approximation with continuity correction. We subtract 0.5 from the lower bound to account for the discrete nature of the binomial distribution.`;
            shadedArea = `The shaded area represents the probability of ${x} or more successes, approximated by the area under the normal curve from ${x-0.5} onwards.`;
        } else if (inequality === "between") {
            formula = `P(${x} ≤ X ≤ ${upper}) ≈ P(${x-0.5} ≤ Y ≤ ${upper+0.5}) where Y ~ N(${mean}, ${std.toFixed(4)}²)`;
            interpretation = `Using normal approximation with continuity correction. We adjust both bounds by ±0.5 to better approximate the discrete binomial probabilities.`;
            shadedArea = `The shaded area represents the probability of between ${x} and ${upper} successes, approximated by the area under the normal curve between ${x-0.5} and ${upper+0.5}.`;
        }
    } else {
        // Exact binomial
        if (inequality === "eq") {
            formula = `P(X = ${x}) = C(${n}, ${x}) × ${p}^${x} × ${(1-p)}^${n-x}`;
            interpretation = `This is the exact binomial probability of getting exactly ${x} successes in ${n} trials. The formula uses the binomial coefficient C(${n}, ${x}) and the probability of success ${p}.`;
            shadedArea = `The shaded bar represents the probability mass at exactly ${x} successes, showing the discrete probability for this specific outcome.`;
        } else if (inequality === "le") {
            formula = `P(X ≤ ${x}) = Σ(k=0 to ${x}) C(${n}, k) × ${p}^k × ${(1-p)}^${n-k}`;
            interpretation = `This is the cumulative probability of getting ${x} or fewer successes in ${n} trials. We sum the probabilities of all outcomes from 0 to ${x} successes.`;
            shadedArea = `The shaded bars represent the probability mass for 0, 1, 2, ..., ${x} successes, showing the cumulative probability.`;
        } else if (inequality === "ge") {
            formula = `P(X ≥ ${x}) = 1 - P(X ≤ ${x-1}) = 1 - Σ(k=0 to ${x-1}) C(${n}, k) × ${p}^k × ${(1-p)}^${n-k}`;
            interpretation = `This is the probability of getting ${x} or more successes in ${n} trials. We use the complement rule: 1 minus the probability of getting fewer than ${x} successes.`;
            shadedArea = `The shaded bars represent the probability mass for ${x}, ${x+1}, ..., ${n} successes, showing the right tail probability.`;
        } else if (inequality === "between") {
            formula = `P(${x} ≤ X ≤ ${upper}) = Σ(k=${x} to ${upper}) C(${n}, k) × ${p}^k × ${(1-p)}^${n-k}`;
            interpretation = `This is the probability of getting between ${x} and ${upper} successes in ${n} trials. We sum the probabilities of all outcomes from ${x} to ${upper} successes.`;
            shadedArea = `The shaded bars represent the probability mass for ${x}, ${x+1}, ..., ${upper} successes, showing the probability in this range.`;
        }
    }
    
    return {
        formula: formula,
        interpretation: interpretation,
        shadedArea: shadedArea
    };
}

function generatePoissonExplanation(lambda, x, upper, inequality) {
    let formula = "";
    let interpretation = "";
    let shadedArea = "";
    
    if (inequality === "eq") {
        formula = `P(X = ${x}) = (e^(-${lambda}) × ${lambda}^${x}) / ${x}!`;
        interpretation = `This is the exact Poisson probability of getting exactly ${x} events. The Poisson distribution models rare events occurring at a constant rate λ = ${lambda}.`;
        shadedArea = `The shaded bar represents the probability mass at exactly ${x} events, showing the discrete probability for this specific outcome.`;
    } else if (inequality === "le") {
        formula = `P(X ≤ ${x}) = Σ(k=0 to ${x}) (e^(-${lambda}) × ${lambda}^k) / k!`;
        interpretation = `This is the cumulative probability of getting ${x} or fewer events. We sum the probabilities of all outcomes from 0 to ${x} events using the Poisson formula.`;
        shadedArea = `The shaded bars represent the probability mass for 0, 1, 2, ..., ${x} events, showing the cumulative probability.`;
    } else if (inequality === "ge") {
        formula = `P(X ≥ ${x}) = 1 - P(X ≤ ${x-1}) = 1 - Σ(k=0 to ${x-1}) (e^(-${lambda}) × ${lambda}^k) / k!`;
        interpretation = `This is the probability of getting ${x} or more events. We use the complement rule: 1 minus the probability of getting fewer than ${x} events.`;
        shadedArea = `The shaded bars represent the probability mass for ${x}, ${x+1}, ${x+2}, ... events, showing the right tail probability.`;
    } else if (inequality === "between") {
        formula = `P(${x} ≤ X ≤ ${upper}) = Σ(k=${x} to ${upper}) (e^(-${lambda}) × ${lambda}^k) / k!`;
        interpretation = `This is the probability of getting between ${x} and ${upper} events. We sum the probabilities of all outcomes from ${x} to ${upper} events.`;
        shadedArea = `The shaded bars represent the probability mass for ${x}, ${x+1}, ..., ${upper} events, showing the probability in this range.`;
    }
    
    return {
        formula: formula,
        interpretation: interpretation,
        shadedArea: shadedArea
    };
}

function updateExplanation(type, distribution, params) {
    let explanation = null;
    
    if (distribution === "normal") {
        explanation = generateNormalExplanation(params.mean, params.sd, params.x, params.upper, params.inequality, params.type, params.n);
    } else if (distribution === "t") {
        explanation = generateTExplanation(params.df, params.x, params.upper, params.inequality);
    } else if (distribution === "binomial") {
        explanation = generateBinomialExplanation(params.n, params.p, params.x, params.upper, params.inequality, params.continuityCorrection);
    } else if (distribution === "poisson") {
        explanation = generatePoissonExplanation(params.lambda, params.x, params.upper, params.inequality);
    }
    
    if (explanation) {
        const explainBody = document.getElementById(type + "-explain-body");
        explainBody.innerHTML = `
            <div class="formula-section">
                <div class="formula-title">📐 Formula Used:</div>
                <div class="formula-box">${explanation.formula}</div>
            </div>
            <div class="interpretation">
                <strong>💡 Interpretation:</strong><br>
                ${explanation.interpretation}
            </div>
            <div class="shaded-area">
                <strong>🎯 Shaded Area:</strong><br>
                ${explanation.shadedArea}
            </div>
        `;
    }
}