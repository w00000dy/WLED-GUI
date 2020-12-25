document.getElementById("autostart").addEventListener("change", toggleAutostart);

checkAutostart();

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