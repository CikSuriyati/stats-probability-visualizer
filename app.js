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
    const todayVisits = document.getElementById('today-visits');
    const weekVisits = document.getElementById('week-visits');
    const uniqueVisits = document.getElementById('unique-visits');
    const topPagesList = document.getElementById('top-pages-list');

    // Style for the "View" link/text in small cards
    const viewText = '<div style="font-size: 14px; line-height: 1.2; padding-top: 4px;">View<br/>Data</div>';

    // For other metrics we can't get without API, show a link
    if (todayVisits) todayVisits.innerHTML = viewText;
    if (weekVisits) weekVisits.innerHTML = viewText;
    if (uniqueVisits) uniqueVisits.innerHTML = viewText;

    if (topPagesList) {
        topPagesList.innerHTML = `
            <div style="text-align: center; color: #34495e; padding: 10px;">
                <div style="margin-bottom: 5px; font-weight: 500;">📊 View detailed page analytics</div>
                <a href="https://stats-probability-visualizer.goatcounter.com" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   style="color: #667eea; font-weight: 600; text-decoration: none; font-size: 13px;">
                    Open Dashboard →
                </a>
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
