const tcpSelect = document.getElementById("tcpSelect");
const rumbleCheckbox = document.getElementById("rumble");
const tcpImage = document.getElementById("tcpImage");
const labelLayer = document.getElementById("labelLayer");
const speedSelect = document.getElementById("speed");
const editMode = document.getElementById("editMode");

let currentTCP = "1-2b";

let tcpData = {};
let layoutData = {};

// -----------------------------
// SAFE LOAD (NO CRASH VERSION)
// -----------------------------

async function loadTCPData() {
    try {
        const res = await fetch(`data/${currentTCP}.json`);
        tcpData = await res.json();
    } catch (err) {
        console.error("TCP data failed:", err);
        tcpData = {};
    }
}

async function loadLayoutData() {
    const rumble = rumbleCheckbox.checked ? "rumble" : "no-rumble";

    try {
        const res = await fetch(`data/${currentTCP}-${rumble}-layout.json`);
        layoutData = await res.json();
    } catch (err) {
        console.error("Layout data failed:", err);
        layoutData = {};
    }
}

// -----------------------------
// IMAGE (FORCED SAFE)
// -----------------------------

function updateImage() {
    const rumble = rumbleCheckbox.checked;

    tcpImage.src =
        `Images/${currentTCP}/${currentTCP}-${rumble ? "rumble" : "no-rumble"}.png`;
}

// -----------------------------
// LABELS (SAFE RENDER)
// -----------------------------

function clearLabels() {
    labelLayer.innerHTML = "";
}

function renderLabels() {
    clearLabels();

    const speed = speedSelect.value;
    const data = tcpData[speed];

    if (!data || !layoutData) return;

    if (Array.isArray(data.X) && Array.isArray(layoutData.X)) {
        data.X.forEach((value, index) => {
            const pos = layoutData.X[index];
            if (!pos) return;

            createDraggableLabel("X", value, pos, index);
        });
    }

    if (data.B && layoutData.B) {
        createDraggableLabel("B", data.B, layoutData.B);
    }

    if (data.C && layoutData.C) {
        createDraggableLabel("C", data.C, layoutData.C);
    }

    if (data.R && layoutData.R) {
        createDraggableLabel("R", data.R, layoutData.R);
    }
}

// -----------------------------
// SIMPLE LABEL (NO DRAG YET)
// -----------------------------

function createDraggableLabel(type, value, pos) {
    const label = document.createElement("div");
    label.className = "label";
    label.innerText = `${type}: ${value}`;

    label.style.left = pos.x + "%";
    label.style.top = pos.y + "%";

    labelLayer.appendChild(label);
}

// -----------------------------
// UPDATE
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

speedSelect.addEventListener("change", updateAll);

rumbleCheckbox.addEventListener("change", async function () {
    await loadLayoutData();
    updateAll();
});

editMode.addEventListener("change", updateAll);

// -----------------------------
// INIT
// -----------------------------

async function init() {
    await loadTCPData();
    await loadLayoutData();
    updateAll();
}

init();
