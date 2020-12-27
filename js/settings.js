document.getElementById("autostart").addEventListener("change", toggleAutostart);

checkAutostart();
loadLights();

function toggleAutostart() {
    const AutoLaunch = require('auto-launch');

    let wledAutoLauncher = new AutoLaunch({
        name: 'WLED'
    });

    if (document.getElementById("autostart").checked) {
        console.log("Enable autostart");
        wledAutoLauncher.enable();

    } else {
        console.log("Disable autostart");
        wledAutoLauncher.disable();
    }
}

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

function loadLights() {
    let lights = JSON.parse(localStorage.getItem("lights"));
    lights.forEach(element => {
        document.getElementById("autoTurnOn").innerHTML += "<li class=\"collection-item\"><div>" + element.name + "<a class=\"secondary-content\"><div class=\"switch\"><label>Off<input type=\"checkbox\"><span class=\"lever\"></span>On</label></div></a></div></li>";
    });
}