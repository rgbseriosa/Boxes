const statuses = ["unchecked", "half-done", "full"]
let downloadOnSave = false;

const boxData = []

function createStatusBox(label, initialStatus) {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "10px";

    const box = document.createElement("div");
    box.classList.add("box");

    let currentIndex = statuses.indexOf(initialStatus);

    const updateBox = () => {
        box.classList.remove("half-done", "full");

        const status = statuses[currentIndex];
        if (status == "half-done") {
            box.classList.add("half-done")
        } else if(status == "full") {
            box.classList.add("full")
        }
    }

    
    box.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % statuses.length;
        updateBox();

        const boxIndex = boxData.findIndex(item => item.label === label);
        if (boxIndex !== -1) {
            boxData[boxIndex].status = statuses[currentIndex];
        }
    })
    
    updateBox();

    const labelText = document.createElement("span");
    labelText.textContent = label;
    labelText.style.fontFamily = "sans-serif";
    labelText.style.fontSize = "16px";

    wrapper.appendChild(box);
    wrapper.appendChild(labelText);

    boxData.push({
        label: label,
        status: statuses[currentIndex]
    });

    document.getElementById("box-container").appendChild(wrapper);
}

function saveDataToFile() {
    const jsonData = JSON.stringify(boxData, null, 2);

    if(downloadOnSave) {
        const blob = new Blob([jsonData], { type: "application/json"});
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "box_data.json";
        link.click();
    } else {
        localStorage.setItem("boxData", jsonData);
    }

    showSavedNotification();
}

function loadDataFromFile() {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = JSON.parse(e.target.result);
        if(Array.isArray(data)) {
            boxData.length = 0;
            document.getElementById("box-container").innerHTML = '';

            data.forEach(item => {
                createStatusBox(item.label, item.status);
            })
        }
    }

    reader.readAsText(file);
}

document.getElementById("add-button").addEventListener("click", () => {
    const label = prompt("Enter a label for this box:");
    if (label && label.trim() !== "") {
        createStatusBox(label, "unchecked");
    }
})

document.getElementById("save-button").addEventListener("click", saveDataToFile)

document.getElementById("load-button").addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = loadDataFromFile;
    input.click();
})

window.addEventListener("DOMContentLoaded", () => {
    const savedData = localStorage.getItem("boxData") 
    const savedSetting = localStorage.getItem("downloadOnSave")
    
    if(savedSetting !== null) {
        downloadOnSave = savedSetting === "true";
        document.getElementById("download-toggle").checked = downloadOnSave;
    }

    if(savedData) { 
        const parsedData = JSON.parse(savedData);
        parsedData.forEach(item => {
            createStatusBox(item.label, item.status)
        })
    }
})

document.getElementById("settings-button").addEventListener("click", () => {
    const settingsMenu = document.getElementById("settings-menu")
    settingsMenu.style.display = settingsMenu.style.display === "block" ? "none" : "block";
});

document.getElementById("download-toggle").addEventListener("change", (e) => {
    localStorage.setItem("downloadOnSave", e.target.checked);
})

function showSavedNotification() {
    const notif = document.createElement("div");
    notif.textContent = "Saved!";
    notif.style.position = "fixed";
    notif.style.bottom = "20px";
    notif.style.left = "20px";
    notif.style.backgroundColor = "#28a745";
    notif.style.color = "#fff";
    notif.style.padding = "10px 20px";
    notif.style.borderRadius = "8px";
    notif.style.fontSize = "16px";
    notif.style.boxShadow = " 0 4px 6px rgba(0,0,0,0.1)";
    notif.style.zIndex = "1000";
    notif.style.transform = "opacity 0.5s ease-in-out";

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.opacity = "0";
        setTimeout(() => {
            notif.remove();
        }, 500)
    }, 3000)
}