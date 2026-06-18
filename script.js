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
// LOAD DATA
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
// IMAGE
// -----------------------------

function updateImage() {
    const rumble = rumbleCheckbox.checked;

    tcpImage.src =
        `Images/${currentTCP}/${currentTCP}-${rumble ? "rumble" : "no-rumble"}.png`;
}

// -----------------------------
// CLEAR
// -----------------------------

function clearLabels() {
    labelLayer.innerHTML = "";
}

// -----------------------------
// RENDER LABELS
// -----------------------------

function renderLabels() {
    clearLabels();

    const speed = speedSelect.value;
    const data = tcpData[speed];

    if (!data || !layoutData) return;

    // X array
    if (Array.isArray(data.X) && Array.isArray(layoutData.X)) {
        data.X.forEach((value, index) => {
            const pos = layoutData.X[index];
            if (!pos) return;

            createDraggableLabel("X", value, pos, index);
        });
    }

    // single labels
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
// DRAG LABEL CORE
// -----------------------------

function createDraggableLabel(type, value, pos, index = null) {
    const label = document.createElement("div");
    label.className = "label";
    label.innerText = `${type}: ${value}`;

    // initial position (percent-based)
    label.style.left = pos.x + "%";
    label.style.top = pos.y + "%";

    labelLayer.appendChild(label);

    let isDragging = false;

    label.addEventListener("mousedown", (e) => {
        if (!editMode.checked) return;

        isDragging = true;

        const container = labelLayer.getBoundingClientRect();

        function onMove(eMove) {
            if (!isDragging) return;

            const x = ((eMove.clientX - container.left) / container.width) * 100;
            const y = ((eMove.clientY - container.top) / container.height) * 100;

            // clamp inside image bounds
            const clampedX = Math.max(0, Math.min(100, x));
            const clampedY = Math.max(0, Math.min(100, y));

            label.style.left = clampedX + "%";
            label.style.top = clampedY + "%";

            // update memory (live editing)
            if (type === "X") {
                layoutData.X[index] = { x: clampedX, y: clampedY };
            } else {
                layoutData[type] = { x: clampedX, y: clampedY };
            }
        }

        function onUp() {
            isDragging = false;
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
        }

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    });
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
