// const log = require('electron-log');

//    This is used to turn on lights automatically at startup

var lights = JSON.parse(localStorage.getItem("lights"));
var needAutostart = [];
for (let index = 0; index < lights.length; index++) {
    let autostart = lights[index].autostart;
    if (autostart) {
        let ip = lights[index].ip;
        needAutostart.push(ip);
    }
}

window.api.log.debug("Autostarted lights: " + needAutostart);

if (needAutostart.length === 0) {
    window.api.window.close();
} else {
    for (let index = 0; index < needAutostart.length; index++) {
        let ip = needAutostart[index];
        window.api.log.verbose("Turn on " + ip);
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://' + ip + "/win&T=1", true);
        xhr.onload = function () {
            if (index === (needAutostart.length - 1)) {
                window.api.log.debug("close");
                window.api.window.close();
            }
        };
        xhr.send();
    }
}