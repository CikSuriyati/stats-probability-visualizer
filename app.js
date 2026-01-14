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
