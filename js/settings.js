document.getElementById("autostart").addEventListener("change", toggleAutostart);
document.getElementById("autostartHidden").addEventListener("change", toggleAutostart);
document.getElementById("tray").addEventListener("change", toggleTray);

// create settings json
if (localStorage.getItem("settings") === null) {
    console.log("No settings local storage item found. Creating one...");
    let settings = [];
    json = JSON.stringify(settings);
    localStorage.setItem("settings", settings);
}

checkAutostart();
loadSettings();
loadLights();

// enabels or disables the autostart of wled-gui
function toggleAutostart() {
    const AutoLaunch = require('auto-launch');

    let wledAutoLauncher = new AutoLaunch({
        name: 'WLED'
    });

    if (document.getElementById("autostartHidden").checked) {
        document.getElementById("tray").checked = true;
        // double quotes because auto-launch automatically encloses the appPath with double quotes when writing to the registry
        if (process.platform === "win32") {
            wledAutoLauncher.opts.appPath += '" --hidden"'
        } else {
            wledAutoLauncher.opts.appPath += ' --hidden'
        }
    }
    console.log(wledAutoLauncher)

    if (document.getElementById("autostart").checked) {
        console.log("Enable autostart");
        wledAutoLauncher.enable();

    } else {
        console.log("Disable autostart");
        wledAutoLauncher.disable();
        document.getElementById("autostartHidden").checked = false;
    }
    document.getElementById("autostartHidden").disabled = !document.getElementById("autostart").checked;
    saveSettings();
}

// enabels or disables the tray icon of wled-gui
function toggleTray() {
    if (document.getElementById("autostartHidden").checked) {
        this.checked = true;
    }
    saveSettings();
}

// check if autostart is already enabeld
function checkAutostart() {
    const AutoLaunch = require('auto-launch');

    let wledAutoLauncher = new AutoLaunch({
        name: 'WLED'
    });

    let promise = wledAutoLauncher.isEnabled();

    promise.then(function (value) {
        document.getElementById("autostart").checked = value;
        document.getElementById("autostartHidden").disabled = !value;
    }
    );
}

// loads the lights into the list
function loadLights() {
    let lights = JSON.parse(localStorage.getItem("lights"));
    for (let index = 0; index < lights.length; index++) {
        const element = lights[index];
        document.getElementById("autoTurnOn").innerHTML += "<li class=\"collection-item\"><div>" + element.name + "<a class=\"secondary-content\"><div class=\"switch\"><label>Off<input type=\"checkbox\" id=\"lightAutostart" + index + "\" onchange=\"addLightToAutostart(" + index + ", this.checked)\"><span class=\"lever\"></span>On</label></div></a></div></li>";
    }
    checkLightAutostart(lights);
}

// check if autostart is already enabeld for a light
function checkLightAutostart(lights) {
    for (let index = 0; index < lights.length; index++) {
        let autostart = lights[index].autostart;
        document.getElementById("lightAutostart" + index).checked = autostart;
    }
}

// adds a light to autostart so it will automaticcaly turn on with program start
function addLightToAutostart(id, state) {
    let lights = JSON.parse(localStorage.getItem("lights"));
    lights[id].autostart = state;
    localStorage.setItem("lights", JSON.stringify(lights));
}

// saves settings into local storage
function saveSettings() {
    let settings = [
        {
            id: "autostartHidden",
            type: "checkbox",
            value: document.getElementById("autostartHidden").checked
        },
        {
            id: "tray",
            type: "checkbox",
            value: document.getElementById("tray").checked
        }
    ]
    localStorage.setItem("settings", JSON.stringify(settings));
}

// loads settings from local storage
function loadSettings() {
    let settings = JSON.parse(localStorage.getItem("settings"));
    settings.forEach(element => {
        if (element.type === "checkbox") {
            document.getElementById(element.id).checked = element.value;
        }
    });
}