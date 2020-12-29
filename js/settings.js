document.getElementById("autostart").addEventListener("change", toggleAutostart);

checkAutostart();
loadLights();

// enabels or disables the autostart of wled-gui
function toggleAutostart() {
    const AutoLaunch = require('auto-launch');

    let wledAutoLauncher = new AutoLaunch({
        name: 'WLED'
    });

    wledAutoLauncher.opts.appPath += '" --hidden"'

    console.log(wledAutoLauncher)

    if (document.getElementById("autostart").checked) {
        console.log("Enable autostart");
        wledAutoLauncher.enable();

    } else {
        console.log("Disable autostart");
        wledAutoLauncher.disable();
    }
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