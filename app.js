// Main application logic for UI management
function openTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');

    const tabs = document.querySelectorAll('.tab');
    if (tabName === 'continuous') {
        tabs[0].classList.add('active');
    } else if (tabName === 'discrete') {
        tabs[1].classList.add('active');
    } else if (tabName === 'about') {
        tabs[2].classList.add('active');
    }

    document.getElementById(tabName).style.display = 'block';

    // Restore welcome message for the active tab (only for continuous and discrete)
    if (tabName === 'continuous' || tabName === 'discrete') {
        restoreWelcomeMessage(tabName);
    }
}

function showForm(type) {
    let selected;
    if (type === 'continuous') {
        selected = document.getElementById('continuous-select').value;
        document.getElementById('continuous-forms').innerHTML = getFormHTML(selected, type);
    } else {
        selected = document.getElementById('discrete-select').value;
        document.getElementById('discrete-forms').innerHTML = getFormHTML(selected, type);
    }
}

function toggleNSample() {
    const type = document.getElementById("normal-type").value;
    const nSizeContainer = document.getElementById("n-size-container");
    if (nSizeContainer) {
        nSizeContainer.style.display = type === "sampling" ? "block" : "none";
    }
}

function toggleUpperBound(dist) {
    const select = document.getElementById(dist + "-inequality");
    const container = document.getElementById("upper-bound-container-" + dist);
    const xLabel = document.getElementById(dist + "-x-label");
    const upperLabel = document.getElementById(dist + "-upper-label");

    if (select.value === "between") {
        container.style.display = "block";
        if (xLabel) xLabel.textContent = "Lower Bound (a):";
        if (upperLabel) upperLabel.textContent = "Upper Bound (b):";
    } else {
        container.style.display = "none";
        if (xLabel) xLabel.textContent = "X Value:";
    }
}

function toggleExplain(type) {
    const content = document.getElementById(type + "-explain");
    const toggle = document.getElementById(type + "-toggle");

    if (content.classList.contains("expanded")) {
        content.classList.remove("expanded");
        toggle.classList.remove("expanded");
    } else {
        content.classList.add("expanded");
        toggle.classList.add("expanded");
    }
}

// Fetch and display comprehensive analytics from GoatCounter
async function fetchAnalytics() {
    try {
        // Fetch main stats
        const response = await fetch('https://stats-probability-visualizer.goatcounter.com/counter/.json');
        const data = await response.json();

        // Update total visits
        const totalVisits = document.getElementById('total-visits');
        if (totalVisits && data.count) {
            totalVisits.textContent = data.count.toLocaleString();
        }

        // Update unique visits
        const uniqueVisits = document.getElementById('unique-visits');
        if (uniqueVisits && data.count_unique) {
            uniqueVisits.textContent = data.count_unique.toLocaleString();
        }

        // Fetch today's stats
        const today = new Date().toISOString().split('T')[0];
        const todayResponse = await fetch(`https://stats-probability-visualizer.goatcounter.com/counter/.json?start=${today}`);
        const todayData = await todayResponse.json();

        const todayVisits = document.getElementById('today-visits');
        if (todayVisits && todayData.count) {
            todayVisits.textContent = todayData.count.toLocaleString();
        }

        // Fetch this week's stats
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekStart = weekAgo.toISOString().split('T')[0];
        const weekResponse = await fetch(`https://stats-probability-visualizer.goatcounter.com/counter/.json?start=${weekStart}`);
        const weekData = await weekResponse.json();

        const weekVisits = document.getElementById('week-visits');
        if (weekVisits && weekData.count) {
            weekVisits.textContent = weekData.count.toLocaleString();
        }

        // Fetch top pages
        fetchTopPages();

        // Update footer counter with total count
        const userCount = document.getElementById('user-count');
        if (userCount && data.count) {
            userCount.textContent = data.count.toLocaleString();
        }

    } catch (error) {
        console.log('Could not fetch analytics:', error);
        // Keep default values if fetch fails
    }
}

// Fetch top pages from GoatCounter
async function fetchTopPages() {
    try {
        const response = await fetch('https://stats-probability-visualizer.goatcounter.com/api/v0/stats/hits', {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const topPagesList = document.getElementById('top-pages-list');

            if (topPagesList && data.stats && data.stats.length > 0) {
                let html = '';
                data.stats.slice(0, 5).forEach((page, index) => {
                    const barWidth = (page.count / data.stats[0].count) * 100;
                    html += `
                        <div style="margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span style="font-weight: 500; color: #2c3e50;">${page.path || '/'}</span>
                                <span style="color: #667eea; font-weight: 600;">${page.count.toLocaleString()}</span>
                            </div>
                            <div style="background: #e9ecef; border-radius: 4px; height: 6px; overflow: hidden;">
                                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 100%; width: ${barWidth}%; transition: width 0.3s;"></div>
                            </div>
                        </div>
                    `;
                });
                topPagesList.innerHTML = html;
            }
        } else {
            // If API is not accessible, show a simple message
            const topPagesList = document.getElementById('top-pages-list');
            if (topPagesList) {
                topPagesList.innerHTML = '<div style="text-align: center; color: #95a5a6; padding: 10px;">Page data requires API access. <a href="https://stats-probability-visualizer.goatcounter.com" target="_blank" style="color: #667eea;">View on GoatCounter</a></div>';
            }
        }
    } catch (error) {
        console.log('Could not fetch top pages:', error);
        const topPagesList = document.getElementById('top-pages-list');
        if (topPagesList) {
            topPagesList.innerHTML = '<div style="text-align: center; color: #95a5a6; padding: 10px;">Unable to load page data</div>';
        }
    }
}

// Load analytics when page loads and refresh every 10 seconds
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        fetchAnalytics();
        setInterval(fetchAnalytics, 10000); // Refresh every 10 seconds
    });
} else {
    fetchAnalytics();
    setInterval(fetchAnalytics, 10000);
}
