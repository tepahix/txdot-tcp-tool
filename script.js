const tcpSelect = document.getElementById("tcpSelect");
const rumbleCheckbox = document.getElementById("rumble");
const tcpImage = document.getElementById("tcpImage");
const labelLayer = document.getElementById("labelLayer");
const speedSelect = document.getElementById("speed");

// Current state
let currentTCP = "1-2b";

// -----------------------------
// IMAGE SYSTEM (UNCHANGED LOGIC)
// -----------------------------

function updateImage() {
    const rumble = rumbleCheckbox.checked;

    const imagePath =
        `Images/${currentTCP}/${currentTCP}-${rumble ? "rumble" : "no-rumble"}.png`;

    tcpImage.src = imagePath;
}

// -----------------------------
// LABEL SYSTEM (NEW)
// -----------------------------

function clearLabels() {
    labelLayer.innerHTML = "";
}

// Temporary demo data (we will replace with JSON later)
function getDemoLabels() {
    return {
        X: "500'",
        B: "200'",
        C: "750'",
        R: "50'"
    };
}

// Position map (temporary fixed test positions)
function getLabelPositions() {
    return {
        X: { x: 30, y: 25 },
        B: { x: 55, y: 35 },
        C: { x: 70, y: 55 },
        R: { x: 40, y: 70 }
    };
}

// Render labels on image
function renderLabels() {
    clearLabels();

    const values = getDemoLabels();
    const positions = getLabelPositions();

    Object.keys(values).forEach(key => {
        const label = document.createElement("div");
        label.className = "label";
        label.innerText = `${key}: ${values[key]}`;

        label.style.left = positions[key].x + "%";
        label.style.top = positions[key].y + "%";

        labelLayer.appendChild(label);
    });
}

// -----------------------------
// UPDATE EVERYTHING TOGETHER
// -----------------------------

function updateAll() {
    updateImage();
    renderLabels();
}

// -----------------------------
// EVENTS
// -----------------------------

tcpSelect.addEventListener("change", function () {
    currentTCP = this.value;
    updateAll();
});

rumbleCheckbox.addEventListener("change", function () {
    updateAll();
});

speedSelect.addEventListener("change", function () {
    updateAll();
});

// -----------------------------
// INITIAL LOAD
// -----------------------------

updateAll();
