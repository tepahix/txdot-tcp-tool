const tcpSelect = document.getElementById("tcpSelect");
const rumbleCheckbox = document.getElementById("rumble");
const tcpImage = document.getElementById("tcpImage");

// Current state
let currentTCP = "1-2b";

// Build image path based on state
function updateImage() {
    const rumble = rumbleCheckbox.checked;

    const imagePath =
        `Images/${currentTCP}/${currentTCP}-${rumble ? "rumble" : "no-rumble"}.png`;

    tcpImage.src = imagePath;
}

// When TCP dropdown changes
tcpSelect.addEventListener("change", function () {
    currentTCP = this.value;
    updateImage();
});

// When rumble checkbox changes
rumbleCheckbox.addEventListener("change", function () {
    updateImage();
});

// Initial load
updateImage();
