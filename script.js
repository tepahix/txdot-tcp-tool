console.log("TCP TOOL LOADING");

const tcpSelect = document.getElementById("tcpSelect");
const rumbleCheckbox = document.getElementById("rumble");
const tcpImage = document.getElementById("tcpImage");
const speedSelect = document.getElementById("speed");
const editMode = document.getElementById("editMode");
const labelLayer = document.getElementById("labelLayer");

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

    if (tcpImage) {
        tcpImage.src = path;
    }
}

// -----------------------------
// DATA LOADING
// -----------------------------

async function loadTCPData() {
    try {
        const res = await fetch(`data/${currentTCP}.json`);
        tcpData = await res.json();
    } catch (e) {
        console.warn("TCP data failed", e);
        tcpData = {};
    }
}

async function loadLayoutData() {
    const rumble = rumbleCheckbox?.checked ? "rumble" : "no-rumble";

    try {
        const res = await fetch(`data/${currentTCP}-${rumble}-layout.json`);
        layoutData = await res.json();
    } catch (e) {
        console.warn("Layout data failed", e);
        layoutData = {};
    }
}

// -----------------------------
// LABELS
// -----------------------------

function clearLabels() {
    if (labelLayer) labelLayer.innerHTML = "";
}

// -----------------------------
// SAFE X PARSER (FIXED)
// -----------------------------

function normalizeX(dataX) {
    // CASE 1: already array
    if (Array.isArray(dataX)) return dataX;

    // CASE 2: object like {0:10,1:20}
    if (dataX && typeof dataX === "object") {
        return Object.keys(dataX)
            .sort((a, b) => a - b)
            .map(k => dataX[k]);
    }

    // CASE 3: single value
    if (typeof dataX === "number") return [dataX];

    return [];
}

// -----------------------------
// RENDER
// -----------------------------

function renderLabels() {
    if (!labelLayer) return;

    clearLabels();

    const speed = speedSelect?.value;
    const data = tcpData?.[speed];

    if (!data || !layoutData) return;

    // -----------------------------
    // X (FIXED + FLEXIBLE)
    // -----------------------------

    const Xdata = normalizeX(data?.X);
    const Xlayout = Array.isArray(layoutData?.X) ? layoutData.X : [];

    console.log("X DEBUG:", { Xdata, Xlayout });

    const xCount = Math.min(Xdata.length, Xlayout.length);

    for (let i = 0; i < xCount; i++) {
        const value = Xdata[i];
        const pos = Xlayout[i];

        if (!pos) continue;

        createLabel("X", value, pos);
    }

    // -----------------------------
    // SINGLE LABELS
    // -----------------------------

    if (data?.B && layoutData?.B) {
        createLabel("B", data.B, layoutData.B);
    }

    if (data?.C && layoutData?.C) {
        createLabel("C", data.C, layoutData.C);
    }

    if (data?.R && layoutData?.R) {
        createLabel("R", data.R, layoutData.R);
    }
}

// -----------------------------
// LABEL CREATION
// -----------------------------

function createLabel(type, value, pos) {
    const el = document.createElement("div");
    el.className = "label";
    el.innerText = `${type}: ${value}`;

    el.style.left = pos.x + "%";
    el.style.top = pos.y + "%";

    labelLayer.appendChild(el);
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
