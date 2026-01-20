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

    //  Restore welcome message for the active tab (only for continuous and discrete)
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

// Update analytics dashboard with messaging
function updateAnalyticsDashboard() {
    const totalVisits = document.getElementById('total-visits');
    const todayVisits = document.getElementById('today-visits');
    const weekVisits = document.getElementById('week-visits');
    const uniqueVisits = document.getElementById('unique-visits');
    const topPagesList = document.getElementById('top-pages-list');

    // Show clickable cards that direct to full dashboard
    if (totalVisits) {
        totalVisits.innerHTML = '<div style="font-size: 20px; line-height: 1.4;">Click to<br/>View Data</div>';
    }
    if (todayVisits) {
        todayVisits.innerHTML = '<div style="font-size: 20px; line-height: 1.4;">Click to<br/>View Data</div>';
    }
    if (weekVisits) {
        weekVisits.innerHTML = '<div style="font-size: 20px; line-height: 1.4;">Click to<br/>View Data</div>';
    }
    if (uniqueVisits) {
        uniqueVisits.innerHTML = '<div style="font-size: 20px; line-height: 1.4;">Click to<br/>View Data</div>';
    }

    if (topPagesList) {
        topPagesList.innerHTML = `
            <div style="text-align: center; color: #34495e; padding: 15px;">
                <div style="margin-bottom: 10px;">📊 Detailed analytics available on GoatCounter</div>
                <div style="font-size: 13px; color: #6c757d; margin-top: 8px;">
                    View visitor counts, page views, referrers, browsers, and more!
                </div>
            </div>
        `;
    }
}

// Make stat cards clickable
function makeCardsClickable() {
    const cards = document.querySelectorAll('#analytics-grid > div');
    const goatcounterUrl = 'https://stats-probability-visualizer.goatcounter.com';

    cards.forEach(card => {
        card.style.cursor = 'pointer';
        card.style.transition = 'transform 0.2s';

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });

        card.addEventListener('click', () => {
            window.open(goatcounterUrl, '_blank', 'noopener,noreferrer');
        });
    });
}

// Initialize analytics on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        updateAnalyticsDashboard();
        makeCardsClickable();
    });
} else {
    updateAnalyticsDashboard();
    makeCardsClickable();
}
