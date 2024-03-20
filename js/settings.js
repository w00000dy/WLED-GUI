document.getElementById("autostart").addEventListener("change", toggleAutostart);
document.getElementById("autostartHidden").addEventListener("change", toggleAutostart);
document.getElementById("tray").addEventListener("change", toggleTray);
document.getElementById("autoTurnOnOnlyAtAutostart").addEventListener("change", toggleLightAutostartOnlyAtAutostart);

// create settings json
if (localStorage.getItem("settings") === null) {
    log.verbose("No settings local storage item found. Creating one...");
    saveSettings();
}

loadSettings();
enableAutostart();
loadLights();

// Opens Github settings wiki page in default browser
function openWiki() {
    log.verbose("Opens Github settings wiki page in default browser");
    const { shell } = require('electron')
    shell.openExternal('https://github.com/WoodyLetsCode/WLED-GUI/wiki/Settings')
}

// enabels or disables the autostart of wled-gui
function toggleAutostart() {
    log.debug("toggleAutostart(): enabels or disables the autostart of wled-gui");
    const AutoLaunch = require('auto-launch');

    let wledAutoLauncher = new AutoLaunch({
        name: 'WLED'
    });

    if (document.getElementById("autostartHidden").checked) {
        document.getElementById("tray").checked = true;
        let settings = JSON.parse(localStorage.getItem("settings"));
        if (settings[1].value !== document.getElementById("tray").checked) {
            document.getElementById("restartRequired").style.display = "block";
        }
        // double quotes because auto-launch automatically encloses the appPath with double quotes when writing to the registry
        if (process.platform === "win32") {
            wledAutoLauncher.opts.appPath += '" --hidden"'
        } else {
            wledAutoLauncher.opts.appPath += ' --hidden'
        }
    }

    log.debug("AutoLaunch appPath: " + wledAutoLauncher.opts.appPath)

    if (document.getElementById("autostart").checked) {
        log.verbose("Enable autostart");
        wledAutoLauncher.enable();

    } else {
        log.verbose("Disable autostart");
        wledAutoLauncher.disable();
        document.getElementById("autostartHidden").checked = false;
    }
    document.getElementById("autostartHidden").disabled = !document.getElementById("autostart").checked;
    saveSettings();
}

// enables the autostart button
function enableAutostart() {
    if (process.platform == "win32" || process.platform == "linux") {
        log.verbose("Enable autostart because OS is win32 or linux");
        document.getElementById("autostart").disabled = false;
        checkAutostart();
    } else {
        checkAutostart();

        const AutoLaunch = require('auto-launch');
        let wledAutoLauncher = new AutoLaunch({
            name: 'WLED'
        });
        let promise = wledAutoLauncher.isEnabled();
        promise.then(function (value) {
            if (value) {
                log.verbose("Disable autostart because OS is not win32 or linux");
                wledAutoLauncher.disable();
                document.getElementById("autostart").checked = false;
            }
        }
        );

        log.debug("Disable autostart and autostartHidden button");
        document.getElementById("autostartHidden").checked = false;
        saveSettings();
    }
}

// enabels or disables the tray icon of wled-gui
function toggleTray() {
    if (document.getElementById("autostartHidden").checked) {
        this.checked = true;
    }
    let settings = JSON.parse(localStorage.getItem("settings"));
    if (settings[1].checked !== this.checked && !document.getElementById("autostartHidden").checked) {
        document.getElementById("restartRequired").style.display = "block";
    }
    saveSettings();
}

// check if autostart is already enabeld
function checkAutostart() {
    log.verbose("Check if autostart is already enabeld");
    const AutoLaunch = require('auto-launch');

    let wledAutoLauncher = new AutoLaunch({
        name: 'WLED'
    });

    let promise = wledAutoLauncher.isEnabled();

    promise.then(function (value) {
        log.debug("Autostart: " + value);
        document.getElementById("autostart").checked = value;
        document.getElementById("autostartHidden").disabled = !value;
    }
    );
}

// loads the lights into the list
function loadLights() {
    log.verbose("loads the lights into the list");
    let lights = JSON.parse(localStorage.getItem("lights"));
    for (let index = 0; index < lights.length; index++) {
        const element = lights[index];
        log.debug("Add light " + element.name + " to list");
        document.getElementById("autoTurnOn").innerHTML += "<li class=\"collection-item\"><div>" + element.name + "<a class=\"secondary-content\"><div class=\"switch\"><label>Off<input type=\"checkbox\" id=\"lightAutostart" + index + "\" onchange=\"addLightToAutostart(" + index + ", this.checked)\"><span class=\"lever\"></span>On</label></div></a></div></li>";
    }
    checkLightOptions(lights);
}

// check if a option is already enabeld for a light
function checkLightOptions(lights) {
    log.verbose("check if autostart is already enabeld for a light");
    for (let index = 0; index < lights.length; index++) {
        let autostart = lights[index].autostart;
        log.debug("Autostart is " + autostart + " for light " + lights[index].name);
        // autostart
        document.getElementById("lightAutostart" + index).checked = autostart;
    }
}

// adds a light to autostart so it will automaticcaly turn on with program start
function addLightToAutostart(id, state) {
    let lights = JSON.parse(localStorage.getItem("lights"));
    lights[id].autostart = state;
    localStorage.setItem("lights", JSON.stringify(lights));
}

// toggels if lights should turn on on every start or only on autostart
function toggleLightAutostartOnlyAtAutostart() {
    saveSettings();
}

// saves settings into local storage
function saveSettings() {
    log.verbose("saves settings into local storage");
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
        },
        {
            id: "autoTurnOnOnlyAtAutostart",
            type: "checkbox",
            value: document.getElementById("autoTurnOnOnlyAtAutostart").checked
        }
    ]
    log.debug(settings);
    localStorage.setItem("settings", JSON.stringify(settings));
}

// loads settings from local storage
function loadSettings() {
    log.verbose("load settings from local storage");
    let settings = JSON.parse(localStorage.getItem("settings"));
    settings.forEach(element => {
        if (element.type === "checkbox") {
            log.debug("Set checkbox with id " + element.id + " to " + element.value);
            document.getElementById(element.id).checked = element.value;
        }
    });
}