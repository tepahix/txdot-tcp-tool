const tcpSelect = document.getElementById("tcpSelect");
const rumbleCheckbox = document.getElementById("rumble");
const tcpImage = document.getElementById("tcpImage");
const labelLayer = document.getElementById("labelLayer");
const speedSelect = document.getElementById("speed");

let currentTCP = "1-2b";

let tcpData = {};
let layoutData = {};

// -----------------------------
// FILE LOADING
// -----------------------------

async function loadTCPData() {
    const res = await fetch(`data/${currentTCP}.json`);
    tcpData = await res.json();
}

async function loadLayoutData() {
    const rumble = rumbleCheckbox.checked ? "rumble" : "no-rumble";
    const res = await fetch(`data/${currentTCP}-${rumble}-layout.json`);
    layoutData = await res.json();
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

function renderLabels() {
    clearLabels();

    const speed = speedSelect.value;
    const data = tcpData[speed];

    if (!data || !layoutData) return;

    // X = ARRAY (multiple labels)
    if (Array.isArray(data.X) && Array.isArray(layoutData.X)) {

        data.X.forEach((value, index) => {
            const pos = layoutData.X[index];
            if (!pos) return;

            const label = document.createElement("div");
            label.className = "label";
            label.innerText = `X: ${value}`;

            label.style.left = pos.x + "%";
            label.style.top = pos.y + "%";

            labelLayer.appendChild(label);
        });

    } else {
        // fallback (if X is single later)
        if (data.X && layoutData.X) {
            const label = document.createElement("div");
            label.className = "label";
            label.innerText = `X: ${data.X}`;

            label.style.left = layoutData.X.x + "%";
            label.style.top = layoutData.X.y + "%";

            labelLayer.appendChild(label);
        }
    }

    // B (single)
    if (data.B && layoutData.B) {
        const label = document.createElement("div");
        label.className = "label";
        label.innerText = `B: ${data.B}`;

        label.style.left = layoutData.B.x + "%";
        label.style.top = layoutData.B.y + "%";

        labelLayer.appendChild(label);
    }

    // C (single)
    if (data.C && layoutData.C) {
        const label = document.createElement("div");
        label.className = "label";
        label.innerText = `C: ${data.C}`;

        label.style.left = layoutData.C.x + "%";
        label.style.top = layoutData.C.y + "%";

        labelLayer.appendChild(label);
    }

    // R (single)
    if (data.R && layoutData.R) {
        const label = document.createElement("div");
        label.className = "label";
        label.innerText = `R: ${data.R}`;

        label.style.left = layoutData.R.x + "%";
        label.style.top = layoutData.R.y + "%";

        labelLayer.appendChild(label);
    }
}

// -----------------------------
// MASTER UPDATE
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
    await loadLayoutData();

    updateAll();
});

speedSelect.addEventListener("change", function () {
    updateAll();
});

rumbleCheckbox.addEventListener("change", async function () {
    await loadLayoutData();
    updateAll();
});

// -----------------------------
// INIT
// -----------------------------

async function init() {
    await loadTCPData();
    await loadLayoutData();
    updateAll();
}

init();

init();
