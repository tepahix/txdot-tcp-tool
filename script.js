console.log("TCP TOOL LOADING");

const tcpSelect = document.getElementById("tcpSelect");
const rumbleCheckbox = document.getElementById("rumble");
const tcpImage = document.getElementById("tcpImage");
const speedSelect = document.getElementById("speed");
const editMode = document.getElementById("editMode");

const labelLayer = document.getElementById("labelLayer");

// 🔥 HARD SAFETY CHECK
if (!tcpImage) {
    console.error("Image element missing");
}

let currentTCP = "1-2b";

let tcpData = {};
let layoutData = {};

// -----------------------------
// IMAGE (ALWAYS SAFE)
// -----------------------------

function updateImage() {
    const rumble = rumbleCheckbox?.checked;

    const path = `Images/${currentTCP}/${currentTCP}-${rumble ? "rumble" : "no-rumble"}.png`;

    console.log("Image path:", path);

    tcpImage.src = path;
}

// -----------------------------
// DATA LOADING (SAFE)
// -----------------------------

async function loadTCPData() {
    try {
        const res = await fetch(`data/${currentTCP}.json`);
        tcpData = await res.json();
    } catch (e) {
        console.warn("TCP data failed");
        tcpData = {};
    }
}

async function loadLayoutData() {
    const rumble = rumbleCheckbox?.checked ? "rumble" : "no-rumble";

    try {
        const res = await fetch(`data/${currentTCP}-${rumble}-layout.json`);
        layoutData = await res.json();
    } catch (e) {
        console.warn("Layout data failed");
        layoutData = {};
    }
}

// -----------------------------
// LABELS (SAFE GUARDED)
// -----------------------------

function clearLabels() {
    if (!labelLayer) return;
    labelLayer.innerHTML = "";
}

function renderLabels() {
    if (!labelLayer) return;

    clearLabels();

    const speed = speedSelect?.value;
    const data = tcpData?.[speed];

    if (!data || !layoutData) return;

    // -----------------------------
    // X LABEL FIX (UPDATED)
    // -----------------------------

    if (Array.isArray(data.X) && Array.isArray(layoutData.X)) {

        const count = Math.min(data.X.length, layoutData.X.length);

        for (let i = 0; i < count; i++) {

            const value = data.X[i];
            const pos = layoutData.X[i];

            if (!pos) continue;

            createLabel("X", value, pos);
        }

        // 🔥 DEBUG WARNING IF MISMATCH
        if (data.X.length !== layoutData.X.length) {
            console.warn(
                `X mismatch in ${currentTCP} @ speed ${speed}`,
                "data.X:", data.X.length,
                "layout.X:", layoutData.X.length
            );
        }

    } else {
        console.warn("X not valid format:", data.X, layoutData.X);
    }

    // -----------------------------
    // SINGLE LABELS
    // -----------------------------

    if (data.B && layoutData.B) createLabel("B", data.B, layoutData.B);
    if (data.C && layoutData.C) createLabel("C", data.C, layoutData.C);
    if (data.R && layoutData.R) createLabel("R", data.R, layoutData.R);
}

function createLabel(type, value, pos) {
    const el = document.createElement("div");
    el.className = "label";
    el.innerText = `${type}: ${value}`;

    el.style.left = pos.x + "%";
    el.style.top = pos.y + "%";

    labelLayer.appendChild(el);
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

tcpSelect?.addEventListener("change", async function () {
    currentTCP = this.value;

    await loadTCPData();
    await loadLayoutData();

    updateAll();
});

speedSelect?.addEventListener("change", updateAll);

rumbleCheckbox?.addEventListener("change", async function () {
    await loadLayoutData();
    updateAll();
});

// -----------------------------
// INIT
// -----------------------------

async function init() {
    console.log("INIT START");

    updateImage();

    await loadTCPData();
    await loadLayoutData();

    renderLabels();

    console.log("INIT COMPLETE");
}

init();
