const tcpSelect = document.getElementById("tcpSelect");
const rumbleCheckbox = document.getElementById("rumble");
const tcpImage = document.getElementById("tcpImage");
const labelLayer = document.getElementById("labelLayer");
const speedSelect = document.getElementById("speed");

let currentTCP = "1-2b";
let tcpData = {};

// -----------------------------
// LOAD TCP DATA (JSON)
// -----------------------------

async function loadTCPData() {
    const response = await fetch(`data/${currentTCP}.json`);
    tcpData = await response.json();
}

// -----------------------------
// IMAGE UPDATE
// -----------------------------

function updateImage() {
    const rumble = rumbleCheckbox.checked;

    const imagePath =
        `Images/${currentTCP}/${currentTCP}-${rumble ? "rumble" : "no-rumble"}.png`;

    tcpImage.src = imagePath;
}

// -----------------------------
// LABEL SYSTEM
// -----------------------------

function clearLabels() {
    labelLayer.innerHTML = "";
}

// Positions (TEMP - we will refine per TCP later)
function getLabelPositions() {
    return {
        X: { x: 30, y: 25 },
        B: { x: 55, y: 35 },
        C: { x: 70, y: 55 },
        R: { x: 40, y: 70 }
    };
}

function renderLabels() {
    clearLabels();

    const speed = speedSelect.value;
    const data = tcpData[speed];

    if (!data) return;

    const positions = getLabelPositions();

    Object.keys(data).forEach(key => {
        const label = document.createElement("div");
        label.className = "label";

        label.innerText = `${key}: ${data[key]}`;

        label.style.left = positions[key].x + "%";
        label.style.top = positions[key].y + "%";

        labelLayer.appendChild(label);
    });
}

// -----------------------------
// MASTER UPDATE FUNCTION
// -----------------------------

function updateAll() {
    updateImage();
    renderLabels();
}

// -----------------------------
// EVENTS
// -----------------------------

tcpSelect.addEventListener("change", async function () {
    currentTCP = this.value;
    await loadTCPData();
    updateAll();
});

speedSelect.addEventListener("change", function () {
    updateAll();
});

rumbleCheckbox.addEventListener("change", function () {
    updateAll();
});

// -----------------------------
// INIT
// -----------------------------

async function init() {
    await loadTCPData();
    updateAll();
}

init();
