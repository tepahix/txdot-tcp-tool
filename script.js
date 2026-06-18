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

const speed = speedSelect?.value;
const data = tcpData?.[speed];

const Xdata = data?.X;
const Xlayout = layoutData?.X;

console.log("X DEBUG RAW:", { Xdata, Xlayout });

if (Array.isArray(Xdata) && Array.isArray(Xlayout)) {

    const count = Math.min(Xdata.length, Xlayout.length);

    if (count === 0) {
        console.warn("X arrays exist but are empty");
    }

    for (let i = 0; i < count; i++) {
        const value = Xdata[i];
        const pos = Xlayout[i];

        if (!pos) {
            console.warn("Missing X layout at index", i);
            continue;
        }

        createLabel("X", value, pos);
    }

} else {
    console.warn("❌ X is not in expected format", {
        Xdata,
        Xlayout,
        typeData: typeof Xdata,
        typeLayout: typeof Xlayout
    });
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
